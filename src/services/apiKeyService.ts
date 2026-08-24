const STORAGE_KEY = 'stockpulse_gemini_api_key';

/**
 * Retrieve the user's locally stored individual Gemini API key
 */
export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

/**
 * Store the user's individual Gemini API key in browser storage
 */
export function setStoredApiKey(apiKey: string): void {
  try {
    if (!apiKey || !apiKey.trim()) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
    }
  } catch (err) {
    console.error('Failed to save API key to localStorage:', err);
  }
}

/**
 * Clear the user's individual Gemini API key
 */
export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear API key from localStorage:', err);
  }
}

/**
 * Check if the user has an individual API key stored
 */
export function hasStoredApiKey(): boolean {
  return !!getStoredApiKey();
}

/**
 * Get headers object including the BYOK API key header if available
 */
export function getApiAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const apiKey = getStoredApiKey();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }

  return headers;
}

/**
 * Test & verify the Gemini API key against the backend proxy
 */
export async function verifyApiKey(apiKeyToTest?: string): Promise<{ valid: boolean; message: string; model?: string }> {
  const key = apiKeyToTest !== undefined ? apiKeyToTest.trim() : getStoredApiKey();

  const response = await fetch('/api/key/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'x-gemini-api-key': key } : {}),
    },
    body: JSON.stringify({ apiKey: key }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify API key with Gemini');
  }

  return data;
}
