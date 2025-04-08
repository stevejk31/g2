'use client';

import React from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import BinaryButtonQueryParam from '@/app/ui/atoms/BinaryButtonQueryParam';

import type { SelectProps } from '@mui/material/Select';

const PARAM_KEY = 'order-by';
const LABEL = 'Order By';

interface OrderByQueryParamProps {
  values: { value: string, displayName: string }[];
  selectProps?: Omit<SelectProps, 'className' | 'value' | 'defaultValue' | 'label' | 'onChange'>;
}

/**
 * Ignore mui error as default value is required for query string based interaction.
 */
export default function OrderByQueryParam({
  values, selectProps = {},
}: OrderByQueryParamProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams ?? '');
  const paramValue = params.get(PARAM_KEY);
  const labelId = `${LABEL.replace(' ', '').toLowerCase()}-select-label`;
  const handleChange = useDebouncedCallback((e) => {
    const oldPath = `${pathname}?${params.toString()}`;
    const { value } = e.target;
    if (value) {
      params.set(PARAM_KEY, value);
    } else {
      params.delete(PARAM_KEY);
    }
    const newPath = `${pathname}?${params.toString()}`;

    if (oldPath !== newPath) {
      replace(newPath);
    }
  }, 300);

  return (
    <div className="flex flex-row items-center justify-stretch gap-1">
      <FormControl>
        <InputLabel id={labelId}>{LABEL}</InputLabel>
        <Select
          className="min-w-[200px]"
          labelId={labelId}
          defaultValue={paramValue || ''}
          onChange={handleChange}
          {...selectProps}
        >
          {
            values.map(({ value, displayName }) => (
              <MenuItem key={value} value={value}>{displayName}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <BinaryButtonQueryParam
        childOnTrue={<ExpandMoreIcon />}
        childOnFalse={<ExpandLessIcon />}
        paramKey="is-desc"
      />
    </div>
  );
}
