import sql from '@/app/lib/sql';

export const createPollTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_poll(id SERIAL PRIMARY KEY, date TEXT NOT NULL);
  `;
};

export const updateYoYoPollTable = async () => {
  const date = new Date();
  createPollTable();
  await sql`
    INSERT INTO yoyo_poll(date)
    VALUES(${date.toISOString()})
  `;
};

export const getMostRecentPollDate = async () => {
  const payload = await sql`
    SELECT *
    FROM yoyo_poll
    ORDER BY id DESC
    LIMIT 1;
  `;
  return new Date(payload[0].date);
};
