import React from 'react';
import Typography from '@mui/material/Typography';

export default async function HomePage() {
  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">g2 community yoyo</Typography>
      <p>
        Project to document yoyos by
        {' '}
        <a href="https://www.gsquaredyoyos.com/">g2</a>
        .
      </p>
    </div>
  );
}
