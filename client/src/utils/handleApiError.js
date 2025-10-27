/**
 * Centralized API error handling utilities.
 * Usage:
 *  - In a catch block: await handleApiError(err, { defaultMessage: 'Failed to load notifications' });
 *  - Or use apiFetch to wrap fetch with consistent error handling.
 */

/**
 * Safely parse JSON without throwing if body is empty or invalid.
 */
export async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    try {
      const text = await response.text();
      return text || null;
    } catch {
      return null;
    }
  }
}

/**
 * Handle errors consistently. Accepts either:
 *  - a Response (thrown when !res.ok and you throw res)
 *  - an Error (e.g., network failures)
 */
export async function handleApiError(errorOrResponse, { defaultMessage = 'Request failed' } = {}) {
  // If a Response object was thrown
  if (errorOrResponse && typeof errorOrResponse === 'object' && 'ok' in errorOrResponse && errorOrResponse.ok === false) {
    const res = errorOrResponse;
    let body = null;
    try {
      body = await res.clone().json();
    } catch {
      try {
        body = await res.clone().text();
      } catch {
        body = null;
      }
    }

    const message =
      (body && typeof body === 'object' && body.message) ||
      (typeof body === 'string' && body) ||
      `${defaultMessage} (HTTP ${res.status})`;

    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    err.url = res.url;
    throw err;
  }

  // Network/CORS or other runtime errors
  if (errorOrResponse instanceof TypeError && /fetch/i.test(errorOrResponse.message)) {
    const err = new Error('Network error or CORS issue. Please check your connection and backend URL.');
    err.cause = errorOrResponse;
    throw err;
  }

  // Fallback: rethrow with default message if needed
  if (errorOrResponse instanceof Error) {
    throw errorOrResponse;
  }

  throw new Error(defaultMessage);
}

/**
 * Convenience wrapper for fetch with standard error handling.
 * Set expectJson=false if you want the raw Response back.
 */
export async function apiFetch(input, init, { expectJson = true, defaultMessage = 'Request failed' } = {}) {
  try {
    const res = await fetch(input, init);
    if (!res.ok) throw res;
    return expectJson ? await parseJsonSafe(res) : res;
  } catch (e) {
    await handleApiError(e, { defaultMessage });
  }
}