/* eslint camelcase: off */
import sql from '@/app/lib/db/sql';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * @fileoverview
 *
 * Access values from color_way table.
 */
export interface ColorWayRow {
  id: number;
  name: string;
  src: string;
  unverified?: boolean;
}

export type NewColorWay = Omit<ColorWayRow, 'id'>;

export const addColorWays = async (colorWays: NewColorWay[]) => {
  await sql`
    INSERT INTO color_way
    ${sql(colorWays)}
  `;
};

export const createColorWayTable = async (doSeed: boolean = false, doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS color_way;
    `;

    await sql`
      DISCARD ALL;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS color_way(
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      src TEXT NOT NULL,
      unverified BOOLEAN
    );
  `;

  if (doSeed) {
    const colorWays = await fsPromises.readFile(
      path.join(process.cwd(), 'backup/color-ways.json'),
      { encoding: 'utf8' },
    );
    const values = Object.entries(JSON.parse(colorWays))
      .filter(([name, src]) => !!name && !!src)
      .map(([name, src]) => ({
        name,
        src: src as string,
      }));
    await addColorWays(values);
  }
};

export const fetchColorWays = async () => sql<ColorWayRow[]>`
    SELECT *
    FROM color_way
    ORDER BY name ASC;
  `;

export const fetchColorWayByName = async (name: ColorWayRow['name']) => sql<ColorWayRow[]>`
    SELECT *
    FROM color_way
    WHERE LOWER(name) = LOWER(${name});
  `;

export const addColorWay = async (colorWays: NewColorWay) => {
  await sql`
    INSERT INTO color_way
    ${sql(colorWays)};
  `;

  return fetchColorWayByName(colorWays.name);
};
