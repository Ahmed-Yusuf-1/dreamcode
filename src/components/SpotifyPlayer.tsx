"use client";

import { useEffect, useRef, useState } from "react";
import {
  redirectToSpotifyAuth,
  exchangeCodeForToken,
  getValidToken,
  clearTokens,
  cleanUrlParams,
} from "../lib/spotifyAuth";

/**
 * Spotify in the nav bar.
 * Full integration: once connected, we load the Spotify Web Playback SDK
 * and stream music directly in the browser. Fallbacks to standard iframe
 * embeds for Free accounts or if SDK playback fails.
 */

const PLAYLIST_ID = "37i9dQZF1DWWQRwui0ExPn"; // Lo-Fi Beats
const EMBED_SRC = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const STORAGE_KEY = "dc_spotify_connected";
const STORAGE_STYLE_KEY = "dc_spotify_btn_style";
const STORAGE_CLIENT_KEY = "dc_spotify_client_id";
const STORAGE_FALLBACK_KEY = "dc_spotify_use_embed";

const BUTTON_STYLES = [
  { id: "dreamcode-wood", name: "Dreamcode Wood" },
  { id: "theme-default", name: "Glassy Lavender" },
  { id: "neon-cyan", name: "Neon Cyan" },
  { id: "floating-cloud", name: "Floating Cloud" },
  { id: "cloud-shaped", name: "Cloud Shape" },
];

const FOCUS_PLAYLISTS = [
  { id: "37i9dQZF1DWWQRwui0ExPn", name: "Lo-Fi Focus", desc: "Cozy chill beats", emoji: "☕" },
  { id: "37i9dQZF1DX8g3mdzCltJ2", name: "Synthwave", desc: "Retro coding drive", emoji: "🌌" },
  { id: "37i9dQZF1DWZeKzxeI6n4M", name: "Deep Focus", desc: "Ambient sounds", emoji: "🧘" },
  { id: "37i9dQZF1DWWEJl22ojwCE", name: "Classical", desc: "Orchestral keys", emoji: "🎹" },
  { id: "37i9dQZF1DWV7a1510g7XG", name: "Chill Jazz", desc: "Soothing brass", emoji: "🎷" },
];

function SpotifyMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="transition-colors duration-200">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        d="M6.4 10.2c3.3-1 7.1-.8 9.9.9M7 12.9c2.7-.8 5.7-.6 8 .8M7.6 15.4c2.1-.6 4.4-.5 6.2.6"
        stroke="#0e2247"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Equalizer() {
  return (
    <span className="flex items-end" style={{ gap: 2, height: 14 }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: "currentColor",
            transformOrigin: "bottom",
            animation: `eqbar ${0.7 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function getCloudSvgDataUri(color: string) {
  const cleanColor = color.startsWith("#") ? color : `#${color}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" fill="${cleanColor}"><path d="M20,34 C13,34 8,29 8,22 C8,15 15,11 22,13 C27,6 42,3 52,9 C62,3 82,4 89,11 C96,9 106,14 106,22 C106,28 101,34 94,34 Z"/></svg>`;

  let base64 = "";
  if (typeof window !== "undefined") {
    base64 = window.btoa(svg);
  } else {
    base64 = Buffer.from(svg).toString("base64");
  }
  return `url("data:image/svg+xml;base64,${base64}")`;
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (data: never) => void) => void;
  removeListener: (event: string, callback?: (data: never) => void) => void;
  getCurrentState: () => Promise<unknown>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  volume_percent: number;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images?: { url: string }[];
  tracks?: { total: number };
  owner?: { display_name: string };
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: { url: string }[];
  };
}

interface SpotifyPlayerState {
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat_mode: number;
  track_window: {
    current_track: SpotifyTrack;
  };
}

interface CustomStyle extends React.CSSProperties {
  "--glow-color"?: string;
  "--thumb-image"?: string;
  "--track-background"?: string;
}

