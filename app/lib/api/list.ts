import { parse } from 'node-html-parser';
import type html from 'node-html-parser/dist/nodes/html';
import fsPromises from 'fs/promises';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @fileoverview
 *
 * Scrubbing https://www.gsquaredyoyos.com/yoyo-list/.
 */

export interface YoyoDetail {
  'name': string;
  'prodId': string;
  'href': string;
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

const findViewLink = (node: html) => {
  const aTags = node.querySelectorAll('a');
  let found;
  for (let i = 0; i < aTags.length; i++) {
    const aTag = aTags[i];
    const link = aTag.getAttribute('href') || '';

    if (link.includes('http')) {
      found = link;
      break;
    }
  }
  return found;
};

const getYoYoDetails = async (href: string): Promise<Partial<YoyoDetail>> => {
  const config: Record<string, string> = {};
  const payload = await fetch(href);
  const payloadText = await payload.text();
  const root = parse(payloadText);
  const lists = root.querySelectorAll('.params-list');
  let key: string;
  let value: string;
  lists.forEach((list) => {
    list.querySelectorAll('li').forEach((li) => {
      const className = li.getAttribute('class');
      if (className === 'parameter-block') {
        key = li.innerText;
        value = '';
      }
      if (className === 'value-block' && !!key) {
        value = li.innerText;
        config[key] = value;
        key = '';
      }
    });
  });
  return config;
};

export const getNameToConfig = async () => {
  const nameToLink: Record<string, YoyoDetail> = {};
  const payload = await fetch('https://www.gsquaredyoyos.com/yoyo-list/');
  const payloadText = await payload.text();
  const root = parse(payloadText);
  const list = root.querySelector('.super-list') || { children: [] };

  const promises = list.children.map(async (child) => {
    const viewLink = findViewLink(child) || '';
    const img = child.querySelector('img');
    const imgSrc = img?.getAttribute('src');
    const header = child.querySelector('h3') || { innerText: '' };
    if (header.innerText && viewLink) {
      const prodId = viewLink.split('?single_prod_id=')[1];
      const yoyoConfig = await getYoYoDetails(viewLink);
      nameToLink[header.innerText] = {
        ...yoyoConfig,
        name: header.innerText,
        href: viewLink,
        prodId,
        imgSrc,
      };
    }
  });

  await Promise.all(promises);
  if (isDev) {
    fsPromises.writeFile(
      path.join(process.cwd(), `backup/yoyo-list-poll-${new Date().toISOString().split('T')[0]}.json`),
      JSON.stringify(Object.values(nameToLink).sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      })),
    );
  }

  return nameToLink;
};
