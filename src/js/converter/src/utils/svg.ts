import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { Metadata } from '../types';

const MAX_SIZE = 2048;
const DEFAULT_SIZE = 512;
const MAX_METADATA_LENGTH = 1024;

const xmlRoundTripOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  preserveOrder: true,
  commentPropName: '#comment',
  allowBooleanAttributes: true,
  processEntities: false,
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

function sanitizeMetadataValue(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }

  return value.slice(0, MAX_METADATA_LENGTH);
}

export function getMetadata(svg: string): Metadata {
  const parser = new XMLParser();
  const xml = parser.parse(svg);

  const rdfDescription = xml.svg.metadata?.['rdf:RDF']?.['rdf:Description'];

  return {
    title: sanitizeMetadataValue(rdfDescription?.['dc:title']),
    source: sanitizeMetadataValue(rdfDescription?.['dc:source']),
    creator: sanitizeMetadataValue(rdfDescription?.['dc:creator']),
    license: sanitizeMetadataValue(rdfDescription?.['dcterms:license']),
    copyright: sanitizeMetadataValue(rdfDescription?.['dc:rights']),
  };
}
