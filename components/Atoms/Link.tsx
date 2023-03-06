import React from "react";
import NextLink from "next/link";

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
  href: string;
};

export const Link: React.FC<LinkProps> = ({ children, href, ...props }) => {
  return (
    <NextLink {...props} href={href}>
      {children}
    </NextLink>
  );
};
