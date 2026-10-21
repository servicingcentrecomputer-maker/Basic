import { Link } from "react-router-dom";
import ArrowIcon from "./Icons.jsx";

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  withIcon = true,
  className = "",
  ...rest
}) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {withIcon ? <ArrowIcon /> : null}
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
