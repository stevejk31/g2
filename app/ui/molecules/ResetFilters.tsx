'use client';

import React from 'react';
import Button from '@mui/material/Button';
import { usePathname, useRouter } from 'next/navigation';

export default function ResetFilters() {
  const pathname = usePathname();
  const { replace } = useRouter();

  return (
    <Button
      onClick={() => {
        replace(pathname);
      }}
    >
      Reset Filters
    </Button>
  );
}
