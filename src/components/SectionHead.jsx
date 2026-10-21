export default function SectionHead({ eyebrow, title, lead, action, id }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
      </div>
      {lead ? <p className="lead">{lead}</p> : null}
      {action}
    </div>
  );
}
