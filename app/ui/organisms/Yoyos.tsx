import React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import StyledLink from '@/app/ui/atoms/StyledLink';

import { fetchMostRecentYoYos } from '@/app/lib/db/yoyoList';

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
  filterOptions: {
    diameterMin: SearchParamType;
    diameterMax: SearchParamType;
    searchName: string | undefined;
    widthMin: SearchParamType;
    widthMax: SearchParamType;
    weightMin: SearchParamType;
    weightMax: SearchParamType;
  }
  orderBy?: {
    isAsc: boolean;
    column: keyof YoyoRow;
  }
}

export default async function Yoyos({
  className = '',
  filterOptions: {
    diameterMin,
    diameterMax,
    searchName,
    widthMin,
    widthMax,
    weightMin,
    weightMax,
  },
  orderBy = { isAsc: true, column: 'name' },
}: YoyosProps) {
  const yoyoList = await fetchMostRecentYoYos({
    where: {
      name: searchName,
    },
    orderBy,
  });

  const filter = ({ weight, diameter, width }: YoyoRow) => !(isValueGreaterThan(diameterMax, diameter)
    || isValueGreaterThan(widthMax, width)
    || isValueGreaterThan(weightMax, weight)
    || isValueLessThan(diameterMin, diameter)
    || isValueLessThan(widthMin, width)
    || isValueLessThan(weightMin, weight));

  return (
    <ul className={clsx('flex items-stretch justify-around flex-wrap gap-7 list-none', className)}>
      { yoyoList.filter(filter).map(({
        name, href, img_src,
      }) => (
        <li key={name} className="flex flex-col align-center justify-between gap-2">
          { img_src && <img src={img_src} alt={name} width={250} /> }
          <Typography>
            {name}
          </Typography>
          <div className="flex flex-row gap-2 justify-between items-center">
            <StyledLink href={`/yoyos/${name}`}>Details</StyledLink>
            <Button href={href} variant="contained" target="_blank">Go to G2</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
