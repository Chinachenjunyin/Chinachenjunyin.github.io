export interface Track {
  title: string;
  artist: string;
  src: string;
}

// 博客音乐歌单：把 src 换成任意可直链播放的 mp3 地址即可换歌
export const playlist: Track[] = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix 演示曲目",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "SoundHelix Song 2",
    artist: "SoundHelix 演示曲目",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "SoundHelix Song 3",
    artist: "SoundHelix 演示曲目",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
