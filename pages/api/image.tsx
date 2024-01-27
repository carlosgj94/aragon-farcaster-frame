import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pollId = req.query['dao']
    // const fid = parseInt(req.query['fid']?.toString() || '')
    if (!pollId) {
      return res.status(400).send('Missing poll ID');
    }

    const svg = await satori(
      <div style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'f4f4f4',
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
        }}>
          <h2 style={{ textAlign: 'center', color: 'lightgray' }}>This is the proposal title</h2>
          <div style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            width: `20%`,
            whiteSpace: 'nowrap',
            overflow: 'visible',
          }}>Yes</div>
          <div style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            width: `60%`,
            whiteSpace: 'nowrap',
            overflow: 'visible',
          }}>No</div>
          <div style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            width: `20%`,
            whiteSpace: 'nowrap',
            overflow: 'visible',
          }}>Abstain</div>
        </div>
      </div>
      ,
      {
        width: 600, height: 400, fonts: [{ data: fontData, name: 'Roboto', weight: 400, style: 'normal', },],
      })
    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .toFormat('png')
      .toBuffer();
    // Set the content type to PNG and send the response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'max-age=10');
    res.send(pngBuffer);
  }
  catch (err) {
    res.status(500).send('Error generating image');
  }
}