declare global {
  interface Window {
    Spotify?: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayerInstance;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export default function SpotifyPlayer() {
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [styleIndex, setStyleIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Spotify SDK Integration states
  const [clientId, setClientId] = useState("");
  const [clientIdInput, setClientIdInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [useEmbedFallback, setUseEmbedFallback] = useState(false);
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    name: string;
    artists: string;
    image: string;
  } | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [sdkError, setSdkError] = useState<string | null>(null);

  // Extra Rich Features states
  const [activePlaylistId, setActivePlaylistId] = useState("37i9dQZF1DWWQRwui0ExPn");
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "context" | "track">("off");
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [playlistTab, setPlaylistTab] = useState<"vibes" | "my-playlists">("my-playlists");
  const [myPlaylists, setMyPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [playlistsError, setPlaylistsError] = useState<string | null>(null);
  const [showLowerSection, setShowLowerSection] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Read saved configurations on client mount
  useEffect(() => {
    try {
      const storedClientId = localStorage.getItem(STORAGE_CLIENT_KEY) || "";
      const savedStyle = localStorage.getItem(STORAGE_STYLE_KEY);
      const savedFallback = localStorage.getItem(STORAGE_FALLBACK_KEY);
      const savedPlaylist = localStorage.getItem("dc_spotify_active_playlist");
      const isConnected = localStorage.getItem(STORAGE_KEY) === "1";

      setTimeout(() => {
        setClientId(storedClientId);
        setClientIdInput(storedClientId);
        if (isConnected) {
          setConnected(true);
        }
        if (savedStyle) {
          const idx = BUTTON_STYLES.findIndex((s) => s.id === savedStyle);
          if (idx !== -1) setStyleIndex(idx);
        }
        if (savedFallback) {
          setUseEmbedFallback(savedFallback === "1");
        }
        if (savedPlaylist) {
          setActivePlaylistId(savedPlaylist);
        }
        if (!storedClientId) {
          setShowSettings(true);
        }
      }, 0);
    } catch { }
  }, []);

  // Handle OAuth code callback in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code) {
      const storedClientId = localStorage.getItem(STORAGE_CLIENT_KEY) || "";
      if (storedClientId) {
        exchangeCodeForToken(storedClientId, code).then((token) => {
          if (token) {
            setConnected(true);
            setOpen(true); // Open settings to show they connected
          }
          cleanUrlParams();
        });
      }
    }
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!connected || !clientId || useEmbedFallback || !isPremium) {
      if (player) {
        player.disconnect();
        setTimeout(() => {
          setPlayer(null);
        }, 0);
      }
      return;
    }

    let activePlayer: SpotifyPlayerInstance | null = null;

    const setupSDK = async () => {
      try {
        // 1. Load SDK Script
        await new Promise<void>((resolve, reject) => {
          if (typeof window !== "undefined" && !(window as Window & { isSecureContext?: boolean }).isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            reject(new Error("Spotify SDK cannot run on insecure HTTP domains/IPs."));
            return;
          }

          if (window.Spotify) {
            resolve();
            return;
          }
          const scriptId = "spotify-player-sdk";
          let script = document.getElementById(scriptId) as HTMLScriptElement;
          if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
          }
          (window as Window & { onSpotifyWebPlaybackSDKReady?: () => void }).onSpotifyWebPlaybackSDKReady = () => {
            resolve();
          };
        });

        // 2. Initialise Player
        const token = await getValidToken(clientId);
        if (!token) {
          setConnected(false);
          clearTokens();
          return;
        }

        const p = new window.Spotify!.Player({
          name: "Dreamcode Player",
          getOAuthToken: (cb: (t: string) => void) => {
            getValidToken(clientId).then((t) => cb(t || ""));
          },
          volume: volume,
        });

        // Error handling
        p.addListener("initialization_error", ({ message }: { message: string }) => {
          console.error("Spotify Initialization Error:", message);
          setSdkError("Failed to initialize player.");
          setUseEmbedFallback(true);
        });
        p.addListener("authentication_error", ({ message }: { message: string }) => {
          console.error("Spotify Authentication Error:", message);
          setConnected(false);
          clearTokens();
        });
        p.addListener("account_error", ({ message }: { message: string }) => {
          console.warn("Spotify Account Error (Non-Premium?):", message);
          setIsPremium(false); // Triggers visual fallback
        });

        // Playback status listeners
        p.addListener("playback_error", ({ message }: { message: string }) => {
          console.error("Spotify Playback Error:", message);
        });

        p.addListener("player_state_changed", (state: SpotifyPlayerState | null) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          setProgressMs(state.position || 0);
          setDurationMs(state.duration || 0);
          setShuffle(state.shuffle || false);
          setRepeatMode(state.repeat_mode === 0 ? "off" : state.repeat_mode === 1 ? "context" : "track");

          const track = state.track_window?.current_track;
          if (track) {
            setCurrentTrack({
              name: track.name,
              artists: track.artists.map((a: SpotifyArtist) => a.name).join(", "),
              image: track.album.images[0]?.url || "",
            });
          }
        });

        p.addListener("ready", ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          setSdkError(null);

          // Auto-transfer playback to Dreamcode Player but do NOT autoplay
          getValidToken(clientId).then((tok) => {
            if (tok) {
              fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${tok}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  device_ids: [device_id],
                  play: false,
                }),
              }).catch(console.error);
            }
          });
        });

        p.addListener("not_ready", ({ device_id }: { device_id: string }) => {
          console.log("Dreamcode Player went offline:", device_id);
          setDeviceId(null);
        });

        p.connect();
        activePlayer = p;
        setPlayer(p);
      } catch (err) {
        console.warn("Spotify SDK failed to setup, falling back to Embed player:", err);
        setSdkError("Web Player disabled on insecure local IP.");
        setUseEmbedFallback(true);
      }
    };

    setupSDK();

    return () => {
      if (activePlayer) {
        activePlayer.disconnect();
      }
    };
  }, [connected, clientId, useEmbedFallback, isPremium]);

  // Close the panel when clicking outside it
  useEffect(() => {
    if (!open || isPinned) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, isPinned]);

  // Auto-fetch user playlists when connected, open, and tab is "my-playlists"
  useEffect(() => {
    if (connected && open && playlistTab === "my-playlists" && myPlaylists.length === 0) {
      fetchMyPlaylists();
    }
  }, [connected, open, playlistTab, myPlaylists.length]);

  // Tick track progress locally while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressMs((prev) => {
        if (prev + 1000 >= durationMs) {
          return durationMs;
        }
        return prev + 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, durationMs]);

  // Periodically fetch active devices when the panel is open
  useEffect(() => {
    if (!open || !connected || !clientId || useEmbedFallback || !isPremium) return;
    fetchDevices();
    const interval = setInterval(fetchDevices, 8000);
    return () => clearInterval(interval);
  }, [open, connected, clientId, useEmbedFallback, isPremium]);

  async function fetchDevices() {
    const tok = await getValidToken(clientId);
    if (!tok) return;
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  }

  const transferDevice = async (targetDeviceId: string) => {
    const tok = await getValidToken(clientId);
    if (!tok) return;
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tok}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [targetDeviceId],
          play: true,
        }),
      });
      if (res.ok) {
        setDeviceId(targetDeviceId);
        setTimeout(fetchDevices, 800);
      }
    } catch (err) {
      console.error("Failed to transfer device:", err);
    }
  };

  const toggleShuffle = async () => {
    const nextShuffle = !shuffle;
    setShuffle(nextShuffle);
    const tok = await getValidToken(clientId);
    if (!tok) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${nextShuffle}${deviceId ? `&device_id=${deviceId}` : ""}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tok}` },
      });
    } catch (err) {
      console.error("Failed to shuffle:", err);
    }
  };

  const toggleRepeat = async () => {
    const modes: ("off" | "context" | "track")[] = ["off", "context", "track"];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setRepeatMode(nextMode);
    const tok = await getValidToken(clientId);
    if (!tok) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}${deviceId ? `&device_id=${deviceId}` : ""}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tok}` },
      });
    } catch (err) {
      console.error("Failed to repeat:", err);
    }
  };

  const playPlaylist = async (playlistId: string) => {
    setActivePlaylistId(playlistId);
    try {
      localStorage.setItem("dc_spotify_active_playlist", playlistId);
    } catch { }

    if (useEmbedFallback || !isPremium) return;

    const tok = await getValidToken(clientId);
    if (!tok) return;
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ""}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tok}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn("Failed to play playlist via direct API, status:", res.status, errText);

        // Self-healing: if device is asleep or not active, transfer and force play
        if (deviceId) {
          console.log("Attempting device reactivation transfer...");
          const transferRes = await fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${tok}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              device_ids: [deviceId],
              play: true,
            }),
          });

          if (transferRes.ok) {
            // Wait a brief moment and retry the play playlist call
            setTimeout(async () => {
              await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${tok}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  context_uri: `spotify:playlist:${playlistId}`,
                }),
              }).catch(console.error);
            }, 600);
          }
        }
      }
    } catch (err) {
      console.error("Failed to play playlist:", err);
    }
  };

  async function fetchMyPlaylists() {
    const tok = await getValidToken(clientId);
    if (!tok) return;
    setLoadingPlaylists(true);
    setPlaylistsError(null);
    try {
      const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=25", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyPlaylists(data.items || []);
      } else {
        const err = await res.json().catch(() => null);
        setPlaylistsError(err?.error?.message || "Failed to load playlists.");
      }
    } catch (err) {
      console.error("Failed to fetch user playlists:", err);
      setPlaylistsError("Failed to fetch playlists.");
    } finally {
      setLoadingPlaylists(false);
    }
  }

  const handleTabChange = (tab: "vibes" | "my-playlists") => {
    setPlaylistTab(tab);
    if (tab === "my-playlists" && myPlaylists.length === 0) {
      fetchMyPlaylists();
    }
  };

  const handleSeek = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPos = parseInt(e.target.value, 10);
    setProgressMs(newPos);
    if (player) {
      player.seek(newPos).catch(console.error);
    } else {
      const tok = await getValidToken(clientId);
      if (!tok) return;
      fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${newPos}${deviceId ? `&device_id=${deviceId}` : ""}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tok}` },
      }).catch(console.error);
    }
  };

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const connect = () => {
    if (!clientId) {
      setOpen(true);
      setShowSettings(true);
      return;
    }
    redirectToSpotifyAuth(clientId);
  };

  const disconnect = () => {
    setConnected(false);
    setDeviceId(null);
    setIsPlaying(false);
    setCurrentTrack(null);
    clearTokens();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { }
  };

  const saveSettings = () => {
    const trimmed = clientIdInput.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(STORAGE_CLIENT_KEY, trimmed);
    } catch { }
    setClientId(trimmed);
    setShowSettings(false);
    redirectToSpotifyAuth(trimmed);
  };

  const changeStyle = (idx: number) => {
    setStyleIndex(idx);
    try {
      localStorage.setItem(STORAGE_STYLE_KEY, BUTTON_STYLES[idx].id);
    } catch { }
  };

  const toggleFallback = () => {
    const nextVal = !useEmbedFallback;
    setUseEmbedFallback(nextVal);
    try {
      localStorage.setItem(STORAGE_FALLBACK_KEY, nextVal ? "1" : "0");
    } catch { }
  };

  const changeVolume = (newVol: number) => {
    setVolume(newVol);
    if (player) {
      player.setVolume(newVol).catch(console.error);
    }
  };

  const togglePlay = () => {
    if (player) {
      if (!currentTrack) {
        playPlaylist(activePlaylistId);
      } else {
        player.togglePlay().catch(console.error);
      }
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack().catch(console.error);
    }
  };

  const prevTrack = () => {
    if (player) {
      player.previousTrack().catch(console.error);
    }
  };

  // Render SVG icons for player controls
  const playIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const pauseIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  const prevIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );

  const nextIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
    </svg>
  );

  const volumeIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );

  const shuffleIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
  );

  const repeatIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
  );

  const deviceIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <circle cx="12" cy="14" r="4"></circle>
      <line x1="12" y1="6" x2="12.01" y2="6"></line>
    </svg>
  );

  const pinIcon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.47A2 2 0 0 1 15 9.3V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.3a2 2 0 0 1-.78 1.23l-2.78 3.5A2 2 0 0 0 5 15.24z"></path>
    </svg>
  );

  const getThemeStyles = () => {
    switch (styleIndex) {
      case 0: // Dreamcode Wood
        return {
          panelBg: "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0px, rgba(255, 255, 255, 0.01) 1px, transparent 1px, transparent 12px), linear-gradient(135deg, #2e1a10 0%, #1e1008 100%)",
          panelBorder: "1px solid #4a2d1b",
          glowColor: "rgba(232, 168, 56, 0.25)",
          textAccent: "#ffd275",
          sliderActiveBg: "#ffd275",
          buttonHoverBg: "rgba(232, 168, 56, 0.15)",
          shadow: "0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          accentClass: "text-[#ffd275] drop-shadow-[0_0_6px_rgba(255,210,117,0.5)]",
          textColor: "text-[#fff4e0]",
          mutedTextColor: "text-[#bda89b]",
          itemBg: "rgba(0, 0, 0, 0.25)",
          itemBorder: "rgba(74, 45, 27, 0.6)",
          accentBorder: "rgba(232, 168, 56, 0.5)",
          isDark: true,
        };
      case 2: // Neon Cyan
        return {
          panelBg: "rgba(6, 15, 30, 0.96)",
          panelBorder: "1px solid rgba(0, 243, 255, 0.4)",
          glowColor: "rgba(0, 243, 255, 0.3)",
          textAccent: "#00f3ff",
          sliderActiveBg: "#00f3ff",
          buttonHoverBg: "rgba(0, 243, 255, 0.15)",
          shadow: "0 0 35px rgba(0, 243, 255, 0.25), 0 28px 60px rgba(0, 0, 0, 0.8)",
          accentClass: "text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.7)]",
          textColor: "text-white",
          mutedTextColor: "text-white/60",
          itemBg: "rgba(255, 255, 255, 0.05)",
          itemBorder: "rgba(255, 255, 255, 0.1)",
          accentBorder: "rgba(0, 243, 255, 0.5)",
          isDark: true,
        };
      case 3: // Floating Cloud (Sunset)
        return {
          panelBg: "rgba(35, 20, 50, 0.96)",
          panelBorder: "1px solid rgba(255, 182, 217, 0.35)",
          glowColor: "rgba(255, 182, 217, 0.2)",
          textAccent: "#ffb6d9",
          sliderActiveBg: "#ffb6d9",
          buttonHoverBg: "rgba(255, 182, 217, 0.15)",
          shadow: "0 0 35px rgba(255, 182, 217, 0.15), 0 28px 60px rgba(15, 5, 25, 0.7)",
          accentClass: "text-[#ffb6d9] drop-shadow-[0_0_6px_rgba(255,182,217,0.5)]",
          textColor: "text-white",
          mutedTextColor: "text-white/60",
          itemBg: "rgba(255, 255, 255, 0.05)",
          itemBorder: "rgba(255, 255, 255, 0.1)",
          accentBorder: "rgba(255, 182, 217, 0.5)",
          isDark: true,
        };
      case 4: // Cloud Shaped (Light Blue Cloud theme)
        return {
          panelBg: "rgba(242, 247, 255, 0.97)",
          panelBorder: "1px solid rgba(150, 220, 255, 0.6)",
          glowColor: "rgba(150, 220, 255, 0.3)",
          textAccent: "#3b82f6",
          sliderActiveBg: "#3b82f6",
          buttonHoverBg: "rgba(59, 130, 246, 0.12)",
          shadow: "0 10px 40px rgba(150, 220, 255, 0.35), 0 20px 50px rgba(0, 0, 0, 0.15)",
          accentClass: "text-[#1d4ed8] font-black",
          textColor: "text-[#0e2247]",
          mutedTextColor: "text-[#0e2247]/65",
          itemBg: "rgba(255, 255, 255, 0.75)",
          itemBorder: "rgba(150, 220, 255, 0.4)",
          accentBorder: "rgba(29, 78, 216, 0.5)",
          isDark: false,
        };
      default: // Glassy Lavender (Theme 1)
        return {
          panelBg: "rgba(20, 17, 60, 0.96)",
          panelBorder: "1px solid rgba(150, 245, 255, 0.28)",
          glowColor: "rgba(150, 245, 255, 0.15)",
          textAccent: "#96f5ff",
          sliderActiveBg: "#c7b8ff",
          buttonHoverBg: "rgba(199, 184, 255, 0.15)",
          shadow: "0 0 35px rgba(150, 245, 255, 0.15), 0 28px 60px rgba(8, 6, 30, 0.6)",
          accentClass: "text-[#96f5ff] drop-shadow-[0_0_6px_rgba(150,245,255,0.4)]",
          textColor: "text-white",
          mutedTextColor: "text-white/60",
          itemBg: "rgba(255, 255, 255, 0.05)",
          itemBorder: "rgba(255, 255, 255, 0.1)",
          accentBorder: "rgba(150, 245, 255, 0.4)",
          isDark: true,
        };
    }
  };

  const theme = getThemeStyles();

  const buttonText = currentTrack?.name ? currentTrack.name : "Focus sounds";
  const buttonTextTheme4 = currentTrack?.name ? currentTrack.name : "Focus";

  return (
    <div ref={wrapRef} className="flex items-center" style={{ gap: 6 }}>
      {!connected ? (
        // Unconnected Button layout with settings access
        <div className="flex items-center" style={{ gap: 6 }}>
          {styleIndex === 0 ? (
            <button
              type="button"
              onClick={connect}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#ba7318]/60 bg-[#24140c]/70 text-[#ffd275] px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ba7318]/20 hover:text-white hover:border-[#ffd275]"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)",
                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              }}
            >
              <SpotifyMark />
              <span className="hidden sm:inline">Connect Spotify</span>
              <span className="sm:hidden">Spotify</span>
            </button>
          ) : styleIndex === 2 ? (
            <button
              type="button"
              onClick={connect}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/60 bg-[#0e2247]/50 text-cyan-glow px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-glow/20 hover:text-white hover:border-cyan-glow/90"
              style={{
                boxShadow: "0 0 16px rgba(150,245,255,0.45), inset 0 0 8px rgba(150,245,255,0.2)",
                textShadow: "0 0 8px rgba(150,245,255,0.7)",
              }}
            >
              <SpotifyMark />
              <span className="hidden sm:inline">Connect Spotify</span>
              <span className="sm:hidden">Spotify</span>
            </button>
          ) : styleIndex === 3 ? (
            <button
              type="button"
              onClick={connect}
              className="anim-floaty-sm flex cursor-pointer items-center gap-2 rounded-full border border-blush/40 bg-white/8 text-blush px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap shadow-[0_0_14px_rgba(255,182,217,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blush/20 hover:text-white hover:border-blush/60 hover:shadow-[0_0_20px_rgba(255,182,217,0.45)]"
            >
              <SpotifyMark />
              <span className="hidden sm:inline">Connect Spotify</span>
              <span className="sm:hidden">Spotify</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
                alt=""
                className="w-5 h-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ) : styleIndex === 4 ? (
            <button
              type="button"
              onClick={connect}
              className="relative flex cursor-pointer items-center justify-center text-[13px] font-black whitespace-nowrap text-[#0e2247] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{ width: 145, height: 42 }}
            >
              <svg
                viewBox="0 0 120 40"
                className="absolute inset-0 w-full h-full filter drop-shadow(0 2px 5px rgba(205,185,247,0.35)) transition-all hover:drop-shadow(0 4px 9px rgba(150,245,255,0.55))"
              >
                <path
                  d="M20,34 C13,34 8,29 8,22 C8,15 15,11 22,13 C27,6 42,3 52,9 C62,3 82,4 89,11 C96,9 106,14 106,22 C106,28 101,34 94,34 Z"
                  fill="#ffffff"
                  className="transition-colors hover:fill-[#ecfaff]"
                />
              </svg>
              <span className="relative z-10 flex items-center gap-1.5">
                <SpotifyMark size={14} />
                <span>Connect</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-lavender/40 bg-white/8 text-lavender px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap shadow-[0_0_14px_rgba(205,185,247,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-lavender/20 hover:text-white hover:border-lavender/60 hover:shadow-[0_0_20px_rgba(205,185,247,0.45)]"
            >
              <SpotifyMark />
              <span className="hidden sm:inline">Connect Spotify</span>
              <span className="sm:hidden">Spotify</span>
            </button>
          )}

          {clientId && (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setShowSettings(true);
              }}
              className="cursor-pointer p-2 rounded-full hover:bg-white/10 text-lavender/65 hover:text-white transition-colors"
              title="Spotify Settings"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          )}
        </div>
      ) : (
        // Connected State Button
        styleIndex === 0 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#ba7318]/70 bg-[#24140c]/80 text-[#ffd275] px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap transition-all duration-200 hover:bg-[#ba7318]/30 hover:text-white"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.15)",
              textShadow: "0 1px 2px rgba(0,0,0,0.85)",
            }}
          >
            <SpotifyMark />
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[260px] truncate">{buttonText}</span>
            {isPlaying && <Equalizer />}
          </button>
        ) : styleIndex === 2 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/70 bg-cyan-glow/20 text-white px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap transition-all duration-200 hover:bg-cyan-glow/30"
            style={{
              boxShadow: "0 0 16px rgba(150,245,255,0.55), inset 0 0 8px rgba(255,255,255,0.15)",
              textShadow: "0 0 8px rgba(255,255,255,0.85)",
            }}
          >
            <SpotifyMark />
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[260px] truncate">{buttonText}</span>
            {isPlaying && <Equalizer />}
          </button>
        ) : styleIndex === 3 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="anim-floaty-sm flex cursor-pointer items-center gap-2 rounded-full border border-blush/40 bg-blush/16 text-white px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap shadow-[0_0_14px_rgba(255,182,217,0.35)] transition-all duration-200 hover:bg-blush/25"
          >
            <SpotifyMark />
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[260px] truncate">{buttonText}</span>
            {isPlaying && <Equalizer />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
              alt=""
              className="w-5 h-4 object-contain opacity-75"
            />
          </button>
        ) : styleIndex === 4 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative flex cursor-pointer items-center justify-center text-[13px] font-black whitespace-nowrap text-[#0e2247] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{
              minWidth: 100,
              width: currentTrack?.name ? "auto" : 145,
              height: 42,
              paddingLeft: currentTrack?.name ? 16 : 0,
              paddingRight: currentTrack?.name ? 16 : 0
            }}
          >
            <svg
              viewBox="0 0 120 40"
              className="absolute inset-0 w-full h-full filter drop-shadow(0 2px 5px rgba(150,245,255,0.4)) transition-all hover:drop-shadow(0 4px 9px rgba(150,245,255,0.6))"
            >
              <path
                d="M20,34 C13,34 8,29 8,22 C8,15 15,11 22,13 C27,6 42,3 52,9 C62,3 82,4 89,11 C96,9 106,14 106,22 C106,28 101,34 94,34 Z"
                fill="#96f5ff"
                className="transition-colors hover:fill-[#b4f8ff]"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-1.5 max-w-[180px] md:max-w-[260px]">
              <SpotifyMark size={14} />
              <span className="truncate">{buttonTextTheme4}</span>
              {isPlaying && <Equalizer />}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/45 bg-cyan-glow/10 text-cyan-glow px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap shadow-[0_0_12px_rgba(150,245,255,0.15)] transition-all duration-200 hover:bg-cyan-glow/20 hover:text-white hover:border-cyan-glow/70 hover:shadow-[0_0_18px_rgba(150,245,255,0.35)]"
          >
            <SpotifyMark />
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[260px] truncate">{buttonText}</span>
            {isPlaying && <Equalizer />}
          </button>
        )
      )}

      {/* The Player / Settings Popup Panel */}
      <div
        className="absolute text-left"
        style={{
          top: "calc(var(--nav-h, 64px) + 6px)",
          right: "clamp(16px, 4vw, 44px)",
          zIndex: 80,
          width: "min(344px, calc(100vw - 24px))",
          background: theme.panelBg,
          backdropFilter: "blur(20px)",
          border: theme.panelBorder,
          borderRadius: 20,
          padding: 8,
          boxShadow: theme.shadow,
          transition: "opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          transformOrigin: "top right",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {showSettings ? (
          // Spotify Credentials Settings Form
          <div className="flex flex-col gap-3">
            <div style={{ fontWeight: 900, fontSize: 13 }} className={theme.textColor}>
              Spotify Settings
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.45 }} className={theme.mutedTextColor}>
              Connect your Spotify account using a developer Client ID:
              <ol className="list-decimal pl-4 mt-2 flex flex-col gap-1">
                <li>Create a Developer App on the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline text-cyan-glow hover:text-white">Spotify Dashboard</a>.</li>
                <li>Set the **Redirect URI** to exactly: <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[10px] select-all">{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}</code> (Ensure no trailing slash).</li>
                <li>Paste your **Client ID** below:</li>
              </ol>
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              <input
                type="text"
                placeholder="Spotify Client ID"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[12px] font-mono outline-none transition-colors ${theme.textColor} focus:border-white/40`}
                style={{ borderColor: theme.textAccent + "33" }}
              />
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={saveSettings}
                  className="flex-1 cursor-pointer rounded-lg py-2 text-[12px] font-extrabold hover:bg-white/10 active:scale-95 transition-all text-center border"
                  style={{
                    borderColor: theme.textAccent + "66",
                    backgroundColor: theme.textAccent + "1c",
                    color: theme.isDark ? "#ffffff" : theme.textAccent,
                  }}
                >
                  Save & Connect
                </button>
                {clientId && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="cursor-pointer bg-white/5 border border-white/10 text-white/80 rounded-lg px-3 py-2 text-[12px] font-bold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Active Playback view
          <div>
            {!isPremium && (
              // Non-Premium user warning banner
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 mb-3 text-left">
                <div className="text-[11px] font-black text-red-400 uppercase tracking-wide">Spotify Premium Required</div>
                <div className={`text-[10px] leading-normal mt-0.5 ${theme.mutedTextColor}`}>
                  Your Spotify account does not support direct browser streaming. Falling back to the player preview.
                </div>
              </div>
            )}

            {/* Player Body */}
            {useEmbedFallback || !isPremium ? (
              // 1. Standard Spotify Iframe Embed
              <iframe
                title="Spotify focus playlist"
                src={`https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`}
                width="100%"
                height={180}
                frameBorder={0}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ borderRadius: 12, border: "none", display: "block" }}
              />
            ) : (
              <div className="flex flex-col items-center w-full transition-all duration-300">
                {/* Album Cover & Details (Overlaid) */}
                <div
                  className="w-80 h-80 rounded-2xl bg-white/5 overflow-hidden relative shadow-2xl transition-all duration-500 group"
                  style={{
                    boxShadow: styleIndex === 0
                      ? `0 10px 25px rgba(0,0,0,0.5), 0 0 ${isPlaying ? '18px' : '6px'} ${theme.glowColor}`
                      : `0 8px 20px rgba(0,0,0,0.3), 0 0 ${isPlaying ? '18px' : '6px'} ${theme.glowColor}`,
                    "--glow-color": theme.glowColor,
                  } as CustomStyle}
                >
                  {currentTrack?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentTrack.image} alt="Cover art" className="w-full h-full object-cover absolute inset-0 z-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/40 absolute inset-0 z-0">
                      {/* Elegant vector vinyl record placeholder */}
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-80" style={{ color: theme.textAccent }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" />
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
                      </svg>
                    </div>
                  )}

                  {/* Ambient darker vignette overlay on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-10 opacity-0 group-hover:opacity-95"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.85) 100%)",
                    }}
                  />

                  {/* Track Details Overlay at the top */}
                  <div
                    className="absolute top-0 left-0 right-0 flex flex-col items-start justify-start text-left pt-3 px-4 pb-8 z-20"
                    style={{
                      paddingRight: "40px", // leave space for right floating volume slider
                    }}
                  >
                    <div className="font-black text-[13px] text-white truncate max-w-full leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {currentTrack?.name || "Ready to Stream"}
                    </div>
                    <div className="text-[10px] font-bold text-white/70 truncate max-w-full mt-0.5 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {currentTrack?.artists || "Dreamcode Player active"}
                    </div>
                  </div>

                  {/* Playback Controls Overlay (with Shuffle and Repeat) */}
                  <div className="absolute bottom-11 left-0 right-0 flex items-center justify-center gap-4 z-20">
                    {/* Shuffle */}
                    <button
                      type="button"
                      onClick={toggleShuffle}
                      className={`cursor-pointer p-2 rounded-full transition-all hover:bg-white/15 active:scale-90 ${
                        shuffle ? "text-cyan-glow" : "opacity-60 text-white"
                      }`}
                      style={{
                        color: shuffle ? theme.textAccent : undefined,
                        backgroundColor: shuffle && styleIndex === 0 ? "rgba(255, 210, 117, 0.15)" : undefined,
                      }}
                      title="Shuffle"
                    >
                      {shuffleIcon}
                    </button>

                    {/* Prev */}
                    <button
                      type="button"
                      onClick={prevTrack}
                      className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white/90 hover:text-white"
                      title="Previous Track"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </button>

                    {/* Play/Pause */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md text-white"
                      style={{
                        background: styleIndex === 0
                          ? "radial-gradient(circle at 35% 35%, #ffd275 0%, #b88a38 70%, #8c601c 100%)"
                          : theme.textAccent,
                        color: styleIndex === 0 ? "#1e1008" : theme.isDark ? "#0d102b" : "#ffffff",
                        boxShadow: styleIndex === 0
                          ? "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3)"
                          : `0 2px 8px ${theme.glowColor}`,
                        border: styleIndex === 0 ? "1px solid #784c18" : "none",
                      }}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Next */}
                    <button
                      type="button"
                      onClick={nextTrack}
                      className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white/90 hover:text-white"
                      title="Next Track"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
                      </svg>
                    </button>

                    {/* Repeat */}
                    <button
                      type="button"
                      onClick={toggleRepeat}
                      className={`cursor-pointer p-2 rounded-full transition-all hover:bg-white/15 active:scale-90 relative ${
                        repeatMode !== "off" ? "text-cyan-glow" : "opacity-60 text-white"
                      }`}
                      style={{
                        color: repeatMode !== "off" ? theme.textAccent : undefined,
                        backgroundColor: repeatMode !== "off" && styleIndex === 0 ? "rgba(255, 210, 117, 0.15)" : undefined,
                      }}
                      title={`Repeat: ${repeatMode}`}
                    >
                      {repeatIcon}
                      {repeatMode === "track" && (
                        <span
                          className="absolute bottom-0 right-0 text-[7px] font-black rounded-full w-2.5 h-2.5 flex items-center justify-center scale-90"
                          style={{
                            backgroundColor: theme.textAccent,
                            color: styleIndex === 0 ? "#1e1008" : theme.isDark ? "#0d102b" : "#ffffff",
                          }}
                        >
                          1
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Seek Progress Slider */}
                  <div className="absolute bottom-2.5 left-4 right-4 z-20 flex flex-col gap-0.5">
                    <input
                      type="range"
                      min="0"
                      max={durationMs || 100}
                      value={progressMs}
                      onChange={handleSeek}
                      className={`w-full dreamcode-range seek-range ${styleIndex === 0 ? 'wood-range' : ''}`}
                      style={{
                        "--glow-color": theme.textAccent,
                        "--thumb-image": getCloudSvgDataUri(theme.textAccent),
                        "--track-background": `linear-gradient(to right, ${theme.textAccent} 0%, ${theme.textAccent} ${durationMs ? (progressMs / durationMs) * 100 : 0}%, ${styleIndex === 0 ? 'rgba(0,0,0,0.45)' : (theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(14,34,71,0.1)')} ${durationMs ? (progressMs / durationMs) * 100 : 0}%, ${styleIndex === 0 ? 'rgba(0,0,0,0.45)' : (theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(14,34,71,0.1)')} 100%)`,
                      } as CustomStyle}
                    />
                    <div className="flex justify-between text-[8.5px] font-mono px-0.5 text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold">
                      <span>{formatTime(progressMs)}</span>
                      <span>{formatTime(durationMs)}</span>
                    </div>
                  </div>

                  {/* Floating Vertical Volume Slider (Far Right) */}
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
                    <span className="text-white opacity-75 hover:opacity-100 transition-opacity drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" style={{ fontSize: 11 }}>
                      {volumeIcon}
                    </span>
                    <div style={{ height: 160, width: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className={`dreamcode-range ${styleIndex === 0 ? 'wood-range' : ''}`}
                        style={{
                          position: "absolute",
                          width: 150,
                          height: 12,
                          transform: "rotate(-90deg)",
                          transformOrigin: "center",
                          margin: 0,
                          padding: 0,
                          cursor: "pointer",
                          "--glow-color": theme.textAccent,
                          "--thumb-image": getCloudSvgDataUri(theme.textAccent),
                          "--track-background": `linear-gradient(to right, ${theme.textAccent} 0%, ${theme.textAccent} ${volume * 100}%, ${styleIndex === 0 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.35)'} ${volume * 100}%, ${styleIndex === 0 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.35)'} 100%)`,
                        } as CustomStyle}
                      />
                    </div>
                  </div>
                </div>

                {sdkError && (
                  <div className="text-red-400 text-[10px] font-bold mt-1.5 text-center w-full">{sdkError}</div>
                )}
              </div>
            )}

            {/* Expand / Collapse lower section toggle button */}
            <button
              type="button"
              onClick={() => setShowLowerSection(!showLowerSection)}
              className="w-full py-0.5 mt-1 flex items-center justify-center gap-1.5 text-[9.5px] font-black tracking-wider uppercase transition-all duration-200 hover:opacity-100 opacity-60 outline-none"
              style={{
                color: theme.textAccent,
                borderTop: `1px solid ${theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <span>{showLowerSection ? "Show Less ▲" : "Show More ▼"}</span>
            </button>

            {showLowerSection && (
              <div
                className="animate-player-slide mt-2 p-3 border rounded-xl"
                style={{
                  backgroundColor: theme.itemBg,
                  borderColor: theme.itemBorder,
                }}
              >
                {/* Playlists Tabs Section */}
                <div className="mt-0.5">
                  {/* Tabs Headers: My Playlists (1st), Focus Vibes (2nd) */}
                  <div className="flex gap-4 mb-2.5 border-b pb-1.5" style={{ borderColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                    <button
                      type="button"
                      onClick={() => handleTabChange("my-playlists")}
                      className={`cursor-pointer text-[10px] font-black tracking-wide uppercase outline-none transition-colors ${playlistTab === "my-playlists"
                        ? theme.accentClass
                        : `${theme.textColor} opacity-50 hover:opacity-85`
                        }`}
                    >
                      My Playlists
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlaylistTab("vibes")}
                      className={`cursor-pointer text-[10px] font-black tracking-wide uppercase outline-none transition-colors ${playlistTab === "vibes"
                        ? theme.accentClass
                        : `${theme.textColor} opacity-50 hover:opacity-85`
                        }`}
                    >
                      Focus Vibes
                    </button>
                  </div>

                  {/* Tab content */}
                  {playlistTab === "my-playlists" ? (
                    // My Playlists View
                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
                      {loadingPlaylists ? (
                        <div className={`text-[10px] text-center py-4 ${theme.textColor}`} style={{ opacity: 0.7 }}>
                          <span className="inline-block animate-spin mr-1.5">🌀</span> Loading playlists...
                        </div>
                      ) : playlistsError ? (
                        <div className="text-red-400 text-[10px] text-center py-3">
                          {playlistsError}
                          <button
                            type="button"
                            onClick={fetchMyPlaylists}
                            className="block mx-auto mt-1 underline font-bold text-cyan-glow"
                          >
                            Retry
                          </button>
                        </div>
                      ) : myPlaylists.length === 0 ? (
                        <div className={`text-[10px] text-center py-4 ${theme.textColor}`} style={{ opacity: 0.5 }}>
                          No playlists found. Create one on Spotify!
                        </div>
                      ) : (
                        myPlaylists.map((pl) => {
                          const isActive = activePlaylistId === pl.id;
                          const coverImg = pl.images?.[0]?.url || "";
                          return (
                            <button
                              key={pl.id}
                              type="button"
                              onClick={() => playPlaylist(pl.id)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all border outline-none"
                              style={{
                                borderColor: isActive ? theme.accentBorder : "transparent",
                                backgroundColor: isActive
                                  ? theme.isDark
                                    ? "rgba(150, 245, 255, 0.12)"
                                    : "rgba(59, 130, 246, 0.12)"
                                  : theme.itemBg,
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {coverImg ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={coverImg} alt="" className="w-6 h-6 rounded object-cover border border-white/10" />
                                ) : (
                                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px]">
                                    🎵
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className={`text-[11px] font-extrabold truncate leading-tight ${theme.textColor}`}>
                                    {pl.name}
                                  </div>
                                  <div className={`text-[9.5px] opacity-65 truncate leading-tight ${theme.textColor}`}>
                                    {pl.tracks?.total || 0} songs • by {pl.owner?.display_name || "Spotify"}
                                  </div>
                                </div>
                              </div>
                              {isActive && isPlaying && (
                                <span className="flex h-1.5 w-1.5 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    // Focus Vibes View
                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
                      {FOCUS_PLAYLISTS.map((pl) => {
                        const isActive = activePlaylistId === pl.id;
                        return (
                          <button
                            key={pl.id}
                            type="button"
                            onClick={() => playPlaylist(pl.id)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all border outline-none"
                            style={{
                              borderColor: isActive ? theme.accentBorder : "transparent",
                              backgroundColor: isActive
                                ? theme.isDark
                                  ? "rgba(150, 245, 255, 0.12)"
                                  : "rgba(59, 130, 246, 0.12)"
                                : theme.itemBg,
                            }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[13px]">{pl.emoji}</span>
                              <div className="min-w-0">
                                <div className={`text-[11px] font-extrabold truncate leading-tight ${theme.textColor}`}>
                                  {pl.name}
                                </div>
                                <div className={`text-[9px] opacity-65 truncate leading-tight ${theme.textColor}`}>
                                  {pl.desc}
                                </div>
                              </div>
                            </div>
                            {isActive && isPlaying && (
                              <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pin Toggle Section */}
                <div
                  className="mt-3.5 pt-3"
                  style={{
                    borderTop: `1px solid ${theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between text-[10.5px] font-extrabold">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={isPinned ? theme.accentClass : "opacity-60 text-white"}>
                        {pinIcon}
                      </span>
                      <span className={`${theme.textColor} opacity-80`}>Pin Player Window</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPinned(!isPinned)}
                      className={`cursor-pointer px-2.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider transition-all border outline-none ${
                        isPinned
                          ? "bg-cyan-glow/20 border-cyan-glow text-white"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                      }`}
                      style={{
                        borderColor: isPinned ? theme.accentBorder : undefined,
                        color: isPinned ? (theme.isDark ? "#ffffff" : theme.textAccent) : undefined,
                        backgroundColor: isPinned ? (theme.isDark ? "rgba(150, 245, 255, 0.15)" : "rgba(59, 130, 246, 0.15)") : undefined,
                      }}
                    >
                      {isPinned ? "Pinned" : "Pin"}
                    </button>
                  </div>
                </div>

                {/* Devices Section (Only for Premium / SDK mode) */}
                {isPremium && !useEmbedFallback && (
                  <div
                    className="mt-3.5 pt-3"
                    style={{
                      borderTop: `1px solid ${theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowDeviceList(!showDeviceList)}
                      className={`w-full flex items-center justify-between text-[10.5px] font-extrabold outline-none ${theme.textColor} opacity-80 hover:opacity-100 transition-opacity`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={theme.textColor}>{deviceIcon}</span>
                        <span className="truncate">
                          Output: {devices.find((d) => d.is_active)?.name || (deviceId ? "Dreamcode Player" : "None")}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-wider text-cyan-glow">
                        {showDeviceList ? "Hide" : "Devices"}
                      </span>
                    </button>

                    {showDeviceList && (
                      <div className="mt-2 flex flex-col gap-1 max-h-24 overflow-y-auto pr-0.5 custom-scrollbar">
                        {devices.length === 0 ? (
                          <div className={`text-[9.5px] text-center py-2 ${theme.textColor}`} style={{ opacity: 0.5 }}>
                            No active Spotify players detected.
                          </div>
                        ) : (
                          devices.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => transferDevice(d.id)}
                              className="w-full text-left px-2 py-1 rounded text-[10px] flex items-center justify-between transition-all border border-transparent outline-none"
                              style={{
                                backgroundColor: d.is_active
                                  ? theme.isDark
                                    ? "rgba(150, 245, 255, 0.15)"
                                    : "rgba(59, 130, 246, 0.15)"
                                  : theme.itemBg,
                                borderColor: d.is_active ? theme.accentBorder : "transparent",
                              }}
                            >
                              <span className={`truncate font-extrabold ${theme.textColor}`}>{d.name}</span>
                              <span className={`text-[8.5px] capitalize font-medium ${theme.textColor}`} style={{ opacity: 0.6 }}>{d.type}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Spotify Theme Selector */}
                <div
                  className="mt-3 pt-2.5"
                  style={{
                    borderTop: `1px solid ${theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-[10.5px] font-black tracking-wide uppercase opacity-85 ${theme.textColor}`}>
                      Spotify Theme
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px]">
                      <button
                        type="button"
                        onClick={() => setShowSettings(true)}
                        className={`cursor-pointer hover:underline transition-colors font-bold ${theme.isDark ? 'text-white/50 hover:text-white' : 'text-slate-700/60 hover:text-slate-900'}`}
                      >
                        Configure
                      </button>
                      <span className="opacity-15 text-white/50">|</span>
                      <button
                        type="button"
                        onClick={disconnect}
                        className="cursor-pointer transition-colors hover:underline font-bold text-red-500/80 hover:text-red-500"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 transition-all">
                    {BUTTON_STYLES.map((style, idx) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => changeStyle(idx)}
                        className="cursor-pointer text-left px-2.5 py-1.5 rounded-md text-[10.5px] font-bold transition-all border outline-none"
                        style={{
                          backgroundColor: styleIndex === idx
                            ? theme.isDark
                              ? "rgba(150, 245, 255, 0.15)"
                              : "rgba(59, 130, 246, 0.15)"
                            : theme.itemBg,
                          borderColor: styleIndex === idx ? theme.accentBorder : "transparent",
                          color: styleIndex === idx
                            ? (theme.isDark ? "#ffffff" : theme.textAccent)
                            : (theme.isDark ? "rgba(255,255,255,0.7)" : "rgba(14,34,71,0.7)"),
                        }}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline styles for custom range sliders, breathing animations and slide transitions */}
      <style>{`
            @keyframes playerSlideIn {
              from {
                opacity: 0;
                transform: translateY(12px) scale(0.97);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes breath {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 0px var(--glow-color, rgba(255,255,255,0));
              }
              50% {
                transform: scale(1.03);
                box-shadow: 0 12px 35px rgba(0,0,0,0.6), 0 0 18px var(--glow-color, rgba(255,255,255,0.25));
              }
            }
            .album-breath {
              animation: breath 4.2s ease-in-out infinite;
            }
            .dreamcode-range {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              cursor: pointer;
              outline: none;
              height: 16px;
              display: flex;
              align-items: center;
            }
            .dreamcode-range::-webkit-slider-runnable-track {
              background: var(--track-background, ${theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(14,34,71,0.1)'});
              height: 4px;
              border-radius: 99px;
              transition: background 0.2s ease;
            }
            .dreamcode-range::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              background: transparent !important;
              background-image: var(--thumb-image) !important;
              background-size: contain !important;
              background-repeat: no-repeat !important;
              background-position: center !important;
              height: 22px !important;
              width: 34px !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              filter: none !important; /* Remove glow completely by default */
              margin-top: -9px !important;
              transition: transform 0.15s ease, filter 0.15s ease !important;
            }
            .dreamcode-range:hover::-webkit-slider-thumb,
            .dreamcode-range:active::-webkit-slider-thumb {
              filter: drop-shadow(0 0 2px var(--glow-color)) drop-shadow(0 0 6px var(--glow-color)) !important; /* Glow that color on hover/active */
            }
            .dreamcode-range:hover::-webkit-slider-thumb {
              transform: scale(1.18) !important;
            }
            .dreamcode-range:active::-webkit-slider-thumb {
              transform: scale(1.05) !important;
            }
            
            /* Wood range custom styling */
            .wood-range::-webkit-slider-runnable-track {
              background: var(--track-background, rgba(0, 0, 0, 0.45)) !important;
              height: 5px !important;
              border: 1px solid rgba(74, 45, 27, 0.8) !important;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.5) !important;
            }

            /* Firefox overrides */
            .dreamcode-range::-moz-range-track {
              background: var(--track-background, ${theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(14,34,71,0.1)'});
              height: 4px;
              border-radius: 99px;
            }
            .dreamcode-range::-moz-range-thumb {
              background: transparent !important;
              background-image: var(--thumb-image) !important;
              background-size: contain !important;
              background-repeat: no-repeat !important;
              background-position: center !important;
              height: 22px !important;
              width: 34px !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              filter: none !important; /* Remove glow completely by default */
              transition: transform 0.15s ease, filter 0.15s ease !important;
            }
            .dreamcode-range:hover::-moz-range-thumb,
            .dreamcode-range:active::-moz-range-thumb {
              filter: drop-shadow(0 0 2px var(--glow-color)) drop-shadow(0 0 6px var(--glow-color)) !important;
            }
            .dreamcode-range:hover::-moz-range-thumb {
              transform: scale(1.18) !important;
            }
            .wood-range::-moz-range-track {
              background: var(--track-background, rgba(0, 0, 0, 0.45)) !important;
              height: 5px !important;
              border: 1px solid rgba(74, 45, 27, 0.8) !important;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.5) !important;
            }
          `}</style>
    </div>
  );
}
