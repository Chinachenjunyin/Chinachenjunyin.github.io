import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc3,
  ChevronDown,
  ListMusic,
  Volume2,
} from "lucide-react";
import { playlist } from "@/utils/music";

const PREF_KEY = "blog_music_on";

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const setPlayingBoth = (v: boolean) => {
    playingRef.current = v;
    setPlaying(v);
  };

  // 切歌时加载新曲目，若处于播放意图则自动续播
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[index].src;
    audio.load();
    setCurrent(0);
    if (playingRef.current) {
      audio.play().catch(() => setPlayingBoth(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 上次离开时开着音乐：本次尽量自动续播（浏览器拦截时等用户首次点击页面任意处）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[0].src;
    if (localStorage.getItem(PREF_KEY) === "1") {
      audio
        .play()
        .then(() => setPlayingBoth(true))
        .catch(() => {
          const kick = () => {
            audio.play().then(() => setPlayingBoth(true)).catch(() => {});
          };
          document.addEventListener("pointerdown", kick, { once: true });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlayingBoth(false);
      localStorage.setItem(PREF_KEY, "0");
    } else {
      audio
        .play()
        .then(() => {
          setPlayingBoth(true);
          localStorage.setItem(PREF_KEY, "1");
        })
        .catch(() => {});
    }
  };

  const goTo = (i: number) => {
    const n = playlist.length;
    const next = ((i % n) + n) % n;
    setPlayingBoth(true);
    localStorage.setItem(PREF_KEY, "1");
    setIndex(next);
  };

  const track = playlist[index];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {expanded && (
        <div className="glass-strong w-72 max-w-[calc(100vw-2.5rem)] rounded-3xl p-4 shadow-2xl shadow-indigo-500/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-text">
              <ListMusic className="h-4 w-4 text-primary" />
              音乐播放器
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="rounded-full p-1 text-text-muted hover:text-text"
              aria-label="收起播放器"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3">
            <p className="truncate font-display text-base font-bold text-text">
              {track.title}
            </p>
            <p className="truncate text-xs text-text-muted">{track.artist}</p>
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCurrent(v);
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
            className="mt-3 w-full accent-indigo-500"
            aria-label="播放进度"
          />
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo(index - 1)}
              className="rounded-full p-2 text-text-muted transition-colors hover:text-primary"
              aria-label="上一首"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-indigo-500/40 transition-transform hover:scale-105"
              aria-label={playing ? "暂停" : "播放"}
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="rounded-full p-2 text-text-muted transition-colors hover:text-primary"
              aria-label="下一首"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 space-y-1">
            {playlist.map((t, i) => (
              <button
                key={t.src}
                onClick={() => goTo(i)}
                className={`flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-left text-xs transition-colors ${
                  i === index
                    ? "bg-indigo-500/10 font-bold text-primary"
                    : "text-text-muted hover:bg-white/50 hover:text-text"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    i === index ? "animate-pulse bg-primary" : "bg-slate-300"
                  }`}
                />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Volume2 className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-indigo-500"
              aria-label="音量"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="glass-strong relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl shadow-indigo-500/20 transition-transform hover:scale-105"
        aria-label="音乐播放器"
      >
        <Disc3
          className={`h-6 w-6 text-primary ${
            playing ? "animate-spin [animation-duration:2.5s]" : ""
          }`}
        />
        {playing && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse rounded-full bg-secondary" />
        )}
      </button>

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => goTo(index + 1)}
      />
    </div>
  );
}
