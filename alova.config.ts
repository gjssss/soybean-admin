import type { Config } from '@alova/wormhole';
export default {
  generator: [
    {
      input: 'http://localhost:8080/swagger/doc.json',
      output: 'src/api'
    }
  ]
} as Config;
