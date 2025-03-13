import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Stream } from '../types';

interface StreamCardProps {
  stream: Stream;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <a
      href={stream.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm transition-transform hover:scale-105"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="h-full w-full object-cover"
        />
        {stream.isLive && (
          <div className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            LIVE
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-purple-400">
          {stream.title}
        </h3>
        <p className="text-sm text-gray-300">{stream.streamer}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {stream.viewerCount.toLocaleString()} viewers
          </span>
          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-400" />
        </div>
      </div>
    </a>
  );
}