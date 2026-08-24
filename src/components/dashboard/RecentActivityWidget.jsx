import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  History, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { formatTimeAgo } from '../../utils/parkingUtils';

const RecentActivityWidget = () => {
  const { activityLogs } = useParkingData();
  const navigate = useNavigate();

  // Display top 6 most recent activities
  const recentLogs = activityLogs.slice(0, 6);

  return (
    <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 lg:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Recent Entry / Exit Activity
              </h3>
              <p className="text-xs text-slate-400">
                Live vehicle telemetry & gate logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Streaming</span>
          </div>
        </div>

        {/* Activity Stream List */}
        <div className="space-y-2.5">
          {recentLogs.map((item) => {
            const isEntry = item.type === 'ENTRY';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#081220] border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Entry/Exit Icon */}
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isEntry
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isEntry ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          isEntry ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isEntry ? 'Vehicle Entered' : 'Vehicle Exited'}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="font-mono font-black text-cyan-300">
                        {item.areaId}
                      </span>
                      {item.slotId && (
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.slotId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>{item.licensePlate || 'TN-09-XX-0000'}</span>
                      {item.vehicleModel && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 truncate max-w-[120px]">
                            {item.vehicleModel}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamp & Status */}
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-cyan-400/90 block mt-0.5">
                    {item.status || 'Verified'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link to full activity */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          Showing 6 most recent events
        </span>
        <button
          onClick={() => navigate('/activity')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RecentActivityWidget;
