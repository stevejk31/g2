'use client';

import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import type { ButtonProps } from '@mui/material/Button';

interface BinaryButtonQueryParam extends Omit<ButtonProps, 'defaultValue' | 'value'> {
  childOnTrue: ReactNode;
  childOnFalse: ReactNode;
  paramKey: string;
}

export default function BinaryButtonQueryParam({
  childOnTrue, childOnFalse, paramKey, ...rest
}: BinaryButtonQueryParam) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams ?? '');
  const paramValue = params.get(paramKey) === 'true';
  const handleChange = useDebouncedCallback(() => {
    const oldPath = `${pathname}?${params.toString()}`;
    if (paramValue) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, 'true');
    }
    const newPath = `${pathname}?${params.toString()}`;

    if (oldPath !== newPath) {
      replace(newPath);
    }
  }, 300);
  return (
    <Button
      onClick={handleChange}
      {...rest}
    >
      {
        paramValue ? childOnTrue : childOnFalse
      }
    </Button>
  );
}
