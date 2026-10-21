export interface Track {
  title: string;
  artist: string;
  src: string;
}

// 博客音乐歌单：src 为网易云官方外链（版权由平台按地区判定，播不了的曲目播放器会自动跳过）
export const playlist: Track[] = [
  {
    title: "雨爱",
    artist: "杨丞琳",
    src: "https://music.163.com/song/media/outer/url?id=316100.mp3",
  },
  {
    title: "下雨天",
    artist: "梁心颐 Lara（南拳妈妈原唱）",
    src: "https://music.163.com/song/media/outer/url?id=3384823504.mp3",
  },
  {
    title: "Cry for Me",
    artist: "Camila Cabello",
    src: "https://music.163.com/song/media/outer/url?id=1394670848.mp3",
  },
];
