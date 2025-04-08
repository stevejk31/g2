/* eslint camelcase: off */
import sql from '@/app/lib/db/sql';
import { getCurrentDate } from '@/app/lib/dbUtils/converter';
import type { ColorWayRow } from '@/app/lib/db/colorWays';

/**
 * @fileoverview
 *
 * Interaction with yoyo_store table.
 */

export interface YoyoStoreRow {
  /** primary key of color_way */
  color_id: number;
  /** name field of yoyo_list */
  yoyo_name: string;
  /* url to store webiste */
  href: string;
  /* img src */
  img_src: string;
  /* scrub date */
  date: string;
}

export type NewYoyoStoreRow = Omit<YoyoStoreRow, 'date'>;

export const createYoyoStoreTable = async (doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS yoyo_store;
    `;

    await sql`
      DISCARD ALL;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_store(
      color_id INTEGER,
      yoyo_name TEXT NOT NULL,
      href TEXT NOT NULL PRIMARY_KEY,
      img_src TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `;
};

export const fetchAllYoyos = async () => sql`
  SELECT * 
  FROM yoyo_store;
`;

export const fetchYoyoByHref = async (yoyoHrefs: YoyoStoreRow['href'][]) => {
  const dbHrefs = await sql<{href: string}[]>`
    SELECT href
    FROM yoyo_store
    WHERE href in ${sql(yoyoHrefs)};
  `;

  return dbHrefs;
};

export type YoyoStoreAndColorWay = YoyoStoreRow & ColorWayRow;
export const fetchYoyoListingsByName = async (yoyoName: YoyoStoreRow['yoyo_name']) => sql<YoyoStoreAndColorWay []>`
    SELECT *
    FROM
      yoyo_store as a
      INNER JOIN (
        SELECT href as b_href, MAX(date) AS max_value
        FROM yoyo_store
        GROUP BY b_href
      ) AS b ON b.b_href = a.href AND b.max_value = a.date
    JOIN color_way ON color_id = id
    WHERE LOWER(yoyo_name) = LOWER(${yoyoName});
  `;

export const addYoyos = async (yoyoRows: NewYoyoStoreRow[]) => {
  const seenHrefs = await fetchYoyoByHref(yoyoRows.map(({ href }) => href));
  const filteredYoyos = yoyoRows.filter(({ href }) => {
    let seen = false;

    // Includes isn't working for some reason.
    seenHrefs.forEach((seenHref) => {
      if (seenHref.href === href) {
        seen = true;
      }
    });
    return !seen;
  });

  if (filteredYoyos.length > 0) {
    const date = getCurrentDate();
    const yoyoRowsWithDate = yoyoRows.map((row) => ({ ...row, date }));
    await sql`
      INSERT INTO yoyo_store
      ${sql(yoyoRowsWithDate)}
    `;
  }
};
