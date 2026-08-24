import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import StatusBadge from '../common/StatusBadge';
import { CheckCircle2, ChevronRight, Navigation, Sparkles } from 'lucide-react';

const AvailableParkingList = () => {
  const { parkingAreas } = useParkingData();
  const navigate = useNavigate();

  // Filter areas with available spaces
  const availableAreas = [...parkingAreas]
    .filter((area) => area.available > 0)
    .sort((a, b) => b.available - a.available);

  return (
    <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 lg:p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Available Parking
              </h3>
              <p className="text-xs text-slate-400">
                Zones with active free spaces
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {availableAreas.length} Zones Ready
          </span>
        </div>

        {/* List of Available Parking Areas */}
        <div className="space-y-2.5">
          {availableAreas.map((area) => (
            <div
              key={area.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#081220] border border-slate-800/80 hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {area.id.replace('SRM-', '')}
                  </span>
                  <span className="text-[8px] text-slate-400">ZONE</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">
                      {area.id}
                    </span>
                    <StatusBadge status={area.status} size="sm" showDot={false} />
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {area.available} spaces available
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/parking/${area.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-600 hover:text-white text-xs font-semibold transition-all group-hover:bg-cyan-600 group-hover:text-white shrink-0 ml-2"
              >
                <span>View Parking</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-400">
          Smart routing algorithm updates recommendations every second
        </p>
      </div>
    </div>
  );
};

export default AvailableParkingList;
