'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import type { SliderProps } from '@mui/material/Slider';

interface SliderQueryParamProps extends
  Omit<SliderProps, 'onChange' | 'value' | 'getAriaLabel' | 'valueLabelDisplay' | 'step'> {
    label: string;
    max: number;
    min: number;
  }

/**
 * Double sided slider component.
 *
 * Note: MUI will throw irrelevant console error around use of defaultValue, but it is required to get
 * proper query parameter based functionality.
 */
export default function SliderQueryParam({
  label, min, max, ...rest
}: SliderQueryParamProps) {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams ?? '');
  const minKey = `${label}-min`;
  const maxKey = `${label}-max`;
  const displayMin = Math.floor(min);
  const displayMax = Math.ceil(max);
  const [{ minValue, maxValue }, setMinMax] = useState<{ minValue: number, maxValue: number}>({
    minValue: params.get(minKey) ? parseFloat(params.get(minKey) as string) : displayMin,
    maxValue: params.get(maxKey) ? parseFloat(params.get(maxKey) as string) : displayMax,
  });

  const handleChange = (value: number|number[]) => {
    if (Array.isArray(value)) {
      const [newMin, newMax] = value;
      setMinMax({ minValue: newMin, maxValue: newMax });
    }
  };

  const updateQueryParam = useDebouncedCallback((newMinValue: number, newMaxValue: number) => {
    const oldPath = `${pathname}?${params.toString()}`;
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
    const newPath = `${pathname}?${params.toString()}`;

    if (oldPath !== newPath) {
      replace(newPath);
    }
  }, 300);

  const createTextFieldHandler = (minOrMax: 'min' | 'max') => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let newValue = parseInt(e.target.value, 10);
    if (newValue < displayMin) {
      newValue = displayMin;
    }
    if (newValue > displayMax) {
      newValue = displayMax;
    }
    if (minOrMax === 'min') {
      handleChange([newValue, maxValue]);
    }
    if (minOrMax === 'max') {
      handleChange([minValue, newValue]);
    }
  };

  useEffect(() => {
    updateQueryParam(minValue, maxValue);

  // avoid issue with infinite re-render with updateQueryParam
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minValue, maxValue]);

  return (
    <div className="min-w-[150px]">
      <div className="flex flex-row justify-between items-center">
        <Typography>
          {label}
          :
        </Typography>
        <IconButton onClick={() => { setExpanded(!isExpanded); }} size="small">
          {
            isExpanded
              ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />
          }
        </IconButton>
      </div>
      {isExpanded && (
        <>
          <div className="w-full flex flex-row justify-between items-center mt-3">
            <TextField
              className="w-[70px]"
              label="Min"
              type="number"
              onChange={createTextFieldHandler('min')}
              size="small"
              value={minValue}
            />
            <TextField
              className="w-[70px]"
              label="Max"
              type="number"
              onChange={createTextFieldHandler('max')}
              size="small"
              value={maxValue}
            />
          </div>
          <div className="w-full">
            <Slider
              {...rest}
              onChange={(_, value) => handleChange(value)}
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
          <div className="w-full flex flex-row justify-between items-center">
            <Typography variant="subtitle2">
              {displayMin}
            </Typography>
            <Typography variant="subtitle2">
              {displayMax}
            </Typography>
          </div>
          <div className="w-full flex flex-row justify-end items-center">
            <Button onClick={() => setMinMax({ minValue: displayMin, maxValue: displayMax })}>reset</Button>
          </div>
        </>
      )}
    </div>
  );
}
