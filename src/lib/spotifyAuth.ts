/**
 * Spotify PKCE (Proof Key for Code Exchange) OAuth implementation.
 * Allows pure client-side authorization without exposing a Client Secret.
 * Includes pure JS fallbacks for insecure contexts (HTTP IP addresses).
 * Safe localStorage wrappers to prevent security exceptions on some domains.
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
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

function dec2hex(dec: number): string {
  return dec.toString(16).padStart(2, "0");
}

// Safe localStorage access wrappers
function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn("Storage access failed for key:", key, err);
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn("Storage write failed for key:", key, err);
  }
}

function safeRemoveItem(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Storage delete failed for key:", key, err);
  }
}

// Fallback pure JS SHA-256 implementation for insecure HTTP contexts
function sha256Fallback(ascii: string): ArrayBuffer {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const words: number[] = [];
  const asciiLength = ascii.length;
  for (let i = 0; i < asciiLength; i++) {
    const wordIndex = i >> 2;
    if (words[wordIndex] === undefined) {
      words[wordIndex] = 0;
    }
    words[wordIndex] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }

  const bitLength = asciiLength * 8;
  const bitLengthWordIndex = bitLength >> 5;
  if (words[bitLengthWordIndex] === undefined) {
    words[bitLengthWordIndex] = 0;
  }
  words[bitLengthWordIndex] |= 0x80 << (24 - (bitLength % 32));
  
  const wordCount = ((bitLength + 64 + 9) >> 9 << 4) + 15;
  words[wordCount] = bitLength;

  for (let i = 0; i < words.length; i += 16) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j] || 0;
    }
    for (let j = 16; j < 64; j++) {
      const s0: number = ((w[j - 15] >>> 7) | (w[j - 15] << 25)) ^
                         ((w[j - 15] >>> 18) | (w[j - 15] << 14)) ^
                         (w[j - 15] >>> 3);
      const s1: number = ((w[j - 2] >>> 17) | (w[j - 2] << 15)) ^
                         ((w[j - 2] >>> 19) | (w[j - 2] << 13)) ^
                         (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }

    let [a, b, c, d, e, f, g, h] = H;

    for (let j = 0; j < 64; j++) {
      const S1 = ((e >>> 6) | (e << 26)) ^
                 ((e >>> 11) | (e << 21)) ^
                 ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^
                 ((a >>> 13) | (a << 19)) ^
                 ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  const buffer = new ArrayBuffer(32);
  const view = new DataView(buffer);
  for (let i = 0; i < 8; i++) {
    view.setUint32(i * 4, H[i]);
  }
  return buffer;
}

function generateCodeVerifier(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
  } else {
    // Pure JS fallback code verifier for older browsers or insecure environments
    let verifier = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    for (let i = 0; i < 64; i++) {
      verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return verifier;
  }
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
  let hashed: ArrayBuffer;
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    hashed = await window.crypto.subtle.digest("SHA-256", data);
  } else {
    // Fallback to pure JS SHA-256 when browser subtle crypto is disabled (insecure HTTP context)
    hashed = sha256Fallback(verifier);
  }
  return base64urlencode(hashed);
}

export async function redirectToSpotifyAuth(clientId: string) {
  if (!clientId) return;
  const verifier = generateCodeVerifier();
  safeSetItem(STORAGE_VERIFIER_KEY, verifier);

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
  const verifier = safeGetItem(STORAGE_VERIFIER_KEY);
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
    safeRemoveItem(STORAGE_VERIFIER_KEY);
    return data.access_token;
  } catch (err) {
    console.error("Spotify token exchange request failed:", err);
    return null;
  }
}

export async function refreshSpotifyToken(clientId: string): Promise<string | null> {
  const refreshToken = safeGetItem(STORAGE_REFRESH_KEY);
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
  const token = safeGetItem(STORAGE_TOKEN_KEY);
  const expiresAt = safeGetItem(STORAGE_EXPIRES_KEY);

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
  safeSetItem(STORAGE_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    safeSetItem(STORAGE_REFRESH_KEY, data.refresh_token);
  }
  const expiresAt = Date.now() + data.expires_in * 1000;
  safeSetItem(STORAGE_EXPIRES_KEY, expiresAt.toString());
}

export function clearTokens() {
  safeRemoveItem(STORAGE_TOKEN_KEY);
  safeRemoveItem(STORAGE_REFRESH_KEY);
  safeRemoveItem(STORAGE_EXPIRES_KEY);
  safeRemoveItem(STORAGE_VERIFIER_KEY);
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
