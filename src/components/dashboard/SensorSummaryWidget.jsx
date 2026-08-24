import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import { Cpu, Wifi, Activity, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatTimeAgo } from '../../utils/parkingUtils';

const SensorSummaryWidget = () => {
  const { parkingAreas, toggleSensor } = useParkingData();
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 lg:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Widget Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Sensor Monitoring
              </h3>
              <p className="text-xs text-slate-400">
                Raspberry Pi Gate & Induction Nodes (Mock / Demo Stream)
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Ready for RPi Gateway</span>
          </div>
        </div>

        {/* Hardware Mock Disclaimer Banner */}
        <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Demonstration Mode: Showing simulated hardware signals ready for REST/MQTT endpoints.
          </span>
        </div>

        {/* Sensor Node Rows */}
        <div className="space-y-2">
          {parkingAreas.map((area) => {
            const isOnline = area.sensorStatus === 'Connected';
            return (
              <div
                key={area.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#081220] border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="font-mono font-black text-cyan-400 shrink-0">
                    {area.id}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 truncate">
                        {area.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="text-emerald-400">
                        In: {area.entriesToday}
                      </span>
                      <span>•</span>
                      <span className="text-amber-400">
                        Out: {area.exitsToday}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline text-slate-400">
                        Signal: {area.hardware?.lastSignalMs || 850}ms ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      isOnline
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                      }`}
                    />
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </span>

                  <button
                    onClick={() => toggleSensor(area.id)}
                    className="p-1 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors"
                    title={`Simulate sensor connection toggle for ${area.id}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          Protocol: MQTT / WebSockets (IoT Node v2)
        </span>
        <button
          onClick={() => navigate('/sensors')}
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Full Sensor Health</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SensorSummaryWidget;
