// 把本地图片文件转成可存进文章数据的 data URL。
// 博客数据存在浏览器 localStorage 里（上限约 5MB），所以普通图片先压缩：
// 最长边压到 1280px、转 JPEG 质量 0.82，一张图通常只剩一两百 KB。
// 小体积 GIF 保留原图，避免动画丢帧。

const MAX_DIM = 1280;
const MAX_GIF_BYTES = 1.5 * 1024 * 1024;

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        readAsDataURL(file).then(resolve, reject);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      readAsDataURL(file).then(resolve, reject);
    };
    img.src = url;
  });
}

export function fileToDataURL(file: File): Promise<string> {
  if (file.type === "image/gif" && file.size <= MAX_GIF_BYTES) {
    return readAsDataURL(file);
  }
  return compressImage(file);
}
