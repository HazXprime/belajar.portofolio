/**
 * Fetch wrapper for unified REST API communication.
 * Handles JSON serialization, credentials (cookies), and uniform error formats.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const defaultHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers: defaultHeaders,
    credentials: "include", // Send and receive HttpOnly cookies
  };

  try {
    const res = await fetch(url, config);
    let data = null;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { text: await res.text() };
    }

    if (!res.ok) {
      const error = new Error(data?.message || data?.error || `HTTP ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: "DELETE" }),
};
