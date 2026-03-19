import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { Metadata } from '../types';

const MAX_SIZE = 2048;
const DEFAULT_SIZE = 512;

const xmlRoundTripOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  preserveOrder: true,
  commentPropName: '#comment',
  allowBooleanAttributes: true,
};

const xmlRoundTripParser = new XMLParser(xmlRoundTripOptions);
const xmlRoundTripBuilder = new XMLBuilder(xmlRoundTripOptions);

function sanitizeSize(size: number): number {
  if (!Number.isFinite(size) || size <= 0) {
    return DEFAULT_SIZE;
  }

  return Math.floor(Math.min(size, MAX_SIZE));
}

export function ensureSize(svg: string, size: number = DEFAULT_SIZE) {
  size = sanitizeSize(size);

  const parsed = xmlRoundTripParser.parse(svg);
  const svgNode = parsed.find((node: Record<string, unknown>) => 'svg' in node);

  if (svgNode) {
    svgNode[':@'] ??= {};
    svgNode[':@']['@_width'] = String(size);
    svgNode[':@']['@_height'] = String(size);
  }

  svg = xmlRoundTripBuilder.build(parsed);

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
