import fastXmlParser, { j2xParser as J2xParser } from 'fast-xml-parser';
import {
  getURLExtension, getSVGPathD, getShapeXYMaxMin, convertDateToString
} from './index';

const paths = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 }
];
const xmlStr = `
  <annotation>
    <folder>test</folder>
    <filename>test.jpg</filename>
    <path>/home/test.jpg</path>
    <source>
      <database>Unknown</database>
    </source>
    <size>
      <width>1280</width>
      <height>720</height>
      <depth>3</depth>
    </size>
    <segmented>0</segmented>
    <object>
      <name>Dog</name>
      <pose>Unspecified</pose>
      <truncated>0</truncated>
      <difficult>0</difficult>
      <bndbox>
        <xmin>0</xmin>
        <ymin>0</ymin>
        <xmax>50</xmax>
        <ymax>50</ymax>
      </bndbox>
    </object>
    <object>
      <name>Cat</name>
      <pose>Unspecified</pose>
      <truncated>0</truncated>
      <difficult>0</difficult>
      <bndbox>
        <xmin>50</xmin>
        <ymin>50</ymin>
        <xmax>100</xmax>
        <ymax>100</ymax>
      </bndbox>
    </object>
  </annotation>
`;
const xmlObj = {
  annotation: {
    folder: 'test',
    filename: 'test.jpg',
    path: '/home/test.jpg',
    source: {
      database: 'Unknown'
    },
    size: {
      width: 1280,
      height: 720,
      depth: 3
    },
    segmented: 0,
    object: [
      {
        name: 'Dog',
        pose: 'Unspecified',
        truncated: 0,
        difficult: 0,
        bndbox: {
          xmin: 0,
          ymin: 0,
          xmax: 50,
          ymax: 50
        }
      },
      {
        name: 'Cat',
        pose: 'Unspecified',
        truncated: 0,
        difficult: 0,
        bndbox: {
          xmin: 50,
          ymin: 50,
          xmax: 100,
          ymax: 100
        }
      }
    ]
  }
};

describe('getSVGPathD', () => {
  test('valid', () => {
    expect(getURLExtension('http://example/image.jpg')).toEqual('jpg');
  });
  test('not valid', () => {
    expect(getURLExtension('http://example/image')).toEqual(undefined);
  });
});

describe('getSVGPathD', () => {
  test('getSVGPathD(paths, true)', () => {
    expect(getSVGPathD(paths, false)).toEqual('M0,0 L100,0 L100,100 L0,100 ');
  });
  test('getSVGPathD(paths, false)', () => {
    expect(getSVGPathD(paths, true)).toEqual('M0,0 L100,0 L100,100 L0,100 Z');
  });
});

describe('getShapeXYMaxMin', () => {
  test('getShapeXYMaxMin', () => {
    const expectValue = {
      xmin: 0,
      ymin: 0,
      xmax: 100,
      ymax: 100
    };
    expect(getShapeXYMaxMin(paths)).toEqual(expectValue);
  });
});

describe('fastXmlParser', () => {
  test('XML to JSON', () => {
    expect(fastXmlParser.parse(xmlStr)).toEqual(xmlObj);
  });

  test('JSON to XML', () => {
    expect(new J2xParser({ format: true }).parse(xmlObj).replace(/\s+/g, '')).toEqual(xmlStr.replace(/\s+/g, ''));
  });
});

describe('convertDateToString', () => {
  test('convertDateToString', () => {
    const dateObj = new Date('2021-01-01 10:20:30');
    const expectValue = '20210101102030';
    expect(convertDateToString(dateObj)).toEqual(expectValue);
  });
});
