import React from 'react';
import { Stream } from '../types';
import { StreamCard } from './StreamCard';

interface CategorySectionProps {
  title: string;
  streams: Stream[];
}

export function CategorySection({ title, streams }: CategorySectionProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </section>
  );
}