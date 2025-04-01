import sql from '@/app/lib/db/sql';

const STATUS_VALUES = ['Retired', 'Active'] as const;
type StatusType = typeof STATUS_VALUES[number];

/**
 * @fileoverview
 *
 * Access values from yoyo_list table.
 */

export interface YoyoRow {
  'name': string;
  'prod_id': number;
  'href': string;
  'status': StatusType;
  'diameter': number;
  'width': number;
  'weight': number;
  'response'?: string;
  'axle'?: number;
  'release'?: string;
  'bearing'?: string;
  'imgSrc'?: string;
}

export const createYoyoListTable = async (doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS yoyo_list;
    `;

    await sql`
      DISCARD ALL;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_list(
      name TEXT NOT NULL,
      prod_id SMALLINT NOT NULL,
      href TEXT NOT NULL,
      status TEXT NOT NULL,
      diameter DECIMAL NOT NULL,
      width DECIMAL NOT NULL,
      weight DECIMAL NOT NULL,
      response TEXT NOT NULL,
      axle SMALLINT NOT NULL,
      release TEXT NOT NULL,
      bearing TEXT NOT NULL,
      img_src TEXT NOT NULL
    );
  `;
};

export const fetchYoyoList = async () => {
  const payload = await sql`
    SELECT *
    FROM yoyo_list;
  `;
  return payload;
};

export const convertStringToNumber = (
  value: string | undefined | null,
  defaultValue: number,
  isInt: boolean = false,
) => {
  if (!value) {
    return defaultValue;
  }
  try {
    if (isInt) {
      return parseInt(value.replace(/\[^0-9.]/g, ''), 10);
    }
    return parseFloat(value.replace(/\[^0-9.]/g, ''));
  } catch {
    return defaultValue;
  }
};

export const addYoyo = async (
  name: string,
  prodId: string,
  href: string,
  status: string | null | undefined,
  diameter: string | null | undefined,
  width: string | null | undefined,
  weight: string | null | undefined,
  response: string | null | undefined,
  axle: string | null | undefined,
  release: string | null | undefined,
  bearing: string | null | undefined,
  imgSrc: string | null | undefined,
) => {
  const colStatus = (!!status && STATUS_VALUES.includes(status as StatusType)) ? status : STATUS_VALUES[0];
  const colDiameter = convertStringToNumber(diameter, 55);
  const colWidth = convertStringToNumber(width, 45);
  const colWeight = convertStringToNumber(weight, 65);
  const colResponse = response || 'Flowable';
  const colAxle = convertStringToNumber(axle, 10, true);
  const colRelease = release || 'unknown';
  const colBearing = bearing || 'G2 Ripper';
  const colImgSrc = imgSrc || '';

  await sql`
    INSERT INTO yoyo_list(
      name,
      prod_id,
      href,
      status,
      diameter,
      width,
      weight,
      response,
      axle,
      release,
      bearing,
      img_src
    )
    VALUES (
      ${name},
      ${prodId},
      ${href},
      ${colStatus},
      ${colDiameter},
      ${colWidth},
      ${colWeight},
      ${colResponse},
      ${colAxle},
      ${colRelease},
      ${colBearing},
      ${colImgSrc}
    );
  `;
};
