import { updateYoYoPollTable, fetchMostRecentPollDate } from '@/app/lib/db/yoyoPoll';
import { getNameToConfig } from '@/app/lib/api/list';
import { addYoyo, fetchYoyoList, createYoyoListTable } from '@/app/lib/db/yoyoList';

const ALWAYS_UPDATE = process.env.ALWAYS_UPDATE_POLL_YOYO_LIST;
const BOUNDARY_TO_UPDATE_MS = parseInt(process.env.BOUNDARY_TO_UPDATE_POLL_YOYO_LIST_MS as string, 10) || 60000;

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
      const yoyos = await fetchYoyoList();
      const promises = Object.entries(fetchYoyos).filter(([fetchedName]) => {
        let seen = false;
        yoyos.forEach(({ name }) => {
          if (name === fetchedName) {
            seen = true;
          }
        });
        return !seen;
      }).map(async ([fetchedName, yoyoDetails]) => {
        addYoyo(
          fetchedName,
          yoyoDetails.prodId,
          yoyoDetails.href,
          yoyoDetails.Status,
          yoyoDetails.Diameter,
          yoyoDetails.Width,
          yoyoDetails.Weight,
          yoyoDetails.Response,
          yoyoDetails.Axle,
          yoyoDetails.Release,
          yoyoDetails.Bearing,
          yoyoDetails.imgSrc,
        );
      });
      await Promise.all(promises);
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
