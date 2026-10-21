import Button from "../components/Button.jsx";
import CtaBand from "../components/CtaBand.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const faqs = [
  {
    question: "What's included in a typical project?",
    answer:
      "Every project is different, but a standard site includes up to five pages, a custom responsive design, hand-written HTML and CSS, basic on-page SEO (unique titles, meta descriptions, semantic markup, and image alt text), a contact form with client-side validation, and a staging link for review before launch. You receive the full source files at handover.",
  },
  {
    question: "How long will my website take?",
    answer:
      "Most small websites take two to four weeks from kickoff to launch. The biggest variable is content — if text and images are ready to go, things move quickly. I'll give you a clear timeline before we begin and keep you posted at each stage.",
  },
  {
    question: "Do you write the content?",
    answer:
      "I don't write full copy as part of the standard scope, but I'll help you shape and edit what you have, suggest a structure, and flag anything that could be clearer. If you need full copywriting, I can bring in a trusted collaborator and include it in the quote.",
  },
  {
    question: "Can I update the site myself after launch?",
    answer:
      "Yes. The sites are built with clean, component-based code, so small text and image changes are straightforward. Portfolio projects, statistics, and availability can also be updated from a single content file. At handover I'll walk you through the files and leave you with simple notes. If you'd rather not touch it, the Care plan covers ongoing updates.",
  },
  {
    question: "Do you work with clients outside Portland?",
    answer:
      "Absolutely. Most of my clients are remote, and the process works well over email, video calls, and shared documents. I've worked with people across the US, UK, and Europe — time zones haven't been a problem yet.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "A short note about what you're building, any existing brand assets (logo, colors, photography), and a few examples of sites you like. Don't worry if it's not all figured out — the kickoff conversation is where we fill in the gaps.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Basic projects include one consolidated round of revisions after the first staging link is shared. You gather all your feedback in one place, I work through it, and you receive a final version to review. Additional rounds or new scope can be quoted separately.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You get 30 days of post-launch support for questions and small fixes. After that, you can look after the site yourself or join the Care plan for ongoing updates, backups, and priority support.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes — projects are usually split into two payments: 50% to reserve your spot and 50% before launch. For larger projects, we can arrange a schedule that works for both of us.",
  },
];

export default function Faq() {
  usePageMeta({
    title: "Frequently Asked Questions — Jordan Ellis",
    description:
      "Answers to common questions about working with Jordan Ellis: project scope, timelines, content, revisions, payments, and ongoing website support.",
  });

  return (
    <>
      <PageHero
        eyebrow="Frequently asked questions"
        title={
          <>
            Good questions, <em className="accent">answered.</em>
          </>
        }
        lead="A few things people usually want to know before we start. If yours isn't here, just send me a note — I'm happy to talk it through."
      />

      <section className="section" aria-labelledby="faq-heading">
        <div className="container faq-layout">
          <div>
            <h2 className="visually-hidden" id="faq-heading">
              Frequently asked questions
            </h2>
            <Reveal className="faq-list">
              {faqs.map((faq, index) => (
                <details className="faq-item" key={faq.question} open={index === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </Reveal>
          </div>

          <Reveal as="aside" className="faq-aside" delay={80}>
            <h2>Still curious?</h2>
            <p>
              If your question isn't here, send me a note. I reply within two
              business days — usually sooner.
            </p>
            <Button variant="light" to="/contact">
              Ask me directly
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Prefer a proper conversation?"
        text="No pressure and no jargon. Tell me what you're working on and we'll take it from there."
      />
    </>
  );
}
