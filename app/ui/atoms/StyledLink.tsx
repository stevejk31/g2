import React, { ReactNode } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface StyledLinkProps {
  className?: string;
  href: string;
  children: ReactNode;
}

export default function StyledLink({ className = '', children, href }: StyledLinkProps) {
  return (
    <Link
      href={href}
      className={clsx('text-blue-600 dark:text-blue-300 hover:underline', className)}
    >
      {children}
    </Link>
  );
}
