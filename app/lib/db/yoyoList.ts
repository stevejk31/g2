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
  'prod_id'?: number;
  'href': string;
  'status': StatusType;
  'diameter': number;
  'body': string;
  'width': number;
  'weight': number;
  'response': string;
  'axle': number;
  'release': string;
  'bearing': string;
  'img_src': string;
  'update_date': string;
  unverified?: boolean;
}

type NewYoyoRow = Omit<YoyoRow, 'update_date'>;
type RequiredOptionalYoyoFields = Omit<NewYoyoRow, 'name' | 'href' | 'prod_id'>;

const DEFAULT_VALUES: RequiredOptionalYoyoFields = {
  status: STATUS_VALUES[0],
  diameter: 55,
  width: 45,
  weight: 65,
  response: 'Flowable',
  axle: 10,
  body: '6061(?)',
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
const validateResponse = (response: unknown) => (isString(response) ? response.trim() : DEFAULT_VALUES.response);
const validateAxle = (axle: unknown) => convertStringToNumber(axle, DEFAULT_VALUES.axle, true);
const validateRelease = (release: unknown) => (isString(release) ? release.trim() : DEFAULT_VALUES.release);
const validateBearing = (bearing: unknown) => (isString(bearing) ? bearing.trim() : DEFAULT_VALUES.bearing);
const validateImgSrc = (imgSrc: unknown) => (isString(imgSrc) ? imgSrc.trim() : DEFAULT_VALUES.img_src);
const validateBody = (body: unknown) => (isString(body) ? body.trim() : DEFAULT_VALUES.body);

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
  name: name.trim(),
  body: validateBody(''),
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
  href: href.trim(),
});

export const createYoyoListTable = async (doDropTable: boolean = false) => {
  if (doDropTable) {
    await sql`
      DROP TABLE IF EXISTS yoyo_list;
    `;

    await sql`
      DISCARD PLANS;
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_list(
      name TEXT NOT NULL,
      prod_id SMALLINT,
      href TEXT,
      status TEXT NOT NULL,
      body TEXT,
      diameter DECIMAL NOT NULL,
      width DECIMAL NOT NULL,
      weight DECIMAL NOT NULL,
      response TEXT NOT NULL,
      axle SMALLINT NOT NULL,
      release TEXT NOT NULL,
      bearing TEXT NOT NULL,
      img_src TEXT NOT NULL,
      update_date TEXT NOT NULL,
      unverified BOOLEAN
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

export const fetchYoyoByName = async (name: YoyoRow['name']) => {
  const payload = await sql<YoyoRow[]>`
    SELECT
      name,
      prod_id,
      href,
      status,
      diameter,
      body,
      width,
      weight,
      response,
      axle,
      release,
      bearing,
      img_src,
      update_date,
      unverified
    FROM yoyo_list
    WHERE LOWER(name) LIKE LOWER(${`%${name}%`})
    ORDER BY update_date DESC;
  `;
  return payload;
};

/**
 * Order by values supported by query.
 */
export const orderByValues: (keyof YoyoRow)[] = [
  'name',
  'prod_id',
  'diameter',
  'width',
  'weight',
  'release',
  'update_date',
];
export const isOrderByValue = (unknown: unknown): unknown is keyof YoyoRow => !!unknown
  && orderByValues.includes(unknown as keyof YoyoRow);

interface FetchMostRecentYoYosParams {
  where?: {
    name?: string;
  }
  orderBy?: {
    isAsc?: boolean;
    column?: typeof orderByValues[number];
  }
}

const buildNameWhereStatement = (name: YoyoRow['name'], isAnd: boolean = true) => {
  if (isAnd) {
    return sql`AND LOWER(name) LIKE LOWER(${`%${name}%`})`;
  }
  return sql`WHERE LOWER(name) LIKE LOWER(${`%${name}%`})`;
};

const buildWhereQuery = ({
  name,
}: FetchMostRecentYoYosParams['where'] = {}) => sql`
  ${name ? buildNameWhereStatement(name) : sql``}
`;

const buildOrderColumnStatement = (column: keyof YoyoRow) => {
  switch (column) {
    case 'prod_id':
      return sql`prod_id`;
    case 'diameter':
      return sql`diameter`;
    case 'width':
      return sql`width`;
    case 'weight':
      return sql`weight`;
    case 'release':
      return sql`release`;
    case 'update_date':
      return sql`update_date`;
    default:
      return sql`name`;
  }
};

const buildOrderByQuery = ({ isAsc = true, column = 'name' }: FetchMostRecentYoYosParams['orderBy'] = {}) => sql`
  ORDER BY ${buildOrderColumnStatement(column)} ${isAsc ? sql`ASC` : sql`DESC`}
`;

export const fetchMostRecentYoYos = async ({ where, orderBy }: FetchMostRecentYoYosParams = {}) => sql<YoyoRow[]>`
    SELECT
      name,
      prod_id,
      href,
      status,
      diameter,
      body,
      width,
      weight,
      response,
      axle,
      release,
      bearing,
      img_src,
      update_date,
      unverified
    FROM
      yoyo_list AS a
      INNER JOIN (
        SELECT name as b_name, MAX(update_date) AS max_value
        FROM yoyo_list
        GROUP BY b_name
      ) AS b ON b.b_name= a.name AND b.max_value = a.update_date
    ${buildWhereQuery(where)}
    ${buildOrderByQuery(orderBy)};
  `;

export const addYoyos = async (yoyoRows: YoyoRow[]) => {
  await sql`
    INSERT INTO yoyo_list
    ${sql(yoyoRows)}
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
