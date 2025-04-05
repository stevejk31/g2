import React, { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import Loading from '@/app/ui/atoms/Loading';
import OrderByQueryParam from '@/app/ui/molecules/OrderByQueryParam';
import Yoyos from '@/app/ui/organisms/Yoyos';
import YoyoFilter from '@/app/ui/organisms/YoyoFilter';
import FilterContent from '@/app/ui/templates/FilterContent';

import { isOrderByValue, orderByValues } from '@/app/lib/db/yoyoList';

import type { YoyoRow } from '@/app/lib/db/yoyoList';

interface YoyosPageProps {
  searchParams: Promise<{[ key: string ]: string | string[] | undefined }>
}

export default async function YoyosPage({ searchParams }: YoyosPageProps) {
  const payload = await searchParams || {};
  const isDesc = payload['is-desc'];
  let name;
  let isAsc = true;
  let orderBy: keyof YoyoRow = 'name';
  if (payload.name) {
    name = typeof payload.name === 'string' ? payload.name : undefined;
  }
  if (payload['order-by']) {
    orderBy = isOrderByValue(payload['order-by']) ? payload['order-by'] : 'name';
  }
  if (isDesc) {
    isAsc = isDesc !== 'true';
  }

  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">yoyos</Typography>
      <FilterContent
        sortBy={(
          <OrderByQueryParam
            values={orderByValues.map((value) => ({ value, displayName: value.replace('_', ' ') }))}
          />
        )}
        filter={(
          <Suspense
            fallback={<Loading className="w-full" />}
          >
            <YoyoFilter />
          </Suspense>
        )}
      >
        <Suspense
          fallback={<Loading className="w-full" />}
        >
          <Yoyos
            filterOptions={{
              searchName: name,
              diameterMin: payload['diameter-min'],
              diameterMax: payload['diameter-max'],
              widthMin: payload['width-min'],
              widthMax: payload['width-max'],
              weightMin: payload['weight-min'],
              weightMax: payload['weight-max'],
            }}
            orderBy={{
              isAsc,
              column: orderBy,
            }}
          />
        </Suspense>
      </FilterContent>
    </div>
  );
}
