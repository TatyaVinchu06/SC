const API_KEY = 'AIzaSyB4X-ZAa1hE5kOkEFYmpBlRFYCrcc-dsQs';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const SOULCITY_KEYWORDS = [
  'soulcity',
  'soul city',
  '#soulcity',
  '#lifeinsoulcity',
  'life in soulcity',
  'soulcity rp',
  'soul city rp',
  'vltrp',
  'soulcity by echo rp'
];

const HIGHLIGHTS_KEYWORDS = [
  'montage',
  'highlights',
  'war',
  'gang war',
  'best moments',
  'compilation'
];

function containsSoulCityKeywords(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return SOULCITY_KEYWORDS.some(keyword => lowerTitle.includes(keyword.toLowerCase()));
}

function isHighlightVideo(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return HIGHLIGHTS_KEYWORDS.some(keyword => lowerTitle.includes(keyword.toLowerCase()));
}

export async function searchLiveStreams(query: string) {
  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    eventType: 'live',
    maxResults: '50',
    key: API_KEY
  });

  const response = await fetch(`${BASE_URL}/search?${searchParams}`);
  const data = await response.json();
  return data;
}

export async function searchHighlights() {
  // Create multiple search queries for different types of highlights
  const queries = [
    'SoulCity RP montage',
    'SoulCity RP war',
    'VLTRP war highlights',
    'SoulCity By Echo RP highlights',
    'SoulCity gang war'
  ];

  const allResults = await Promise.all(
    queries.map(async (query) => {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        order: 'date',
        maxResults: '10',
        key: API_KEY,
        videoDuration: 'medium' // Filter for medium-length videos (typically highlights/montages)
      });

      const response = await fetch(`${BASE_URL}/search?${searchParams}`);
      const data = await response.json();
      return data.items || [];
    })
  );

  // Combine and deduplicate results
  const uniqueVideos = new Map();
  allResults.flat().forEach(video => {
    if (!video.id?.videoId) return;
    
    const title = video.snippet?.title || '';
    // Only include videos that are highlights/montages and related to SoulCity
    if (containsSoulCityKeywords(title) && isHighlightVideo(title)) {
      uniqueVideos.set(video.id.videoId, video);
    }
  });

  return Array.from(uniqueVideos.values());
}

export async function getVideoStats(videoId: string) {
  const searchParams = new URLSearchParams({
    part: 'statistics,liveStreamingDetails',
    id: videoId,
    key: API_KEY
  });

  const response = await fetch(`${BASE_URL}/videos?${searchParams}`);
  const data = await response.json();
  return data;
}

export { containsSoulCityKeywords, isHighlightVideo };