import { CONFIG } from './config';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function createShortLink(url: string, apiKey: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${CONFIG.API_BASE_URL}/links/v1/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new ApiError('Could not connect. Check your internet connection.');
  }

  if (response.ok) {
    const data = (await response.json()) as { alias?: string };
    if (!data.alias) {
      throw new ApiError('Something went wrong. Please try again.');
    }
    return `${CONFIG.SHORT_URL_BASE}/${data.alias}`;
  }

  let errorCode: string | undefined;
  try {
    const errData = (await response.json()) as { code?: string };
    errorCode = errData.code;
  } catch {
    // body not parseable — ignore
  }

  switch (response.status) {
    case 401:
      throw new ApiError('Invalid API key. Check your settings.');
    case 403:
      if (errorCode === 'DOMAIN_BANNED') {
        throw new ApiError('This domain is not allowed.');
      }
      throw new ApiError('Invalid API key. Check your settings.');
    case 429:
      throw new ApiError('Too many requests — please wait a moment.');
    case 503:
      throw new ApiError('Service temporarily unavailable.');
    default:
      throw new ApiError('Something went wrong. Please try again.');
  }
}
