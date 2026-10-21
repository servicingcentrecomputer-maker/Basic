import Button from "./Button.jsx";
import Reveal from "./Reveal.jsx";

export default function CtaBand({
  title,
  text,
  buttonLabel = "Start a conversation",
  to = "/contact",
}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <Button variant="light" to={to}>
            {buttonLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
