import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";

const fontPath = join(process.cwd(), 'Manrope-Regular.ttf')
// const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
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
        backgroundColor: 'white',
        padding: 24,
        fontSize: 14,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex' }}>
              <img src="https://pbs.twimg.com/profile_images/1696708161103921152/_6R6pJoS_400x400.jpg"
                alt="Trulli"
                width="50"
                height="50"
                style={{ borderRadius: '50%' }}
              />
              <h2 style={{ textAlign: 'center', color: '#323F4B', fontSize: '1.3rem', paddingLeft: 6 }}>
                Devolved AI Treasury DAO
              </h2>
            </div>

            <h2 style={{ textAlign: 'center', color: '#616E7C', fontSize: '1.1rem' }}>
              Powered by <b style={{ color: '#3164FA' }}>&nbsp;Aragon</b>
            </h2>

          </div>
          <h1 style={{ textAlign: 'start', color: '#323F4B', fontSize: 30, lineHeight: 1, marginBottom: 0, marginTop: 0.6 }}>
            This is an Aragon proposal title
          </h1>

          <p style={{ textAlign: 'start', color: '#616E7C', fontSize: 22 }}>
            This is an Aragon proposal description. This is an Aragon proposal description. This is an Aragon proposal description.
          </p>


          <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px',
            borderColor: '#E4E7EB',
            borderRadius: '8px',
            marginTop: 5,
            padding: 15,
            boxShadow: '0px 1px 2px 0px rgba(97, 110, 124, 0.05)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <p style={{ color: '#323F4B', fontSize: '1.25rem', margin: '0.5em' }}>
                Winning Option
              </p>
              <p style={{ color: '#616E7C', fontSize: '1.25rem', margin: '0.5em' }}>
                64%
              </p>
            </div>

            <div style={{
              display: 'flex',
              backgroundColor: '#E4E7EB',
              borderRadius: 12,
              width: `100%`,
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}>
              <div style={{
                backgroundColor: '#007bff',
                padding: 10,
                borderRadius: 12,
                width: `64%`,
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <p style={{ color: '#3164FA', fontSize: '1.3rem', margin: '0.5em' }}>
                No
              </p>
              <p style={{ color: '#616E7C', fontSize: '1.3rem', margin: '0.5em' }}>
                3.5M wANT
              </p>
            </div>


          </div>
        </div>
      </div>
      ,
      {
        width: 600, height: 400, fonts: [{ data: fontData, name: 'Manrope', weight: 400, style: 'normal', },],
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
