// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { PostApiV1XpediteAddBaseFilesResponse, PostApiV1XpediteAddEnvFileResponse, PostApiV1XpediteAssistantBlockActionData, PostApiV1XpediteAssistantBlockActionResponse, PostApiV1XpediteAssistantBlockChecksData, PostApiV1XpediteAssistantBlockChecksResponse, PostApiV1XpediteAssistantTemplateActionData, PostApiV1XpediteAssistantTemplateActionResponse, PostApiV1XpediteAssistantTemplateChecksData, PostApiV1XpediteAssistantTemplateChecksResponse, PostApiV1XpediteGenerateBlockData, PostApiV1XpediteGenerateBlockResponse, PostApiV1XpediteGeneratePartialData, PostApiV1XpediteGeneratePartialResponse, PostApiV1XpediteGenerateTemplateData, PostApiV1XpediteGenerateTemplateResponse, GetApiV1XpediteGetConfigResponse, PostApiV1XpediteSaveBlockData, PostApiV1XpediteSaveBlockResponse, PostApiV1XpediteSavePartialData, PostApiV1XpediteSavePartialResponse, PostApiV1XpediteSaveTemplateData, PostApiV1XpediteSaveTemplateResponse } from './types.gen';

export class V1Service {
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static postApiV1XpediteAddBaseFiles(): CancelablePromise<PostApiV1XpediteAddBaseFilesResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/add-base-files',
            responseHeader: 'Umb-Notifications',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static postApiV1XpediteAddEnvFile(): CancelablePromise<PostApiV1XpediteAddEnvFileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/add-env-file',
            responseHeader: 'Umb-Notifications',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteAssistantBlockAction(data: PostApiV1XpediteAssistantBlockActionData = {}): CancelablePromise<PostApiV1XpediteAssistantBlockActionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/assistant-block-action',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token',
                403: 'The authenticated user do not have access to this resource'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteAssistantBlockChecks(data: PostApiV1XpediteAssistantBlockChecksData = {}): CancelablePromise<PostApiV1XpediteAssistantBlockChecksResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/assistant-block-checks',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token',
                403: 'The authenticated user do not have access to this resource'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteAssistantTemplateAction(data: PostApiV1XpediteAssistantTemplateActionData = {}): CancelablePromise<PostApiV1XpediteAssistantTemplateActionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/assistant-template-action',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token',
                403: 'The authenticated user do not have access to this resource'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteAssistantTemplateChecks(data: PostApiV1XpediteAssistantTemplateChecksData = {}): CancelablePromise<PostApiV1XpediteAssistantTemplateChecksResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/assistant-template-checks',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token',
                403: 'The authenticated user do not have access to this resource'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteGenerateBlock(data: PostApiV1XpediteGenerateBlockData = {}): CancelablePromise<PostApiV1XpediteGenerateBlockResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/generate-block',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteGeneratePartial(data: PostApiV1XpediteGeneratePartialData = {}): CancelablePromise<PostApiV1XpediteGeneratePartialResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/generate-partial',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.requestBody
     * @returns unknown OK
     * @throws ApiError
     */
    public static postApiV1XpediteGenerateTemplate(data: PostApiV1XpediteGenerateTemplateData = {}): CancelablePromise<PostApiV1XpediteGenerateTemplateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/generate-template',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @returns unknown OK
     * @throws ApiError
     */
    public static getApiV1XpediteGetConfig(): CancelablePromise<GetApiV1XpediteGetConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/xpedite/get-config',
            errors: {
                401: 'The resource is protected and requires an authentication token'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.force
     * @param data.requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static postApiV1XpediteSaveBlock(data: PostApiV1XpediteSaveBlockData = {}): CancelablePromise<PostApiV1XpediteSaveBlockResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/save-block',
            query: {
                force: data.force
            },
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                400: 'Bad Request',
                401: 'The resource is protected and requires an authentication token',
                409: 'Conflict'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.force
     * @param data.requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static postApiV1XpediteSavePartial(data: PostApiV1XpediteSavePartialData = {}): CancelablePromise<PostApiV1XpediteSavePartialResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/save-partial',
            query: {
                force: data.force
            },
            body: data.requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                400: 'Bad Request',
                401: 'The resource is protected and requires an authentication token',
                409: 'Conflict'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.force
     * @param data.requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static postApiV1XpediteSaveTemplate(data: PostApiV1XpediteSaveTemplateData = {}): CancelablePromise<PostApiV1XpediteSaveTemplateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/xpedite/save-template',
            query: {
                force: data.force
            },
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                400: 'Bad Request',
                401: 'The resource is protected and requires an authentication token',
                409: 'Conflict'
            }
        });
    }
    
}