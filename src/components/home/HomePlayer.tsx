import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  ListMusic,
} from "lucide-react";
import { playlist } from "@/utils/music";

const PREF_KEY = "blog_music_on";

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HomePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const setPlayingBoth = (v: boolean) => {
    playingRef.current = v;
    setPlaying(v);
  };

  // 某首歌播不了（版权受限等）时自动跳到下一首；全部失败则停下，不无限循环
  const failCount = useRef(0);
  const lastFailAt = useRef(0);
  const handleTrackError = () => {
    const now = Date.now();
    if (now - lastFailAt.current < 1500) return; // 同一次失败的重复信号只算一次
    lastFailAt.current = now;
    failCount.current += 1;
    if (failCount.current < playlist.length) {
      setIndex((i) => (i + 1) % playlist.length);
    } else {
      failCount.current = 0;
      setPlayingBoth(false);
    }
  };

  // 切歌时加载新曲目，若处于播放意图则自动续播
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[index].src;
    audio.load();
    setCurrent(0);
    if (playingRef.current) {
      audio.play().catch(() => handleTrackError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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
    failCount.current = 0;
    setPlayingBoth(true);
    localStorage.setItem(PREF_KEY, "1");
    setIndex(next);
  };

  const track = playlist[index];

  return (
    <div className="lg:col-span-5 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <ListMusic className="w-4 h-4 text-primary" />
          音乐播放器
        </span>
        <span className="text-xs text-text-muted">
          {index + 1} / {playlist.length}
        </span>
      </div>

      <div
        className={`mx-auto my-5 w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center shadow-xl ${
          playing ? "animate-spin [animation-duration:6s]" : ""
        }`}
      >
        <Music className="text-white w-10 h-10" />
      </div>

      <p className="font-display font-bold text-lg truncate text-center text-slate-900">
        {track.title}
      </p>
      <p className="text-xs text-text-muted text-center mt-0.5">
        {track.artist}
      </p>

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
        className="mt-4 w-full accent-indigo-500"
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

      <div className="mt-4 space-y-1">
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

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onCanPlay={() => {
          failCount.current = 0;
        }}
        onError={() => handleTrackError()}
        onEnded={() => goTo(index + 1)}
      />
    </div>
  );
}
