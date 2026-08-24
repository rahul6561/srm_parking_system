import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { STATUS_CONFIG } from '../../utils/parkingUtils';
import { 
  Car, 
  CheckCircle2, 
  MapPin, 
  Cpu, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const ParkingCard = ({ area }) => {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[area.status] || STATUS_CONFIG.AVAILABLE;

  const isFull = area.occupied >= area.capacity;
  const isEmpty = area.occupied === 0;

  return (
    <div
      onClick={() => navigate(`/parking/${area.id}`)}
      className={`relative overflow-hidden rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/30 cursor-pointer flex flex-col justify-between group ${
        isFull ? 'hover:border-rose-500/50' : ''
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-mono tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                {area.id}
              </span>
              <StatusBadge status={area.status} size="sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-1 line-clamp-1">
              {area.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{area.zone}</span>
            </div>
          </div>

          {/* Sensor Ping Indicator */}
          <div
            className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
              area.sensorStatus === 'Connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
            title={`IoT Sensor Node: ${area.hardware?.rpiId || 'Raspberry Pi'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                area.sensorStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">{area.sensorStatus}</span>
          </div>
        </div>

        {/* Special Banner for Empty / Full states */}
        {isEmpty && (
          <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center uppercase tracking-wider">
            ✨ ALL SPACES AVAILABLE
          </div>
        )}

        {isFull && (
          <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PARKING FULL</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[#071221] border border-slate-800/80 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Capacity</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {area.capacity}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Occupied</div>
            <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
              {area.occupied}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Available</div>
            <div className={`text-sm font-black font-mono mt-0.5 ${area.available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {area.available}
            </div>
          </div>
        </div>

        {/* Progress Bar & Occupancy % */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-400 font-mono">Occupancy</span>
            <span className={`font-mono font-bold ${config.textClass}`}>
              {area.occupancyPercentage}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.progressBar}`}
              style={{ width: `${Math.min(100, Math.max(0, area.occupancyPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            15 EV
          </span>
          <span className="text-slate-600">•</span>
          <span>
            {area.entriesToday} In / {area.exitsToday} Out
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default ParkingCard;
