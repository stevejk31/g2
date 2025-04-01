import React from 'react';

import { fetchYoyoList } from '@/app/lib/db/yoyoList';

export default async function Home() {
  const yoyoList = await fetchYoyoList();
  return (
    <div>
      hello
      { JSON.stringify(yoyoList)}
      {
        /*
        Object.entries(nameToLink).map(([name, yoyo]) => (
          <li key={name}>
            {name}
            {JSON.stringify(yoyo)}
            {
              yoyo.imgSrc && <img src={yoyo.imgSrc} alt={name} width={200} />
            }
          </li>
        ))
         */
      }
    </div>
  );
}
