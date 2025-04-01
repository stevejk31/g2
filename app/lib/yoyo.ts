import sql from './sql';

export interface YoyoDetail {
  'prodId'?: string;
  'href'?: string;
  'Status'?: string;
  'Diameter'?: string;
  'Width'?: string;
  'Weight'?: string;
  'Response'?: string;
  'Axle'?: string;
  'Release'?: string;
  'Bearing'?: string;
  'imgSrc'?: string;
}

const createYoYoListTable = async () => {
  await sql`
    DROP TABLE IF EXISTS yoyo_list;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS yoyo_list(id SERIAL PRIMARY KEY,
      name TEXT,
      prod_id TEXT,
      href TEXT NOT NULL,
      status TEXT,
      diameter TEXT,
      width TEXT,
      weight TEXT,
      response TEXT,
      axle TEXT,
      release TEXT,
      bearing TEXT,
      img_src TEXT
    );
  `;
};

const getYoYoList = async () => {
  const payload = await sql`
    SELECT *
    FROM yoyo_list;
  `;
  return payload;
};

export const populateYoYoList = async (yoyos: Record<string, YoyoDetail>) => {
  const sqlValues = Object.entries(yoyos).map(([name, yoyo]) => {
    const {
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
    } = yoyo as YoyoDetail;
    return `'${name}', '${prodId}', '${href}', '${Status}', '${Diameter}', '${Width}', '${Weight}', '${Response}',
      '${Axle}', '${Release}', '${Bearing}', '${imgSrc}'`
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  });

  console.log(sqlValues[0]);
  await createYoYoListTable();
  const [name, {
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
  }] = Object.entries(yoyos);

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
      '${name}',
      '${prodId}',
      '${href}',
      '${Status}',
      '${Diameter}',
      '${Width}',
      '${Weight}',
      '${Response}',
      '${Axle}',
      '${Release}',
      '${Bearing}',
      '${imgSrc}'
    );
  `;
  return getYoYoList();
};
