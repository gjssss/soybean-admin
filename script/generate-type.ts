import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import wormhole from '@alova/wormhole'

import axios from 'axios'
import dotenv from 'dotenv'

async function main() {
  dotenv.config({
    path: '.env.local',
  })
  const PROJECT_ID = process.env.APIFOX_PROJECT_ID
  const TOKEN = process.env.APIFOX_TOKEN

  const { data } = await axios.post(`https://api.apifox.com/v1/projects/${PROJECT_ID}/export-openapi`, {}, {
    headers: {
      'X-Apifox-Api-Version': '2024-03-28',
      'Authorization': `Bearer ${TOKEN}`,
    },
  })
  await writeFile('swagger/doc.json', JSON.stringify(data, null, 2))
  const config = await wormhole.readConfig()
  await wormhole.generate(config)
}

main()
