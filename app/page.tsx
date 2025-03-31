import React from 'react';
import { getNameToConfig } from './api/list';

export default async function Home() {
  const nameToLink = await getNameToConfig();

  return (
    <div>
      {
        Object.entries(nameToLink).map(([name, yoyo]) => (
          <li key={name}>
            {name}
            {JSON.stringify(yoyo)}
            {
              yoyo.imgSrc && <img src={yoyo.imgSrc} alt={name} width={200} />
            }
          </li>
        ))
      }
    </div>
  );
}
