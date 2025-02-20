import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: 'fetch',
    debug: true,
    input: 'http://localhost:3662/umbraco/swagger/xpedite-api-v1/swagger.json',
    output: {
        path: 'src/api',
        format: 'prettier',
        lint: 'eslint',
    },
    schemas: false,
    services: {
        asClass: true,
    },
    types: {
        enums: 'typescript',
    }
});
