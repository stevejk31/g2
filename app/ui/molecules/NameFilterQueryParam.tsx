'use client';

import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import type { TextFieldProps } from '@mui/material/TextField';

const QUERY_PARAM_KEY = 'name';

type NameFilterQueryParam = Omit<TextFieldProps, 'defaultValue' | 'handleChange'>;

export default function NameFilterQueryParam({
  className, value, ...rest
}: NameFilterQueryParam) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams ?? '');
  const paramValue = params.get(QUERY_PARAM_KEY) || value;
  const handleChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const oldPath = `${pathname}?${params.toString()}`;
    if (e.target.value === '') {
      params.delete(QUERY_PARAM_KEY);
    } else {
      params.set(QUERY_PARAM_KEY, e.target.value);
    }
    const newPath = `${pathname}?${params.toString()}`;

    if (oldPath !== newPath) {
      replace(newPath);
    }
  }, 300);
  return (
    <TextField
      className={clsx('w-full min-w-[70px]', className)}
      label="Name"
      type="text"
      onChange={handleChange}
      size="small"
      defaultValue={paramValue}
      {...rest}
    />
  );
}
