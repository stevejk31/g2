/* eslint camelcase: off */

import sql from '@/app/lib/db/sql';

import { isString, getCurrentDate, convertStringToNumber } from '@/app/lib/dbUtils/converter';

import type { YoyoDetail } from '@/app/lib/api/list';

/**
 * @fileoverview
 *
 * Access values from yoyo_list table.
 */

const STATUS_VALUES = ['Retired', 'Active'] as const;
type StatusType = typeof STATUS_VALUES[number];

export interface YoyoRow {
  'name': string;
  'prod_id': number;
  'href': string;
  'status': StatusType;
  'diameter': number;
  'width': number;
  'weight': number;
  'response': string;
  'axle': number;
  'release': string;
  'bearing': string;
  'img_src': string;
  'update_date': string;
}

type NewYoyoRow = Omit<YoyoRow, 'update_date'>;
type OptionalYoyoRow = Omit<NewYoyoRow, 'prod_id' | 'name' | 'href'>;

const DEFAULT_VALUES: OptionalYoyoRow = {
  status: STATUS_VALUES[0],
  diameter: 55,
  width: 45,
  weight: 65,
  response: 'Flowable',
  axle: 10,
  release: 'unknown',
  bearing: 'G2 Ripper',
  img_src: '',
};

const isStatus = (unknown: unknown): unknown is StatusType => !!unknown
  && STATUS_VALUES.includes(unknown as StatusType);

const validateStatus = (status: unknown) => (isStatus(status) ? status : DEFAULT_VALUES.status);
const validateDiameter = (diameter: unknown) => convertStringToNumber(diameter, DEFAULT_VALUES.diameter);
const validateWidth = (width: unknown) => convertStringToNumber(width, DEFAULT_VALUES.width);
const validateWeight = (weight: unknown) => convertStringToNumber(weight, DEFAULT_VALUES.weight);
const validateResponse = (response: unknown) => (isString(response) ? response : DEFAULT_VALUES.response);
const validateAxle = (axle: unknown) => convertStringToNumber(axle, DEFAULT_VALUES.axle, true);
const validateRelease = (release: unknown) => (isString(release) ? release : DEFAULT_VALUES.release);
const validateBearing = (bearing: unknown) => (isString(bearing) ? bearing : DEFAULT_VALUES.bearing);
const validateImgSrc = (imgSrc: unknown) => (isString(imgSrc) ? imgSrc : DEFAULT_VALUES.img_src);

export const convertPollYoyoDetailToRow = ({
  name,
  prodId,
  href,
  Status,
  Diameter,
  Width,
  Weight,
  Response,
  Axle,
  Release,
  Bearing,
  imgSrc,
} : YoyoDetail): YoyoRow => ({
  name,
  status: validateStatus(Status),
  diameter: validateDiameter(Diameter),
  width: validateWidth(Width),
  weight: validateWeight(Weight),
  response: validateResponse(Response),
  axle: validateAxle(Axle),
  release: validateRelease(Release),
  bearing: validateBearing(Bearing),
  update_date: getCurrentDate(),
  img_src: validateImgSrc(imgSrc),
  prod_id: parseInt(prodId, 10),
  href,
});

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
      img_src TEXT NOT NULL,
      update_date TEXT NOT NULL
    );
  `;
};

export const fetchYoyoListCount = async () => {
  const payload = await sql<YoyoRow[]>`
    SELECT COUNT(*)
    FROM yoyo_list
  `;
  return payload;
};

export const fetchYoyoList = async () => {
  const payload = await sql<YoyoRow[]>`
    SELECT
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
      img_src,
      update_date
    FROM
      yoyo_list AS a
      INNER JOIN (
        SELECT name as b_name, MAX(update_date) AS max_value
        FROM yoyo_list
        GROUP BY b_name
      ) AS b ON b.b_name= a.name AND b.max_value = a.update_date
    ORDER BY name ASC;
  `;
  return payload;
};

export const addYoyos = async (yoyoRows: YoyoRow[]) => {
  await sql`
    INSERT INTO yoyo_list
    ${sql(yoyoRows)}
  `;
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
  const colStatus = validateStatus(status);
  const colDiameter = validateDiameter(diameter);
  const colWidth = validateWidth(width);
  const colWeight = validateWidth(weight);
  const colResponse = validateResponse(response);
  const colAxle = validateAxle(axle);
  const colRelease = validateRelease(release);
  const colBearing = validateBearing(bearing);
  const colImgSrc = validateImgSrc(imgSrc);

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
      img_src,
      update_date
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
      ${colImgSrc},
      ${getCurrentDate()}
    );
  `;
};

interface MinMaxValue {
  name: string;
  min: number;
  max: number;
}
export const fetchMaxAndMinValues = async ():Promise<MinMaxValue[]> => {
  const payload = await sql`
    SELECT
      MIN(diameter) as diameter_min,
      MAX(diameter) as diameter_max,
      MIN(width) as width_min,
      MAX(width) as width_max,
      MIN(weight) as weight_min,
      MAX(weight) as weight_max,
      MIN(axle) as axle_min,
      MAX(axle) as axle_max
    FROM yoyo_list;
  `;

  const [{
    diameter_min,
    diameter_max,
    width_min,
    width_max,
    weight_min,
    weight_max,
  }] = payload;

  return [
    {
      name: 'diameter',
      min: diameter_min,
      max: diameter_max,
    },
    {
      name: 'width',
      min: width_min,
      max: width_max,
    },
    {
      name: 'weight',
      min: weight_min,
      max: weight_max,
    },
  ];
};
