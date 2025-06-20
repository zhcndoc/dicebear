import { XMLParser } from 'fast-xml-parser';
import { Metadata } from '../types';

export function ensureSize(svg: string, defaultSize: number = 512) {
  let size = defaultSize;

  svg = svg.replace(/<svg([^>]*)/, (match, g1) => {
    const found = g1.match(/width="([^"]+)"/);

    if (found) {
      size = parseInt(found[1]);
    }

    if (g1.match(/width="([^"]+)"/)) {
      g1 = g1.replace(/width="([^"]+)"/, `width="${size}"`);
    } else {
      g1 += ` width="${size}"`;
    }

    if (g1.match(/height="([^"]+)"/)) {
      g1 = g1.replace(/height="([^"]+)"/, `height="${size}"`);
    } else {
      g1 += ` height="${size}"`;
    }

    return `<svg${g1}`;
  });

  return { svg, size };
}

export function getMetadata(svg: string): Metadata {
  const parser = new XMLParser();
  const xml = parser.parse(svg);

  const rdfDescription = xml.svg.metadata?.['rdf:RDF']?.['rdf:Description'];

  return {
    title: rdfDescription?.['dc:title'],
    source: rdfDescription?.['dc:source'],
    creator: rdfDescription?.['dc:creator'],
    license: rdfDescription?.['dcterms:license'],
    copyright: rdfDescription?.['dc:rights'],
  };
}
