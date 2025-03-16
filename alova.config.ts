import type { Config } from '@alova/wormhole'

export default {
  generator: [
    {
      input: 'swagger/doc.json',
      output: 'src/api',
    },
  ],
} as Config
