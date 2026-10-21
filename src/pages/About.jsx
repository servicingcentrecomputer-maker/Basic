import CtaBand from "../components/CtaBand.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const values = [
  {
    number: "01",
    title: "Clarity over cleverness",
    text: "The best interface is the one you don't have to think about. I'd rather be understood than admired — and I'll always choose the clearer option.",
  },
  {
    number: "02",
    title: "Small details, big difference",
    text: "Type, spacing, loading speed, the wording of a button. The details aren't decoration; they're the experience itself. I sweat them so you don't have to.",
  },
  {
    number: "03",
    title: "No hand-offs",
    text: "You work with me from the first sketch to the final deploy. Same person, same context, far fewer things lost in translation.",
  },
];

const milestones = [
  {
    year: "2014",
    title: "The first website",
    text: "Built a site for a friend's bakery. Learned that a small business doesn't need more — it needs the right things, in the right order.",
  },
  {
    year: "2018",
    title: "Went independent",
    text: "Left a studio job to work directly with founders. The first year was mostly listening — and it made the design better.",
  },
  {
    year: "2021",
    title: "A quieter kind of studio",
    text: "Started focusing on small, considered websites instead of big, complicated ones. Fewer projects, more attention, better outcomes.",
  },
  {
    year: "2026",
    title: "Still here, still hand-coding",
    text: "Same curiosity, same standards, same belief that good design should feel effortless to the person using it.",
  },
];

export default function About() {
  usePageMeta({
    title: "About Jordan Ellis — Designer, Developer, Problem Solver",
    description:
      "Meet Jordan Ellis, an independent web designer and front-end developer in Portland, Oregon. Learn about the studio's approach, values, and decade of building thoughtful websites.",
  });

  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            A one-person studio for people who care how things{" "}
            <em className="accent">feel.</em>
          </>
        }
        lead="I'm Jordan — a designer and front-end developer in Portland, Oregon. For the last decade I've helped small teams look clearer, sound more like themselves, and give visitors a reason to stay."
      />

      <section className="section">
        <div className="container about-split">
          <Reveal className="about-media">
            <img
              src="/assets/portrait.svg"
              alt="Stylized editorial portrait of Jordan Ellis against a sage-green circle, wearing glasses and a rust-coloured sweater"
              width="800"
              height="1000"
              decoding="async"
            />
          </Reveal>
          <Reveal className="about-copy" delay={80}>
            <p className="eyebrow">Hello, I'm Jordan</p>
            <h2>Good work starts with listening.</h2>
            <p>
              I started building websites in 2014 because I wanted to make things
              that were useful and beautiful in equal measure. That hasn't
              changed. What has changed is how much I've learned about the gap
              between what a business wants to say and what a visitor needs to
              hear.
            </p>
            <p>
              Before going independent, I worked in-house at a small design
              studio, where I learned to ask better questions, edit ruthlessly,
              and ship on time. Now I work directly with founders and small teams
              — usually over a few good conversations and a shared folder of
              half-formed ideas.
            </p>
            <p>
              When I'm not at my desk, I'm likely walking somewhere green, making
              a slow dinner, or taking photographs of signs I find funny.
            </p>
            <p className="signature">— Jordan</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="values-heading">
        <div className="container">
          <SectionHead
            eyebrow="What I believe"
            title="A few things I keep coming back to."
            id="values-heading"
          />
          <div className="values-grid">
            {values.map((value, index) => (
              <Reveal
                as="article"
                className="value-card"
                key={value.number}
                delay={index * 50}
              >
                <span className="value-num">{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="timeline-heading">
        <div className="container">
          <SectionHead
            eyebrow="The short version"
            title="A few milestones along the way."
            id="timeline-heading"
            lead="No big agency story. Just a steady practice built on good work and good relationships."
          />
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <Reveal
                as="div"
                className="timeline-item"
                key={milestone.year}
                delay={index * 40}
              >
                <span className="timeline-year">{milestone.year}</span>
                <div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's make something clear."
        text="Whether you're starting fresh or fixing what you have, I'd love to hear what you're working on."
      />
    </>
  );
}
