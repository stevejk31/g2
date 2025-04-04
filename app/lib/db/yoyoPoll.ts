import sql from '@/app/lib/db/sql';
import { getCurrentDate } from '@/app/lib/dbUtils/converter';

/**
 * @fileoverview
 *
 * Access for yoyo_poll table.
 */

export interface PollTableRow {
  id: number;
  date: string;
  page: string;
}

export const createPollTable = async (doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS yoyo_poll
    `;

    await sql`
      DISCARD PLANS;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_poll(id SERIAL PRIMARY KEY, date TEXT NOT NULL, page TEXT NOT NULL);
  `;
};

export const updateYoYoPollTable = async (page: string) => {
  await sql`
    INSERT INTO yoyo_poll(date, page)
    VALUES(${getCurrentDate()}, ${page})
  `;
};

export const fetchMostRecentPollDate = async (page: string) => {
  try {
    const payload = await sql<PollTableRow[]>`
      SELECT *
      FROM yoyo_poll
      WHERE page = ${page}
      ORDER BY id DESC
      LIMIT 1;
    `;
    return new Date(payload[0].date);
  } catch {
    return null;
  }
};
