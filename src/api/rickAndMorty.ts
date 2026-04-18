import type { Character, CharactersApiResponse } from '../types/api';

const BASE = 'https://rickandmortyapi.com/api';

const MAX_FETCH_ATTEMPTS = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Delay before retry: prefer Retry-After header, else exponential backoff (capped). */
function getRetryDelayMs(res: Response, attemptIndex: number): number {
  const ra = res.headers.get('Retry-After');
  if (ra) {
    const seconds = parseInt(ra, 10);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, 60_000);
    }
  }
  return Math.min(10_000, 400 * 2 ** attemptIndex);
}

/**
 * Fetch with retries when the API rate-limits (429) or is temporarily unavailable (503).
 */
async function fetchWithRetry(url: string): Promise<Response> {
  let attempt = 0;
  while (attempt < MAX_FETCH_ATTEMPTS) {
    const res = await fetch(url);
    if (res.status !== 429 && res.status !== 503) {
      return res;
    }
    attempt += 1;
    if (attempt >= MAX_FETCH_ATTEMPTS) {
      if (res.status === 429) {
        throw new Error(
          'Too many requests — please wait a few seconds and try again.',
        );
      }
      throw new Error(`Service temporarily unavailable (${res.status})`);
    }
    await sleep(getRetryDelayMs(res, attempt));
  }
  throw new Error('Request failed after retries');
}

export async function fetchCharactersPage(
  page: number,
  name: string,
): Promise<CharactersApiResponse> {
  const params = new URLSearchParams({ page: String(page) });
  const trimmed = name.trim();
  if (trimmed) {
    params.set('name', trimmed);
  }
  const res = await fetchWithRetry(`${BASE}/character?${params.toString()}`);
  if (res.status === 404) {
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<CharactersApiResponse>;
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const res = await fetchWithRetry(`${BASE}/character/${id}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<Character>;
}
