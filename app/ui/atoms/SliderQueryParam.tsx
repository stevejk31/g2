'use client';

import React from 'react';
import Slider from '@mui/material/Slider';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import type { SliderProps } from '@mui/material/Slider';

interface SliderQueryParamProps extends
  Omit<SliderProps, 'onChange' | 'value' | 'getAriaLabel' | 'valueLabelDisplay' | 'step'> {
    label: string;
    max: number;
    min: number;
  }

export default function SliderQueryParam(props: SliderQueryParamProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams ?? '');
  const {
    label, min, max, ...rest
  } = props;
  const minKey = `${label}-min`;
  const maxKey = `${label}-max`;
  const displayMin = Math.floor(min);
  const displayMax = Math.ceil(max);
  const minValue = params.get(minKey) ? parseFloat(params.get(minKey) as string) : displayMin;
  const maxValue = params.get(maxKey) ? parseFloat(params.get(maxKey) as string) : displayMax;

  return (
    <div>
      {label}
      <div className="flex flew-row items-center gap-5">
        <Slider
          {...rest}
          onChange={(_, value) => {
            if (Array.isArray(value)) {
              const [newMinValue, newMaxValue] = value;
              if (newMinValue !== displayMin) {
                params.set(minKey, newMinValue.toString());
              } else {
                params.delete(minKey);
              }
              if (newMaxValue !== displayMax) {
                params.set(maxKey, newMaxValue.toString());
              } else {
                params.delete(maxKey);
              }

              replace(`${pathname}?${params.toString()}`);
            }
          }}
          getAriaLabel={() => `${label} range`}
          valueLabelDisplay="auto"
          value={[minValue, maxValue]}
          marks={[
            {
              value: displayMin,
              label: '',
            },
            {
              value: displayMax,
              label: '',
            },
          ]}
          min={displayMin}
          max={displayMax}
          step={1}
        />
      </div>
    </div>
  );
}
