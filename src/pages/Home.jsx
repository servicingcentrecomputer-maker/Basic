import Button from "../components/Button.jsx";
import ClientsMarquee from "../components/ClientsMarquee.jsx";
import CtaBand from "../components/CtaBand.jsx";
import HeroVisual from "../components/HeroVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";
import Stats from "../components/Stats.jsx";
import TextLink from "../components/TextLink.jsx";
import WorkCard from "../components/WorkCard.jsx";
import { useSiteContent } from "../content/SiteContentContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const services = [
  {
    number: "01",
    title: "Website design",
    description:
      "A clear, considered visual system built around your story, your audience, and the action you want people to take.",
  },
  {
    number: "02",
    title: "Front-end development",
    description:
      "Hand-built, responsive HTML and CSS. Fast to load, easy to maintain, and comfortable on every screen size.",
  },
  {
    number: "03",
    title: "Care & support",
    description:
      "Small updates, hosting help, and a steady hand after launch — so your site keeps up as your business grows.",
  },
];

export default function Home() {
  const { content } = useSiteContent();
  const { profile, availability, stats, projects, clients, testimonial } = content;

  usePageMeta({
    title: "Jordan Ellis — Independent Web Designer & Developer",
    description:
      "Jordan Ellis designs and builds clear, considered websites for small businesses, studios, and independent makers. Strategy, design, and hand-written code. Based in Portland, Oregon.",
  });

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              Independent designer &amp; developer · {profile.location}
            </p>
            <h1>
              Websites with clarity, character, and{" "}
              <em className="accent">a job to do.</em>
            </h1>
            <p className="lead">
              I help small businesses and independent makers turn what they do
              into a website that feels like them — and works hard for them.
              Strategy, design, and code, all in one place.
            </p>
            <div className="hero-actions">
              <Button to="/contact">Start a project</Button>
              <Button href="#work" variant="secondary" withIcon={false}>
                See selected work
              </Button>
            </div>
            <Stats stats={stats} />
          </div>

          <HeroVisual availability={availability} />
        </div>
      </section>

      <ClientsMarquee clients={clients} />

      <section className="section" id="work" aria-labelledby="work-heading">
        <div className="container">
          <SectionHead
            eyebrow="Selected work"
            title="Recent projects, built to last."
            id="work-heading"
            action={<TextLink to="/services">Explore services</TextLink>}
          />

          <div className="work-grid">
            {projects.map((project, index) => (
              <WorkCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <SectionHead
            eyebrow="What I do"
            title="Everything needed. Nothing extra."
            id="services-heading"
            lead="A small, focused set of services — delivered with care from the first conversation to the final file."
          />

          <div className="services-list">
            {services.map((service, index) => (
              <Reveal
                as="div"
                className="service-row"
                key={service.number}
                delay={index * 50}
              >
                <span className="service-num" aria-hidden="true">
                  {service.number}
                </span>
                <h3>{service.title}</h3>
                <p className="service-desc">{service.description}</p>
                <span className="service-mark" aria-hidden="true">
                  &#8599;
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <Reveal className="about-media">
            <img
              src="/assets/portrait.svg"
              alt="Stylized editorial portrait of Jordan Ellis against a sage-green circle, wearing glasses and a rust-coloured sweater"
              width="800"
              height="1000"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal className="about-copy" delay={80}>
            <p className="eyebrow">A little background</p>
            <h2>Design is a conversation. I write the code, too.</h2>
            <p>
              I'm Jordan — a designer and front-end developer working from
              Portland, Oregon. For the last decade I've helped small teams look
              clearer, sound more like themselves, and give visitors a good
              reason to stay.
            </p>
            <p>
              No layers, no hand-offs, no mysterious process. Just thoughtful
              design, clean code, and a person who picks up the phone.
            </p>
            <p className="signature">— Jordan</p>
            <TextLink to="/about">More about me</TextLink>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="quote-band">
            <blockquote>
              {testimonial.quoteStart}
              <em>{testimonial.quoteEmphasis}</em>
              {testimonial.quoteEnd}
            </blockquote>
            <p className="quote-source">{testimonial.source}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Have a project in mind?"
        text="Tell me where you're headed. I'll help you get there — clearly, calmly, and with good coffee in hand."
      />
    </>
  );
}
