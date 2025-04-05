import React from 'react';
import { redirect } from 'next/navigation';

import { fetchYoyoByName } from '@/app/lib/db/yoyoList';

export default async function YoyoDetailPage({ params }: {
  params: Promise<{name: string}>
}) {
  const { name } = await params;
  const decodedName = decodeURI(name);
  let yoyoDetails;
  try {
    yoyoDetails = await fetchYoyoByName(decodedName);
  } catch {
    redirect('/yoyos');
  }

  if (!yoyoDetails || yoyoDetails.length === 0) {
    redirect('/yoyos');
  }
  return (
    <div className="p-5 w-full">
      {JSON.stringify(yoyoDetails)}
    </div>
  );
}
