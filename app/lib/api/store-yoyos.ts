import { parse } from 'node-html-parser';
import type html from 'node-html-parser/dist/nodes/html';

import { fetchYoyoByName } from '@/app/lib/db/yoyoList';
import { fetchColorWayByName, addColorWay } from '@/app/lib/db/colorWays';

import type { YoyoRow } from '@/app/lib/db/yoyoList';
import type { ColorWayRow } from '@/app/lib/db/colorWays';

/**
 * @fileoverview
 *
 * Scrubbing https://www.gsquaredyoyos.com/store/product-category/yoyos/
 */

const descriptionHelper = (line: string, isNumber: boolean = true) => {
  try {
    const value = line.split('&#8211;')[1].trim();
    if (isNumber) {
      return parseFloat(value.replace(/\[^0-9.]/g, ''));
    }

    return value;
  } catch {
    return 0;
  }
};

export const parseProductPage = async (href: string | undefined | null) => {
  const yoyoConfig: Record<string, string | number> = {};
  if (!href || !href.includes('http')) {
    return yoyoConfig;
  }
  const payload = await fetch(href);
  const payloadText = await payload.text();
  const root = parse(payloadText);
  const description = root.querySelector('.woocommerce-product-details__short-description');
  if (description && description.innerText) {
    description.innerText.split('\n').forEach((line) => {
      if (line.includes('Diameter')) {
        yoyoConfig.diameter = descriptionHelper(line) as number;
      }
      if (line.includes('Width')) {
        yoyoConfig.width = descriptionHelper(line) as number;
      }
      if (line.includes('Response')) {
        yoyoConfig.response = descriptionHelper(line, false) as string;
      }
      if (line.includes('Body')) {
        yoyoConfig.body = descriptionHelper(line, false) as string;
      }
      if (line.includes('Weight')) {
        yoyoConfig.weight = descriptionHelper(line) as number;
      }
      if (line.includes('Axle')) {
        yoyoConfig.axle = descriptionHelper(line) as number;
      }
      if (line.includes('Bearing')) {
        yoyoConfig.bearing = descriptionHelper(line, false) as string;
      }
    });
  }
  return yoyoConfig;
};

export const parseProductInfo = async (productItem: html) => {
  let dbYoyos: YoyoRow[] = [];
  let dbColorWayNames: ColorWayRow[] = [];
  const title = productItem.querySelector('.woocommerce-loop-product__title');
  const img = productItem.querySelector('img');
  const productLink = productItem.querySelector('a.product_type_simple')?.getAttribute('href');

  if (title?.innerText && img && productLink) {
    const [yoyoName, colorWayName] = title.innerText.split(' &#8211; ');
    dbYoyos = await fetchYoyoByName(yoyoName);

    // TODO flip conditional
    if (dbYoyos.length >= 0) {
      parseProductPage(productLink);
    }
    dbColorWayNames = await fetchColorWayByName(colorWayName);
    const imgSrc = img.getAttribute('src');
    if (imgSrc && dbColorWayNames.length === 0) {
      const rawImg = imgSrc.replace(/(-)\d+x\d+/, '');
      dbColorWayNames = await addColorWay({
        src: rawImg,
        name: colorWayName,
        unverified: true,
      });
    }
  }

  return { productLink, yoyo: dbYoyos[0], colorWay: dbColorWayNames[0] };
};

export const fetchYoyos = async () => {
  const payload = await fetch('https://www.gsquaredyoyos.com/store/product-category/yoyos/');
  const payloadText = await payload.text();
  const root = parse(payloadText);
  const list = root.querySelectorAll('.products li');
  const promises = list.map(async (productItem) => parseProductInfo(productItem));

  const newYoyos = await Promise.all(promises);
  return newYoyos;
};
