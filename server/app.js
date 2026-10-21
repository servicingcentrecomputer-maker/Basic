import crypto from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { loadSiteContent } from "./content.js";
import { contactSchema, toFieldErrors } from "./contact-schema.js";
import { saveSubmission } from "./submissions.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(here, "..");

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

const rateLimitDisabled = process.env.DISABLE_RATE_LIMIT === "1";

function sameOrigin(req, res, next) {
  const origin = req.get("origin");

  // Same-origin browser requests always include Origin on POST. A missing
  // Origin is allowed for server-to-server tools such as curl.
  if (!origin) {
    return next();
  }

  const host = req.get("host");
  const permitted = new Set(allowedOrigins);
  if (host) {
    permitted.add(`http://${host}`);
    permitted.add(`https://${host}`);
  }

  if (permitted.has(origin.replace(/\/$/, ""))) {
    return next();
  }

  return res.status(403).json({
    ok: false,
    error: "This request could not be verified. Please refresh the page and try again.",
  });
}

export function createApp(options = {}) {
  const app = express();
  const distDir = options.distDir ?? path.join(rootDir, "dist");
  const indexFile = path.join(distDir, "index.html");

  // Allow the structured-data block in the built index.html without weakening
  // script-src with 'unsafe-inline'. Hashes are computed from the actual file.
  const indexHtml = existsSync(indexFile) ? readFileSync(indexFile, "utf8") : "";
  const inlineScriptHashes = [
    ...indexHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
  ]
    .filter((match) => match[1].trim() !== "")
    .map(
      (match) =>
        `'sha256-${crypto.createHash("sha256").update(match[1]).digest("base64")}'`
    );

  app.disable("x-powered-by");
  app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", ...inlineScriptHashes],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: null,
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "16kb" }));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => rateLimitDisabled,
    message: { ok: false, error: "Too many requests. Please try again shortly." },
  });

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => rateLimitDisabled,
    message: {
      ok: false,
      error: "Too many enquiries from this connection. Please email hello@jordanellis.studio directly.",
    },
  });

  app.use("/api", apiLimiter);

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, service: "portfolio-api", uptime: Math.round(process.uptime()) });
  });

  app.get("/api/content", async (req, res, next) => {
    try {
      const content = await loadSiteContent();
      res.set("Cache-Control", "no-cache");
      res.json(content);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/contact", sameOrigin, contactLimiter, async (req, res, next) => {
    try {
      const body = req.body ?? {};

      // The field is visually hidden and only bots fill it in. Return a normal
      // success response so automated submissions do not learn the difference.
      if (typeof body.website === "string" && body.website.trim() !== "") {
        return res.status(201).json({
          ok: true,
          id: crypto.randomUUID(),
          message: "Thanks — your enquiry is with me.",
        });
      }

      const startedAt = Number(body.startedAt);
      if (Number.isFinite(startedAt) && Date.now() - startedAt < 1200) {
        return res.status(422).json({
          ok: false,
          error: "That was a little too quick. Please take a moment and try again.",
          fields: { form: "Please take a moment and try again." },
        });
      }

      const parsed = contactSchema.safeParse(body);
      if (!parsed.success) {
        return res.status(422).json({
          ok: false,
          error: "Please fix the highlighted fields and try again.",
          fields: toFieldErrors(parsed.error),
        });
      }

      const data = parsed.data;
      const id = crypto.randomUUID();

      await saveSubmission({
        id,
        receivedAt: new Date().toISOString(),
        name: data.name,
        email: data.email,
        projectType: data.projectType || null,
        budget: data.budget || null,
        message: data.message,
        consent: true,
      });

      console.log(`[contact] stored enquiry ${id}`);

      return res.status(201).json({
        ok: true,
        id,
        message: "Thanks — your enquiry is with me. I'll reply within two business days.",
      });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", (req, res) => {
    res.status(404).json({ ok: false, error: "API endpoint not found." });
  });

  if (existsSync(indexFile)) {
    app.use(
      express.static(distDir, {
        index: false,
        setHeaders(res, filePath) {
          const hashedAsset = /-[A-Za-z0-9_-]{8,}\.(js|css|woff2?|svg)$/.test(filePath);
          res.setHeader(
            "Cache-Control",
            hashedAsset ? "public, max-age=31536000, immutable" : "public, max-age=3600"
          );
        },
      })
    );

    // Client-side routes such as /about need the SPA shell. Asset requests
    // that reach this point should still 404 rather than receive HTML.
    app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
      if (!req.accepts("html")) {
        return next();
      }
      return res.sendFile(indexFile);
    });
  }

  app.use((req, res) => {
    res.status(404).send("Not found");
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error?.type === "entity.parse.failed") {
      return res.status(400).json({ ok: false, error: "Invalid JSON body." });
    }
    if (error?.type === "entity.too.large") {
      return res.status(413).json({ ok: false, error: "Request body is too large." });
    }

    console.error("[server]", error);
    return res.status(500).json({
      ok: false,
      error: "Something went wrong on my end. Please email hello@jordanellis.studio.",
    });
  });

  return app;
}
