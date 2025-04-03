import fsPromises from 'fs/promises';
import path from 'path';

import { fetchYoyoList } from '@/app/lib/db/yoyoList';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @fileoverview
 * Backup db.
 */

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  if (!isDev) {
    return new Response('No available', {
      status: 400,
    });
  }
  const yoyos = await fetchYoyoList();

  fsPromises.writeFile(
    path.join(process.cwd(), `backup/yoyo-list-${new Date().toISOString().split('T')[0]}.json`),
    JSON.stringify(yoyos),
  );
  return new Response('stored db', {
    status: 200,
  });
}
