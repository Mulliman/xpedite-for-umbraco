import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { OpenAPI } from './api/index.ts';
import manifests from './manifests.ts';

export const onInit: UmbEntryPointOnInit = async (_host, extensionRegistry) => {
    

    _host.consumeContext(UMB_AUTH_CONTEXT, async (auth) => {
        if (!auth) return;

        const umbOpenApi = auth.getOpenApiConfiguration();
        OpenAPI.BASE = umbOpenApi.base;
        OpenAPI.TOKEN = umbOpenApi.token;
        OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
        OpenAPI.CREDENTIALS = umbOpenApi.credentials;
    });
    
    manifests.forEach((manifest) => {
        if(!extensionRegistry.isRegistered(manifest.alias)){
          extensionRegistry.register(manifest);
        }
      });
};

