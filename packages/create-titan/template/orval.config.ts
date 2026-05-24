import { defineConfig } from 'orval';

export default defineConfig({
  titan: {
    input: './openapi/titan-api.yaml',
    output: {
      target: 'src/infrastructure/api/generated',
      client: 'angular',
      mode: 'tags-split',
      mock: false,
    },
  },
});
