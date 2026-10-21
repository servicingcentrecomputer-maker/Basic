import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const externalBaseUrl = process.env.SMOKE_BASE_URL;
const results = [];
let server;
let tempDir;
let baseUrl = externalBaseUrl;

if (!baseUrl) {
  // Run against an isolated instance so repeated test runs do not trip the
  // production contact rate limit or write to real enquiry storage.
  tempDir = await mkdtemp(path.join(os.tmpdir(), "portfolio-smoke-"));
  process.env.DISABLE_RATE_LIMIT = "1";
  process.env.SUBMISSIONS_DIR = tempDir;

  const { createApp } = await import("../server/app.js");
  const app = createApp();

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}`;
  console.log(`Started isolated test server at ${baseUrl}`);
}

async function check(label, request, expectedStatus) {
  const response = await request;
  const text = await response.text();
  let body = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep the raw text for HTML or empty responses.
  }
  const passed = response.status === expectedStatus;
  results.push({ label, expectedStatus, status: response.status, passed });
  console.log(
    `${passed ? "PASS" : "FAIL"} ${label} — expected ${expectedStatus}, got ${response.status}`
  );
  if (!passed) {
    console.log(body);
  }
  return body;
}

function jsonRequest(requestPath, payload, headers = {}) {
  return fetch(`${baseUrl}${requestPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
}

const startedAt = Date.now() - 5000;

try {
  await check("health", fetch(`${baseUrl}/api/health`), 200);
  await check("content", fetch(`${baseUrl}/api/content`), 200);
  await check(
    "valid enquiry",
    jsonRequest("/api/contact", {
      name: "Smoke Test",
      email: "smoke@example.com",
      projectType: "new-website",
      budget: "2000-4000",
      message: "This is an automated smoke-test enquiry with enough characters.",
      consent: true,
      website: "",
      startedAt,
    }),
    201
  );
  await check(
    "invalid enquiry",
    jsonRequest("/api/contact", {
      name: "A",
      email: "not-an-email",
      message: "short",
      consent: false,
      startedAt,
    }),
    422
  );
  await check(
    "honeypot",
    jsonRequest("/api/contact", {
      name: "Spam Bot",
      email: "bot@example.com",
      message: "This message is long enough for the schema to accept it.",
      consent: true,
      website: "https://spam.example",
      startedAt,
    }),
    201
  );
  await check(
    "cross-origin rejection",
    jsonRequest(
      "/api/contact",
      { name: "Test" },
      { Origin: "https://evil.example" }
    ),
    403
  );
  await check("unknown API route", fetch(`${baseUrl}/api/nope`), 404);
  await check(
    "SPA fallback",
    fetch(`${baseUrl}/about`, { headers: { Accept: "text/html" } }),
    200
  );
} finally {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
  }
}

const failed = results.filter((result) => !result.passed);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exitCode = failed.length === 0 ? 0 : 1;
