import { Link } from "react-router-dom";

// variant: primary | outline | light | ghost. pass `to` for pages, `href` for outside links.
// one btn for links + actions
export default function Button({ to, href, variant = "primary", children, ...rest }) {
  const className = `btn btn-${variant}`;
  if (to) return <Link className={className} to={to} {...rest}>{children}</Link>;
  // outside links open new tab
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a className={className} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return <button className={className} {...rest}>{children}</button>;
}
