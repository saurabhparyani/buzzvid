export function getVideoUrl(videoPath: string): string {
    if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
      return videoPath;
    }
    return `${import.meta.env.VITE_API_URL}${videoPath}`;
  }