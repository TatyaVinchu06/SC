export interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  streamer: string;
  category: 'Crim' | 'Cop' | 'EMS' | 'Highlights';
  youtubeUrl: string;
  viewerCount: number;
  isLive: boolean;
  publishedAt?: string;
}

export interface StreamStats {
  total: number;
  police: number;
  crime: number;
  ems: number;
}