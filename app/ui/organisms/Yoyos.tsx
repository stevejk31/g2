import React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { fetchYoyoList } from '@/app/lib/db/yoyoList';

import type { YoyoRow } from '@/app/lib/db/yoyoList';

type SearchParamType = undefined | string | string[];

const isValueGreaterThan = (comparitor: SearchParamType, value: number) => {
  if (!comparitor || Array.isArray(comparitor)) {
    return false;
  }
  try {
    const max = parseFloat(comparitor);
    return value > max;
  } catch {
    return false;
  }
};

const isValueLessThan = (comparitor: SearchParamType, value: number) => {
  if (!comparitor || Array.isArray(comparitor)) {
    return false;
  }
  try {
    const max = parseFloat(comparitor);
    return value < max;
  } catch {
    return false;
  }
};

interface YoyosProps {
  className?: string;
  diameterMin: SearchParamType;
  diameterMax: SearchParamType;
  widthMin: SearchParamType;
  widthMax: SearchParamType;
  weightMin: SearchParamType;
  weightMax: SearchParamType;
}

export default async function Yoyos({
  className = '',
  diameterMin,
  diameterMax,
  widthMin,
  widthMax,
  weightMin,
  weightMax,
}: YoyosProps) {
  const yoyoList = await fetchYoyoList();

  const filter = ({ weight, diameter, width }: YoyoRow) => !(isValueGreaterThan(diameterMax, diameter)
    || isValueGreaterThan(widthMax, width)
    || isValueGreaterThan(weightMax, weight)
    || isValueLessThan(diameterMin, diameter)
    || isValueLessThan(widthMin, width)
    || isValueLessThan(weightMin, weight));

  return (
    <ul className={clsx('flex items-stretch justify-around flex-wrap gap-5', className)}>
      { yoyoList.filter(filter).map(({ name, href, img_src }) => (
        <li key={name} className="flex flex-col align-center justify-between gap-2">
          { img_src && <img src={img_src} alt={name} width={250} /> }
          <Typography>
            {name}
          </Typography>
          <Button href={href}>Go to G2</Button>
        </li>
      ))}
    </ul>
  );
}
