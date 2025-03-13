import React from 'react';
import { StreamStats } from '../types';

interface StatsProps {
  stats: StreamStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-sm text-gray-400">Total Players</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 p-4">
            <p className="text-sm text-gray-400">Police</p>
            <p className="text-2xl font-bold text-blue-400">{stats.police}</p>
          </div>
          <div className="rounded-lg bg-red-500/10 p-4">
            <p className="text-sm text-gray-400">Crime</p>
            <p className="text-2xl font-bold text-red-400">{stats.crime}</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-4">
            <p className="text-sm text-gray-400">EMS</p>
            <p className="text-2xl font-bold text-green-400">{stats.ems}</p>
          </div>
        </div>
      </div>
    </div>
  );
}