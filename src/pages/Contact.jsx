import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { submitEnquiry } from "../api/client.js";
import Button from "../components/Button.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { useSiteContent } from "../content/SiteContentContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const emptyForm = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
  consent: false,
  website: "",
};

const packageMap = {
  launch: "new-website",
  studio: "new-website",
  care: "care-support",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  } else if (form.name.trim().length > 80) {
    errors.name = "Please use 80 characters or fewer.";
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  } else if (form.email.trim().length > 254) {
    errors.email = "Please use a shorter email address.";
  }

  if (form.message.trim().length < 20) {
    errors.message = "Please share at least 20 characters about your project.";
  } else if (form.message.trim().length > 3000) {
    errors.message = "Please keep your message under 3,000 characters.";
  }

  if (!form.consent) {
    errors.consent = "Please confirm that I can contact you about this enquiry.";
  }

  return errors;
}

export default function Contact() {
  const { content } = useSiteContent();
  const { profile, availability } = content;
  const [searchParams] = useSearchParams();
  const packageParam = searchParams.get("package");

  const [form, setForm] = useState({
    ...emptyForm,
    projectType: packageMap[packageParam] ?? "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [reference, setReference] = useState("");
  const formRef = useRef(null);
  const successRef = useRef(null);
  const startedAt = useRef(Date.now());

  usePageMeta({
    title: "Contact Jordan Ellis — Start a Project",
    description:
      "Get in touch with Jordan Ellis, an independent web designer and developer in Portland, Oregon. Share your project details, ask a question, or start a conversation.",
  });

  useEffect(() => {
    const mapped = packageMap[packageParam];
    if (mapped) {
      setForm((current) => ({ ...current, projectType: mapped }));
    }
  }, [packageParam]);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }

    if (status === "error") {
      setStatus("idle");
      setServerMessage("");
    }
  };

  const focusFirstError = (fieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (!first) {
      return;
    }
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      setServerMessage("");
      focusFirstError(nextErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});
    setServerMessage("");

    try {
      const data = await submitEnquiry({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        startedAt: startedAt.current,
      });

      setReference(data.id ?? "");
      setStatus("success");
      setForm({ ...emptyForm });
      startedAt.current = Date.now();
    } catch (error) {
      setStatus("error");
      setServerMessage(error.message);
      if (error.fields && Object.keys(error.fields).length > 0) {
        setErrors(error.fields);
        focusFirstError(error.fields);
      }
    }
  };

  const sendAnother = () => {
    setStatus("idle");
    setErrors({});
    setServerMessage("");
    setReference("");
    setForm({ ...emptyForm });
    startedAt.current = Date.now();
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector('[name="name"]')?.focus();
    });
  };

  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);
  const phoneHref = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;
  const dotClass = availability.available
    ? "status-dot"
    : "status-dot status-dot--closed";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let's make something <em className="accent">clear.</em>
          </>
        }
        lead="Tell me where you're headed. I read every note and reply within two business days — usually sooner, with a good question or two."
      />

      <section className="section">
        <div className="container contact-layout">
          <Reveal className="contact-intro">
            <p className="eyebrow">Say hello</p>
            <h2>Good projects start with a hello.</h2>
            <p>
              No formal brief required. A few sentences about what you're
              building, who it's for, and what's not working yet is plenty to get
              us started.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <span>Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
              <div className="contact-method">
                <span>Phone</span>
                <a href={phoneHref}>{profile.phoneDisplay}</a>
              </div>
              <div className="contact-method">
                <span>Studio hours</span>
                <p>{profile.hours}</p>
              </div>
              <div className="contact-method">
                <span>Based in</span>
                <p>
                  {profile.location} — {profile.working.toLowerCase()}
                </p>
              </div>
            </div>

            <p className="availability">
              <span className={dotClass} aria-hidden="true" />
              {availability.booking}
            </p>

            <div className="next-steps">
              <div className="next-step">
                <span>01</span>
                <p>
                  I'll reply within two business days with a few questions or a
                  suggested next step.
                </p>
              </div>
              <div className="next-step">
                <span>02</span>
                <p>
                  We'll have a short, no-pressure call and agree on scope,
                  timeline, and budget.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap" delay={80}>
            {status === "success" ? (
              <div className="form-success" role="status" aria-live="polite">
                <span className="form-success-mark" aria-hidden="true">
                  ✓
                </span>
                <h2 tabIndex={-1} ref={successRef}>
                  Thank you — message received.
                </h2>
                <p>
                  Your enquiry is with me. I'll read it properly and reply within
                  two business days, usually sooner.
                </p>
                {reference ? (
                  <p className="form-reference">
                    Reference <strong>{reference.slice(0, 8).toUpperCase()}</strong>
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  withIcon={false}
                  onClick={sendAnother}
                >
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <>
                <h2>Project enquiry</h2>
                <p className="form-intro">
                  Share a little context below. Fields marked with an asterisk
                  are required.
                </p>

                {status === "error" && serverMessage ? (
                  <div className="form-alert" role="alert">
                    {serverMessage}
                  </div>
                ) : null}

                <form
                  ref={formRef}
                  action="/api/contact"
                  method="post"
                  noValidate
                  aria-busy={status === "submitting"}
                  onSubmit={handleSubmit}
                >
                  <div className="form-grid">
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="name">
                          Name <span className="req" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          autoComplete="name"
                          placeholder="Your name"
                          value={form.name}
                          onChange={updateField}
                          required
                          aria-required="true"
                          aria-invalid={errors.name ? "true" : undefined}
                          aria-describedby={describedBy("name")}
                        />
                        {errors.name ? (
                          <p className="field-error" id="name-error">
                            {errors.name}
                          </p>
                        ) : null}
                      </div>

                      <div className="field">
                        <label htmlFor="email">
                          Email <span className="req" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={updateField}
                          required
                          aria-required="true"
                          aria-invalid={errors.email ? "true" : undefined}
                          aria-describedby={describedBy("email")}
                        />
                        {errors.email ? (
                          <p className="field-error" id="email-error">
                            {errors.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="project-type">Project type</label>
                        <select
                          id="project-type"
                          name="projectType"
                          value={form.projectType}
                          onChange={updateField}
                        >
                          <option value="">Select one</option>
                          <option value="new-website">New website</option>
                          <option value="website-refresh">Website refresh</option>
                          <option value="landing-page">Landing page</option>
                          <option value="care-support">Care &amp; support</option>
                          <option value="something-else">Something else</option>
                        </select>
                      </div>

                      <div className="field">
                        <label htmlFor="budget">Budget range</label>
                        <select
                          id="budget"
                          name="budget"
                          value={form.budget}
                          onChange={updateField}
                        >
                          <option value="">Select one</option>
                          <option value="under-2000">Under $2,000</option>
                          <option value="2000-4000">$2,000–$4,000</option>
                          <option value="4000-8000">$4,000–$8,000</option>
                          <option value="8000-plus">$8,000+</option>
                          <option value="not-sure">Not sure yet</option>
                        </select>
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="message">
                        What are you working on?{" "}
                        <span className="req" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="A few sentences about your business, your goals, and anything you'd like to change."
                        minLength={20}
                        maxLength={3000}
                        value={form.message}
                        onChange={updateField}
                        required
                        aria-required="true"
                        aria-invalid={errors.message ? "true" : undefined}
                        aria-describedby={describedBy("message")}
                      />
                      {errors.message ? (
                        <p className="field-error" id="message-error">
                          {errors.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="honeypot" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={updateField}
                      />
                    </div>

                    <div>
                      <label className="checkbox-field" htmlFor="consent">
                        <input
                          type="checkbox"
                          id="consent"
                          name="consent"
                          checked={form.consent}
                          onChange={updateField}
                          required
                          aria-required="true"
                          aria-invalid={errors.consent ? "true" : undefined}
                          aria-describedby={describedBy("consent")}
                        />
                        <span>
                          I'm happy to be contacted about this enquiry. No
                          newsletters, no sharing my details.
                        </span>
                      </label>
                      {errors.consent ? (
                        <p className="field-error" id="consent-error">
                          {errors.consent}
                        </p>
                      ) : null}
                    </div>

                    <div className="form-footer">
                      <Button type="submit" disabled={status === "submitting"}>
                        {status === "submitting" ? "Sending…" : "Send enquiry"}
                      </Button>
                      <p className="form-note">
                        Sent securely to the studio. Prefer to write directly?{" "}
                        <a href={`mailto:${profile.email}`}>Email me instead</a>.
                      </p>
                    </div>
                  </div>
                </form>
              </>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
