import React from 'react';
import { getNameToConfig } from './api/list';

export default async function Home() {
  const nameToLink = getNameToConfig();

  return (
    <div>
      {JSON.stringify(nameToLink)}
    </div>
  );
}
