import React from 'react';

import Typography from '@mui/material/Typography';

import { fetchYoyoListingsByName } from '@/app/lib/db/yoyoStore';

import type { YoyoStoreAndColorWay } from '@/app/lib/db/yoyoStore';

interface YoyoStoreListingProps {
  yoyoName: string;
}

export default async function YoyoStoreListing({ yoyoName }: YoyoStoreListingProps) {
  let listings: YoyoStoreAndColorWay[] = [];
  try {
    listings = await fetchYoyoListingsByName(yoyoName);
  } catch {
    listings = [];
  }

  return (
    <div>
      <Typography className="border-b">
        Store listings:
      </Typography>
      {
        listings.length > 0 ? (
          <ul>
            {
              listings.map(({
                href, date, name,
              }) => (
                <li key={href}>
                  <div>
                    <b>
                      Color way:
                    </b>
                    {' '}
                    {name}
                  </div>
                  <div>
                    <b>
                      Date scrubbed:
                    </b>
                    {' '}
                    {date.split('T')[0]}
                  </div>
                </li>
              ))
            }
          </ul>
        ) : (
          <Typography>No listings found</Typography>
        )
      }
    </div>
  );
}
