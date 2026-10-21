import Button from "../components/Button.jsx";
import CtaBand from "../components/CtaBand.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";
import TextLink from "../components/TextLink.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const services = [
  {
    title: "Website design",
    description:
      "Thoughtful, distinctive design that makes your business easy to understand and hard to forget. Built around your content — not the other way around.",
    items: [
      "Sitemap and content structure",
      "Wireframes and visual direction",
      "Responsive page layouts",
      "Typography and brand styling",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16M6 16 16 6l4 4L10 20H6v-4Z" />
        <path d="m13 7 4 4" />
      </svg>
    ),
  },
  {
    title: "Front-end development",
    description:
      "Semantic HTML and modern, maintainable CSS, written by hand. Lightweight, accessible, and straightforward for anyone who needs to maintain it later.",
    items: [
      "Semantic HTML and clean CSS",
      "Mobile-first responsive breakpoints",
      "Accessibility and performance basics",
      "SEO-ready markup and metadata",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
      </svg>
    ),
  },
  {
    title: "Landing pages",
    description:
      "A single, focused page for a launch, campaign, or service. Clear structure, one job, and a direct path from first impression to enquiry.",
    items: [
      "One-page structure and copy guidance",
      "Custom visual design",
      "Contact or sign-up form styling",
      "Analytics-ready setup",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M7 13h5M7 17h9" />
      </svg>
    ),
  },
  {
    title: "Care & support",
    description:
      "Your site shouldn't become a to-do list. A simple monthly plan keeps the small things handled so you can get on with the real work.",
    items: [
      "Content and image updates",
      "Small design changes",
      "Backups and hosting guidance",
      "Priority email support",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" />
      </svg>
    ),
  },
];

const process = [
  {
    number: "01",
    title: "Listen",
    text: "A relaxed kickoff to understand your business, your audience, and what success looks like. Then I gather your words, images, and any brand assets.",
  },
  {
    number: "02",
    title: "Shape",
    text: "We agree on the sitemap and content structure. I sketch the key pages and define a clear visual direction before any code is written.",
  },
  {
    number: "03",
    title: "Build",
    text: "Design and development happen together. You get a staging link to follow along, with regular check-ins and room for small course corrections.",
  },
  {
    number: "04",
    title: "Launch",
    text: "We test every page and breakpoint, polish the details, and hand over clean source files. Then I stick around for questions after launch.",
  },
];

const packages = [
  {
    package: "launch",
    label: "Launch",
    title: "A focused first site",
    price: "$1,800",
    cadence: "starting from",
    description:
      "For new or small businesses that need a clear, credible place to send people.",
    items: [
      "Up to 3 custom pages",
      "Responsive design and build",
      "Basic SEO setup",
      "One consolidated revision round",
      "30-day post-launch support",
    ],
    featured: false,
    cta: "Enquire about Launch",
  },
  {
    package: "studio",
    label: "Studio",
    title: "The full picture",
    price: "$3,200",
    cadence: "starting from",
    description:
      "For growing businesses with more to say and a little more ground to cover.",
    items: [
      "Up to 5 custom pages",
      "Contact form and API routing",
      "Basic SEO setup",
      "One consolidated revision round",
      "30-day post-launch support",
    ],
    featured: true,
    cta: "Enquire about Studio",
  },
  {
    package: "care",
    label: "Care",
    title: "Ongoing support",
    price: "$90",
    cadence: "per month",
    description:
      "For keeping a live site fresh, healthy, and quietly looked after.",
    items: [
      "Monthly content updates",
      "Small design adjustments",
      "Backups and hosting help",
      "Priority email support",
      "No long-term lock-in",
    ],
    featured: false,
    cta: "Ask about Care",
  },
];

export default function Services() {
  usePageMeta({
    title: "Website Design & Development Services — Jordan Ellis",
    description:
      "Explore web design, front-end development, landing page, and website care services from Jordan Ellis. Clear process, hand-built websites, and transparent starting prices.",
  });

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Websites that do the <em className="accent">quiet work.</em>
          </>
        }
        lead="From first strategy to final line of code, I design and build small, thoughtful websites for people with something worth sharing. Here's how I can help."
      />

      <section className="section">
        <div className="container">
          <div className="service-cards">
            {services.map((service, index) => (
              <Reveal
                as="article"
                className="service-card"
                key={service.title}
                delay={index * 50}
              >
                <span className="service-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="process-heading">
        <div className="container">
          <SectionHead
            eyebrow="How it works"
            title="A simple process, made to fit."
            id="process-heading"
            lead="No black boxes. You'll always know what's happening, what's next, and what I need from you."
          />
          <div className="process-grid">
            {process.map((step, index) => (
              <Reveal
                as="div"
                className="process-step"
                key={step.number}
                delay={index * 50}
              >
                <span className="process-num">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-heading">
        <div className="container">
          <SectionHead
            eyebrow="Working together"
            title="The basics, in plain numbers."
            id="pricing-heading"
            lead="Every project is quoted individually, but these starting points should give you a useful sense of scope."
          />

          <div className="pricing-grid">
            {packages.map((item, index) => (
              <Reveal
                as="article"
                className={`price-card${item.featured ? " price-card--featured" : ""}`}
                key={item.package}
                delay={index * 50}
              >
                <span className="price-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p className="price">
                  {item.price} <span>{item.cadence}</span>
                </p>
                <p>{item.description}</p>
                <ul>
                  {item.items.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Button to={`/contact?package=${item.package}`}>{item.cta}</Button>
              </Reveal>
            ))}
          </div>

          <p className="pricing-note">
            All prices are starting points and depend on scope, content, and
            complexity. Have a question before we start?{" "}
            <TextLink to="/faq">Read the FAQ</TextLink>.
          </p>
        </div>
      </section>

      <CtaBand
        title="Not sure what you need yet?"
        text="That's completely normal. Tell me a little about your project and we'll figure out the right shape together."
      />
    </>
  );
}
