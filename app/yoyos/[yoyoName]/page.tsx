import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Loading from '@/app/ui/atoms/Loading';
import YoyoStoreListing from '@/app/ui/organisms/YoyoStoreListing';

import { fetchYoyoByName } from '@/app/lib/db/yoyoList';

export default async function YoyoDetailPage({ params }: {
  params: Promise<{yoyoName: string}>
}) {
  const { yoyoName } = await params;
  const decodedName = decodeURI(yoyoName);
  let yoyoDetails;
  try {
    yoyoDetails = await fetchYoyoByName(decodedName);
  } catch {
    redirect('/yoyos');
  }

  if (!yoyoDetails || yoyoDetails.length === 0) {
    redirect('/yoyos');
  }
  const [{
    //    name, href, status, diameter, body, width, weight, response, axle, release, bearing, img_src,
    name, href, img_src,
  }] = yoyoDetails;
  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">{name}</Typography>
      <div className="flex content-center justify-center">
        <img
          alt={name}
          src={img_src}
          width={300}
          height={300}
        />
      </div>
      <Button href={href} variant="contained" target="_blank">Go to G2</Button>
      <Suspense
        fallback={<Loading className="w-full" />}
      >
        <YoyoStoreListing yoyoName={name} />
      </Suspense>
    </div>
  );
}
