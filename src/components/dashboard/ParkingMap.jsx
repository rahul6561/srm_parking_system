import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import { STATUS_CONFIG } from '../../utils/parkingUtils';
import { Map, Navigation, Eye, Zap, Shield, Sparkles, MapPin } from 'lucide-react';

const ParkingMap = () => {
  const { parkingAreas } = useParkingData();
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState(null);

  return (
    <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Campus Parking Schematic Overview
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 6-zone campus layout • Click any zone for detailed bay grid
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono flex-wrap bg-[#081220] px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            &gt;20% Free
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Limited
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Full
          </span>
        </div>
      </div>

      {/* Schematic Campus Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#07111F] rounded-xl border border-slate-800/90 overflow-hidden shadow-inner p-4">
        {/* Schematic Grid Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 58, 102, 0.4)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#campus-grid)" />
          
          {/* Main Campus Boulevards */}
          <path d="M 0 50% L 100% 50%" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="8" strokeDasharray="12 8" />
          <path d="M 50% 0 L 50% 100%" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="8" strokeDasharray="12 8" />
          <circle cx="50%" cy="50%" r="60" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="4" />
        </svg>

        {/* Campus Landmark Labels */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0B1A30]/80 border border-slate-700/60 text-[10px] font-mono text-slate-400 tracking-wider pointer-events-none uppercase">
          NORTH MAIN GATE • GST ROAD ACCESS
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-blue-900/30 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
            <span className="text-[10px] font-extrabold text-cyan-300 font-mono">SRM HUB</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 block">
            Central Quad & Clock Tower
          </span>
        </div>

        {/* 6 Parking Zones Hotspots */}
        <div className="relative w-full h-full">
          {parkingAreas.map((area) => {
            const config = STATUS_CONFIG[area.status] || STATUS_CONFIG.AVAILABLE;
            const isFull = area.occupied >= area.capacity;
            const isHovered = hoveredZone === area.id;

            return (
              <div
                key={area.id}
                style={{
                  left: `${area.coordinates.x}%`,
                  top: `${area.coordinates.y}%`
                }}
                onMouseEnter={() => setHoveredZone(area.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => navigate(`/parking/${area.id}`)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 transform group"
              >
                {/* Visual Radar Pulse */}
                <div
                  className={`absolute -inset-2 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity animate-pulse ${
                    isFull ? 'bg-rose-500/30' : area.status === 'LIMITED' ? 'bg-amber-500/30' : 'bg-emerald-500/30'
                  }`}
                />

                {/* Zone Card / Hotspot Node */}
                <div
                  className={`relative p-2.5 sm:p-3 rounded-xl bg-[#0D1E36] border-2 shadow-2xl transition-all duration-200 min-w-[120px] sm:min-w-[140px] text-center ${
                    isHovered
                      ? 'scale-110 border-cyan-400 shadow-cyan-500/30 z-30'
                      : `${config.borderClass} z-10 hover:border-cyan-400`
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-black font-mono text-white group-hover:text-cyan-300">
                      {area.id}
                    </span>
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        isFull
                          ? 'bg-rose-500/20 text-rose-300'
                          : area.status === 'LIMITED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {area.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-300 truncate font-medium">
                    {area.name}
                  </div>

                  {/* Occupancy Indicator */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{area.occupied}/150</span>
                    <span
                      className={`font-bold ${
                        area.available > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {area.available} Free
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all ${config.progressBar}`}
                      style={{ width: `${area.occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParkingMap;
