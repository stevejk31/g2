import sql from '@/app//lib/db/sql';

// eslint-disable-next-line import/prefer-default-export
export const buildWhereOrAnd = (isAnd: boolean = true) => (isAnd ? sql`AND` : sql`Where`);
