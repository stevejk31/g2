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

const buildIdWhereStatement = (id: ColorWayRow['id'], isAnd: boolean = true) => {
  if (isAnd) {
    return sql`AND id = ${id}`;
  }
  return sql`WHERE id = ${id}`;
};

const buildNameWhereStatement = (name: ColorWayRow['name'], isAnd: boolean = true) => {
  if (isAnd) {
    return sql`AND LOWER(name) LIKE LOWER(${`%${name}%`})`;
  }
  return sql`WHERE LOWER(name) LIKE LOWER(${`%${name}%`})`;
};

const buildSrcWhereStatement = (src: ColorWayRow['src'], isAnd: boolean = true) => {
  if (isAnd) {
    return sql`AND LOWER(src) = LOWER(${src})`;
  }
  return sql`WHERE LOWER(src) = LOWER(${src})`;
};

const buildUnverifiedWhereStatement = (unverified: ColorWayRow['unverified'], isAnd: boolean = true) => {
  if (unverified === true) {
    if (isAnd) {
      return sql`AND unverified = TRUE`;
    }
    return sql`WHERE unverified = TRUE`;
  }
  if (unverified === false) {
    if (isAnd) {
      return sql`AND (unverified = FALSE OR unverified IS NULL)`;
    }
    return sql`WHERE (unverified = FALSE OR unverified IS NULL)`;
  }

  return sql``;
};

const buildWhereQuery = ({
  id, name, src, unverified,
}: Partial<ColorWayRow>) => sql`
    ${id ? buildIdWhereStatement(id, false) : sql``}
    ${name ? buildNameWhereStatement(name, !!id) : sql``}
    ${src ? buildSrcWhereStatement(src, !!id || !!name) : sql``}
    ${unverified !== undefined ? buildUnverifiedWhereStatement(unverified, !!id || !!name || !!src) : sql``}
  `;

export const fetchColorWays = async (where: Partial<ColorWayRow> = {}, isAsc:boolean = true) => {
  const payload = await sql<ColorWayRow[]>`
    SELECT *
    FROM color_way
    ${buildWhereQuery(where)}
    ORDER BY name ${isAsc ? sql`ASC` : sql`DESC`};
  `;
  return payload;
};

export const fetchColorWayByName = async (name: ColorWayRow['name']) => fetchColorWays({ name });
export const fetchColorWayById = async (id: ColorWayRow['id']) => fetchColorWays({ id });

export const addColorWay = async (colorWays: NewColorWay) => {
  await sql`
    INSERT INTO color_way
    ${sql(colorWays)};
  `;

  return fetchColorWayByName(colorWays.name);
};
