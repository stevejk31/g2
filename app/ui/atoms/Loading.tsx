import React from 'react';
import clsx from 'clsx';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading({ className = '' }: { className?: string}) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <CircularProgress />
    </div>
  );
}
