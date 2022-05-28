import React from "react";
import NextLink from "next/link";

import { basePath } from "@/next.config";

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
  href: string;
};

export const Link: React.FC<LinkProps> = ({ children, href, ...props }) => {
  return (
    <NextLink href={href}>
      <a {...props} href={`${basePath}${href}`}>
        {children}
      </a>
    </NextLink>
  );
};
