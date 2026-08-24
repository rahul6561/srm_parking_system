import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import StatusBadge from '../common/StatusBadge';
import { Sparkles, Navigation, ArrowRight, Zap, MapPin, Gauge } from 'lucide-react';

const BestAvailableCard = () => {
  const { bestAvailable } = useParkingData();
  const navigate = useNavigate();

  if (!bestAvailable) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F2848] via-[#0C1E38] to-[#0A162B] border border-emerald-500/40 p-5 lg:p-6 shadow-xl glow-available">
      {/* Decorative Badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
              Best Available Parking
            </h3>
            <p className="text-[11px] text-slate-300">
              Optimal campus destination with maximum open bays
            </p>
          </div>
        </div>

        <StatusBadge status={bestAvailable.status} size="sm" />
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 p-4 rounded-xl bg-[#06101D]/70 border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Recommended Area
          </span>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            {bestAvailable.id}
          </div>
          <p className="text-xs text-slate-300 truncate mt-0.5">
            {bestAvailable.name}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Spaces Free
          </span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            {bestAvailable.available} <span className="text-xs font-normal text-slate-400 font-sans">/ 150</span>
          </div>
          <p className="text-xs text-emerald-300/90 mt-0.5 font-medium">
            {((bestAvailable.available / 150) * 100).toFixed(0)}% Unoccupied
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Campus Location
          </span>
          <div className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{bestAvailable.zone}</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            Sensor: {bestAvailable.sensorStatus}
          </p>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-300 flex items-center gap-2 w-full sm:w-auto">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>EV Charging & Accessible spots available</span>
        </div>

        <button
          onClick={() => navigate(`/parking/${bestAvailable.id}`)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all transform active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>View Parking ({bestAvailable.id})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BestAvailableCard;
