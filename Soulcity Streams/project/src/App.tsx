import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { CategorySection } from './components/CategorySection';
import { Stats } from './components/Stats';
import { Stream } from './types';
import { searchLiveStreams, searchHighlights, getVideoStats, containsSoulCityKeywords, isHighlightVideo } from './utils/youtube';

function App() {
  const [streams, setStreams] = useState<{
    crim: Stream[];
    cop: Stream[];
    ems: Stream[];
    highlights: Stream[];
  }>({
    crim: [],
    cop: [],
    ems: [],
    highlights: [],
  });

  const [stats, setStats] = useState({
    total: 0,
    police: 0,
    crime: 0,
    ems: 0,
  });

  useEffect(() => {
    async function fetchStreams() {
      try {
        // Fetch live streams
        const response = await searchLiveStreams('SoulCity RP');
        const videos = response.items || [];
        
        const streamData = await Promise.all(
          videos.map(async (video) => {
            const statsResponse = await getVideoStats(video.id?.videoId || '');
            const videoStats = statsResponse.items?.[0];
            
            // Only include streams that have SoulCity keywords
            if (!containsSoulCityKeywords(video.snippet?.title || '')) {
              return null;
            }

            return {
              id: video.id?.videoId || '',
              title: video.snippet?.title || '',
              thumbnail: video.snippet?.thumbnails?.high?.url || '',
              streamer: video.snippet?.channelTitle || '',
              category: determineCategory(video.snippet?.title || ''),
              youtubeUrl: `https://youtube.com/watch?v=${video.id?.videoId}`,
              viewerCount: parseInt(videoStats?.statistics?.viewCount || '0', 10),
              isLive: Boolean(videoStats?.liveStreamingDetails?.actualEndTime),
              publishedAt: video.snippet?.publishedAt,
            };
          })
        );

        // Fetch highlights
        const highlightsVideos = await searchHighlights();
        
        const highlightsData = await Promise.all(
          highlightsVideos.map(async (video) => {
            const statsResponse = await getVideoStats(video.id?.videoId || '');
            const videoStats = statsResponse.items?.[0];

            return {
              id: video.id?.videoId || '',
              title: video.snippet?.title || '',
              thumbnail: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url || '',
              streamer: video.snippet?.channelTitle || '',
              category: 'Highlights',
              youtubeUrl: `https://youtube.com/watch?v=${video.id?.videoId}`,
              viewerCount: parseInt(videoStats?.statistics?.viewCount || '0', 10),
              isLive: false,
              publishedAt: video.snippet?.publishedAt,
            };
          })
        );

        // Filter out null values and categorize streams
        const validStreams = streamData.filter((stream): stream is Stream => stream !== null);
        const validHighlights = highlightsData.filter((highlight): highlight is Stream => highlight !== null);

        const categorizedStreams = {
          crim: validStreams.filter(stream => stream.category === 'Crim'),
          cop: validStreams.filter(stream => stream.category === 'Cop'),
          ems: validStreams.filter(stream => stream.category === 'EMS'),
          highlights: validHighlights,
        };

        setStreams(categorizedStreams);
        setStats({
          total: validStreams.length,
          police: categorizedStreams.cop.length,
          crime: categorizedStreams.crim.length,
          ems: categorizedStreams.ems.length,
        });
      } catch (error) {
        console.error('Error fetching streams:', error);
      }
    }

    fetchStreams();
    const interval = setInterval(fetchStreams, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="relative mb-12 overflow-hidden py-8">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://images-ext-1.discordapp.net/external/U3b6P1NKMoK-0ZzLyTiaDN7s9_5BA3Kfjoj9bYo-bwc/https/cdn.discordapp.com/stickers/1349392891730067456.png?format=webp&quality=lossless&width=1131&height=350"
                alt="SoulCity RP"
                className="h-16 w-auto"
              />
              <h1 className="text-3xl font-bold text-white">SoulCity RP Streams</h1>
            </div>
            <a
              href="https://discord.gg/soulcitygg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700"
            >
              <Users className="h-5 w-5" />
              Join Discord
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-32">
        <CategorySection title="Criminal Streams" streams={streams.crim} />
        <CategorySection title="Police Streams" streams={streams.cop} />
        <CategorySection title="EMS Streams" streams={streams.ems} />
        <CategorySection 
          title="Server Highlights & War Montages" 
          streams={streams.highlights} 
        />
      </main>

      {/* Stats Footer */}
      <Stats stats={stats} />
    </div>
  );
}

function determineCategory(title: string): 'Crim' | 'Cop' | 'EMS' {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('cop') || lowerTitle.includes('police') || lowerTitle.includes('pd')) {
    return 'Cop';
  }
  if (lowerTitle.includes('ems') || lowerTitle.includes('medic') || lowerTitle.includes('doctor')) {
    return 'EMS';
  }
  return 'Crim'; // Default category
}

export default App;