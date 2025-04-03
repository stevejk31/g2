import { getNameToConfig } from '@/app/lib/api/list';
import {
  addYoyos, fetchYoyoList, createYoyoListTable, convertPollYoyoDetailToRow,
} from '@/app/lib/db/yoyoList';
import { updateYoYoPollTable, fetchMostRecentPollDate } from '@/app/lib/db/yoyoPoll';

import type { YoyoDetail } from '@/app/lib/api/list';

const ALWAYS_UPDATE = process.env.ALWAYS_UPDATE_POLL_YOYO_LIST || false;
const BOUNDARY_TO_UPDATE_MS = parseInt(process.env.BOUNDARY_TO_UPDATE_POLL_YOYO_LIST_MS as string, 10)
  || (3 * 24 * 60 * 60 * 1000);

const shouldUpdate = (previousDate: Date) => {
  const todaysDate = new Date();
  const diffMs = todaysDate.getTime() - previousDate.getTime();
  return diffMs > BOUNDARY_TO_UPDATE_MS || ALWAYS_UPDATE;
};

/**
 * @fileoverview
 * Poll g2 yoyo yoyo-list website for yoyos and populate DB.
 * https://www.gsquaredyoyos.com/yoyo-list/
 */

// eslint-disable-next-line import/prefer-default-export
export async function GET(request: Request) {
  let date;
  const refreshDB = request.url.includes('refresh_db');
  if (refreshDB) {
    await createYoyoListTable(true);
    return new Response('db flushed', {
      status: 200,
    });
  }

  try {
    date = await fetchMostRecentPollDate();

    if (!!date && !shouldUpdate(date)) {
      return new Response('poll request too soon', {
        status: 405,
      });
    }
    try {
      const fetchYoyos = await getNameToConfig();
      const dbYoyos = await fetchYoyoList();
      const seenYoyos: YoyoDetail[] = [];
      const newYoyos = Object.entries(fetchYoyos)
        .filter(([fetchedName, yoyoDetails]) => {
          let seen = false;
          dbYoyos.forEach(({ name }) => {
            if (name === fetchedName) {
              seen = true;
              seenYoyos.push(yoyoDetails);
            }
          });
          return !seen;
        }).map(([, yoyoDetails]) => convertPollYoyoDetailToRow(yoyoDetails));

      await addYoyos(newYoyos);
    } catch {
      return new Response(`table populate failed. last attempt ${date}`, {
        status: 500,
      });
    }
    try {
      if (!ALWAYS_UPDATE) {
        date = await updateYoYoPollTable();
      }

      return Response.json({ date });
    } catch {
      return new Response(`table populated, but yoyopolltable failed . last attempt ${date}`, {
        status: 500,
      });
    }
  } catch {
    return new Response('poll table failed', {
      status: 500,
    });
  }
}
