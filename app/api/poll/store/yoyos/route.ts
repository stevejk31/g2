import { fetchYoyos } from '@/app/lib/api/store-yoyos';
import { fetchMostRecentPollDate, updateYoYoPollTable } from '@/app/lib/db/yoyoPoll';
import { addYoyos } from '@/app/lib/db/yoyoStore';

const PAGE = 'yoyo-store';

const ALWAYS_UPDATE = process.env.ALWAYS_UPDATE_POLL_YOYO_STORE || false;
// Default to every days
const BOUNDARY_TO_UPDATE_MS = parseInt(process.env.BOUNDARY_TO_UPDATE_POLL_YOYO_STORE_MS as string, 10)
  || (12 * 60 * 60 * 1000);

const shouldUpdate = (previousDate: Date) => {
  const todaysDate = new Date();
  const diffMs = todaysDate.getTime() - previousDate.getTime();
  return diffMs > BOUNDARY_TO_UPDATE_MS || ALWAYS_UPDATE;
};

/**
 * @fileoverview
 * Poll g2 yoyo yoyo-list website for yoyos and populate DB.
 * https://www.gsquaredyoyos.com/store/product-category/yoyos/
 */

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  let date;
  try {
    date = await fetchMostRecentPollDate(PAGE);

    if (!!date && !shouldUpdate(date)) {
      return new Response('poll request too soon', {
        status: 405,
      });
    }
    try {
      const newYoyos = await fetchYoyos();
      const parsedYoyos = newYoyos
        .filter(({ productLink, yoyo, colorWay }) => colorWay.id && yoyo.name && productLink && colorWay.src)
        .map(({ productLink, yoyo, colorWay }) => ({
          color_id: colorWay.id,
          yoyo_name: yoyo.name,
          href: productLink as string,
          img_src: colorWay.src,
        }));
      await addYoyos(parsedYoyos);
      try {
        if (!ALWAYS_UPDATE) {
          date = await updateYoYoPollTable(PAGE);
        }

        return Response.json({ date });
      } catch {
        return new Response(`table populated, but yoyopolltable failed . last attempt ${date}`, {
          status: 500,
        });
      }
    } catch {
      return new Response(`table populate failed. last succesful attempt ${date}`, {
        status: 500,
      });
    }
  } catch {
    return new Response('unknown issue', {
      status: 500,
    });
  }
}
