import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import satori from "satori";
import { join } from 'path';
import * as fs from "fs";
import axios from 'axios';
import TokenVotingWinningOption from '@/components/TokenVotingWinningOption';


const fontPath = join(process.cwd(), 'Manrope-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

let ipfsKey = process.env['IPFS_KEY']

let mainnetSubgraph = process.env['MAINNET_SUBGRAPH']!
let polygonSubgraph = process.env['POLYGON_SUBGRAPH']!
let baseSubgraph = process.env['BASE_SUBGRAPH']!
let arbitrumSubgraph = process.env['ARBITRUM_SUBGRAPH']!


const getSubpgraphLink = (chain: string): string => {
  if (chain === 'mainnet') return mainnetSubgraph
  else if (chain === 'polygon') return polygonSubgraph
  else if (chain === 'base') return baseSubgraph
  else return arbitrumSubgraph
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const daoId = req.query['dao']
    const chain = req.query['chain'] as string
    if (!daoId) {
      return res.status(400).send('Missing dao ID');
    }
    if (!chain) {
      return res.status(400).send('Missing chain');
    }

    const dao = (await axios.post(getSubpgraphLink(chain), {
      query: `
        query SearchDAO($daoId: ID!) {
          dao (id: $daoId) {
            metadata
            proposals(orderBy: id, orderDirection: desc) {
              metadata
              ... on TokenVotingProposal {
                yes
                no
                abstain
                totalVotingPower
              }
              ... on MultisigProposal {
                approvals
                minApprovals
              }
            }
          }
        }
      `,
      variables: {
        daoId,
      }
    },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )).data.data.dao

    let daoIPFS = dao.metadata.includes('ipfs://') ? dao.metadata.substring(7) : dao.metadata

    let lastProposal = dao.proposals[0].metadata ? dao.proposals[0] : dao.proposals[1]
    let proposalIPFS = lastProposal.metadata.includes('ipfs://') ? lastProposal.metadata.substring(7) : lastProposal.metadata


    const daoMetadata = (await axios({
      method: 'post',
      url: `https://prod.ipfs.aragon.network/api/v0/cat?arg=${daoIPFS}`,
      headers: {
        'X-API-KEY': ipfsKey,
        'Accept': 'application/json',
      }
    })).data

    const proposalMetadata = (await axios({
      method: 'post',
      url: `https://prod.ipfs.aragon.network/api/v0/cat?arg=${proposalIPFS}`,
      headers: {
        'X-API-KEY': ipfsKey,
        'Accept': 'application/json',
      }
    })).data

    let avatar = daoMetadata.avatar.includes('ipfs://') ? daoMetadata.avatar.substring(7) : daoMetadata.avatar

    const svg = await satori(
      <div style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 12,
        fontSize: 14,
        aspectRatio: '3/2',
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
              <img src={`https://ipfs.io/ipfs/${avatar}`}
                alt="Aragon Proposal"
                width="50"
                height="50"
                style={{ borderRadius: '50%' }}
              />
              <h2 style={{ textAlign: 'center', color: '#323F4B', fontSize: '1.3rem', paddingLeft: 6 }}>
                {daoMetadata.name}
              </h2>
            </div>

            <h2 style={{ textAlign: 'center', color: '#616E7C', fontSize: '1.1rem' }}>
              Powered by <b style={{ color: '#3164FA' }}>&nbsp;Aragon</b>
            </h2>

          </div>
          <h1 style={{ textAlign: 'start', color: '#323F4B', fontSize: 30, lineHeight: 1, marginBottom: 0, marginTop: 0 }}>
            {proposalMetadata.title}
          </h1>

          <p style={{ textAlign: 'start', color: '#616E7C', fontSize: 22, marginTop: 1.2 }}>
            {proposalMetadata.summary.length > 108 ? proposalMetadata.summary.substring(0, 108) + '...' : proposalMetadata.summary}
          </p>
          <TokenVotingWinningOption proposal={lastProposal} />
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
