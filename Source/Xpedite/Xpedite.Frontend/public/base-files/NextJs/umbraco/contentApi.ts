import { UmbracoNode } from "./types";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const CACHE_STRATEGY = 'force-cache';
const UMBRACO_SERVER_URL = process.env.UMBRACO_SERVER_URL;
const UMBRACO_DELIVERY_API_KEY = process.env.UMBRACO_DELIVERY_API_KEY;
const UMBRACO_API_URL = `${UMBRACO_SERVER_URL}/umbraco/delivery/api/v2/content`;

const fetchWithLogging = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
  
    if (!response.ok) {
      const message = `Could not fetch data for URL: ${url} - response status was: ${response.status}`;
      throw new Error(message);
    }
  
    return await response.json();
  };

export const getAllContentAsync = async <T extends UmbracoNode>(root: string, previewMode: boolean = false): Promise<T[]> => {
  const data = await fetchWithLogging(`${UMBRACO_API_URL}?take=100000`,
  {
    cache: CACHE_STRATEGY,
    method: 'GET',
    headers: {
      'Start-Item': root,
      'Api-Key': `${UMBRACO_DELIVERY_API_KEY}`,
      'Preview': `${previewMode}`,
    }
  });

  try {
    return data.items as T[];
  } catch (error) {
    const message = `Could not map data to expected format`;
    throw new Error(message);
  }
}

export const getContentItemAsync = async <T extends UmbracoNode>(root: string, path: string, previewMode: boolean = false): Promise<T> => {
  const data = await fetchWithLogging(`${UMBRACO_API_URL}/item/${path}?fields=properties%5B%24all%5D`,
  {
    cache: CACHE_STRATEGY,
    method: 'GET',
    headers: {
      // 'Start-Item': root,
      'Api-Key': `${UMBRACO_DELIVERY_API_KEY}`,
      'Preview': `${previewMode}`,
    }
  });

  try {
    return data as T;
  } catch (error) {
    const message = `Could not map data to expected format`;
    throw new Error(message);
  }
}