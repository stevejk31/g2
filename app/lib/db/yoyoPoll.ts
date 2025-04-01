import sql from '@/app/lib/db/sql';

/**
 * @fileoverview
 *
 * Access for yoyo_poll table.
 */

export interface PollTableRow {
  id: number;
  date: string;
}

export const createPollTable = async (doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS yoyo_poll
    `;

    await sql`
      DISCARD ALL;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_poll(id SERIAL PRIMARY KEY, date TEXT NOT NULL);
  `;
};

export const updateYoYoPollTable = async () => {
  const date = new Date();
  await createPollTable();
  await sql`
    INSERT INTO yoyo_poll(date)
    VALUES(${date.toISOString()})
  `;
};

export const fetchMostRecentPollDate = async () => {
  try {
    const payload = await sql<PollTableRow[]>`
      SELECT *
      FROM yoyo_poll
      ORDER BY id DESC
      LIMIT 1;
    `;
    return new Date(payload[0].date);
  } catch {
    return null;
  }
};
