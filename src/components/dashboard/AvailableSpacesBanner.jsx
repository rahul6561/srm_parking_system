import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import { Car, Sparkles, Navigation, ArrowUpRight, ShieldCheck } from 'lucide-react';

const AvailableSpacesBanner = () => {
  const { campusSummary, bestAvailable } = useParkingData();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1E38] via-[#0E2A4E] to-[#0A182E] border border-blue-500/30 p-6 lg:p-7 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Main Metrics Display */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Real-Time Space Availability</span>
          </div>

          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono">
                {campusSummary.totalAvailable} <span className="text-slate-400 text-2xl sm:text-3xl font-sans font-normal">/ {campusSummary.totalCapacity}</span>
              </h2>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                spaces available
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {campusSummary.availablePercentage}% available
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono">
                <strong className="text-white">{campusSummary.totalOccupied}</strong> / {campusSummary.totalCapacity} occupied ({campusSummary.occupancyPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action / Best Available Spotlight */}
        {bestAvailable && (
          <div className="w-full lg:w-auto bg-[#071324]/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[260px] shadow-lg">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                ⭐ Top Recommended Zone
              </div>
              <div className="text-base font-bold text-white mt-0.5 flex items-center justify-between">
                <span>{bestAvailable.id}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {bestAvailable.available} Free
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">
                {bestAvailable.name}
              </p>
            </div>

            <button
              onClick={() => navigate(`/parking/${bestAvailable.id}`)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all transform active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Direct to {bestAvailable.id}</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar Overview */}
      <div className="relative mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
          <span>Campus Occupancy Rate</span>
          <span className="font-bold text-slate-200">{campusSummary.occupancyPercentage}% full</span>
        </div>
        <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              campusSummary.occupancyPercentage > 85
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : campusSummary.occupancyPercentage > 65
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400'
            }`}
            style={{ width: `${campusSummary.occupancyPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableSpacesBanner;
