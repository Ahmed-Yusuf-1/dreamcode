/**
 * Spotify PKCE (Proof Key for Code Exchange) OAuth implementation.
 * Allows pure client-side authorization without exposing a Client Secret.
 */

const STORAGE_VERIFIER_KEY = "dc_spotify_verifier";
const STORAGE_TOKEN_KEY = "dc_spotify_token";
const STORAGE_REFRESH_KEY = "dc_spotify_refresh";
const STORAGE_EXPIRES_KEY = "dc_spotify_expires_at";

const SCOPES = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-email",
  "user-read-private",
].join(" ");

function dec2hex(dec: number): string {
  return dec.toString(16).padStart(2, "0");
}

function generateCodeVerifier(): string {
  const array = new Uint32Array(56);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

function base64urlencode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashed = await window.crypto.subtle.digest("SHA-256", data);
  return base64urlencode(hashed);
}

export async function redirectToSpotifyAuth(clientId: string) {
  if (!clientId) return;
  const verifier = generateCodeVerifier();
  localStorage.setItem(STORAGE_VERIFIER_KEY, verifier);

  const challenge = await generateCodeChallenge(verifier);
  const redirectUri = window.location.origin;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SCOPES,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(clientId: string, code: string): Promise<string | null> {
  const verifier = localStorage.getItem(STORAGE_VERIFIER_KEY);
  if (!verifier) return null;

  const redirectUri = window.location.origin;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Spotify token exchange error:", err);
      return null;
    }

    const data = await res.json();
    saveTokens(data);
    localStorage.removeItem(STORAGE_VERIFIER_KEY);
    return data.access_token;
  } catch (err) {
    console.error("Spotify token exchange request failed:", err);
    return null;
  }
}

export async function refreshSpotifyToken(clientId: string): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_REFRESH_KEY);
  if (!refreshToken) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Spotify token refresh error:", err);
      clearTokens();
      return null;
    }

    const data = await res.json();
    saveTokens(data);
    return data.access_token;
  } catch (err) {
    console.error("Spotify token refresh request failed:", err);
    return null;
  }
}

export async function getValidToken(clientId: string): Promise<string | null> {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const expiresAt = localStorage.getItem(STORAGE_EXPIRES_KEY);

  if (!token || !expiresAt) return null;

  const now = Date.now();
  const timeRemaining = parseInt(expiresAt, 10) - now;

  // If token is still valid (with 2 minutes buffer), return it
  if (timeRemaining > 120 * 1000) {
    return token;
  }

  // Otherwise, refresh it
  return refreshSpotifyToken(clientId);
}

function saveTokens(data: { access_token: string; refresh_token?: string; expires_in: number }) {
  localStorage.setItem(STORAGE_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(STORAGE_REFRESH_KEY, data.refresh_token);
  }
  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem(STORAGE_EXPIRES_KEY, expiresAt.toString());
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_REFRESH_KEY);
  localStorage.removeItem(STORAGE_EXPIRES_KEY);
  localStorage.removeItem(STORAGE_VERIFIER_KEY);
}

export function cleanUrlParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has("code") || url.searchParams.has("state")) {
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
}
