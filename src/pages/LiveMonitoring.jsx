import React, { useState, useEffect } from 'react';
import { useParkingData } from '../context/ParkingContext';
import StatusBadge from '../components/common/StatusBadge';
import { STATUS_CONFIG, formatTimeAgo } from '../utils/parkingUtils';
import { 
  Radio, 
  Activity, 
  Cpu, 
  Wifi, 
  Camera, 
  ShieldCheck, 
  ArrowDownRight, 
  ArrowUpRight,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Gauge
} from 'lucide-react';

const LiveMonitoring = () => {
  const { 
    parkingAreas, 
    activityLogs, 
    isSimulating, 
    setIsSimulating, 
    simulationSpeed, 
    setSimulationSpeed, 
    triggerEntry, 
    triggerExit 
  } = useParkingData();

  const [selectedFeed, setSelectedFeed] = useState('ALL');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Live Broadcast Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0E223D] via-[#0B1A30] to-[#071324] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Live Sensor Telemetry & Gate Feeds
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase font-mono animate-pulse">
                LIVE BROADCAST
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time stream from 6 Raspberry Pi edge gateways and ultrasonic loop sensors
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isSimulating
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>

          <div className="flex items-center bg-[#081220] border border-slate-800 rounded-xl p-1 text-xs">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold ${
                  simulationSpeed === spd
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Gateway Live Radar Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parkingAreas.map((area) => {
          const config = STATUS_CONFIG[area.status] || STATUS_CONFIG.AVAILABLE;
          const isOnline = area.sensorStatus === 'Connected';

          return (
            <div
              key={area.id}
              className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              {/* Feed Header */}
              <div className="p-4 bg-[#0A1628] border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-bold text-white text-xs">
                    {area.id} GATE SENSOR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {area.hardware?.ip || '192.168.1.100'}
                  </span>
                  <StatusBadge status={area.status} size="sm" />
                </div>
              </div>

              {/* Feed Visual Simulation Container */}
              <div className="relative p-5 bg-[#07111F] space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Live Occupancy</div>
                    <div className="text-xl font-mono font-black text-white">
                      {area.occupied} <span className="text-xs font-normal text-slate-400">/ 150</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Free Spaces</div>
                    <div className="text-xl font-mono font-black text-emerald-400">
                      {area.available}
                    </div>
                  </div>
                </div>

                {/* Real-time Oscillating Wave / Load Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Capacity Load</span>
                    <span className={`font-bold ${config.textClass}`}>{area.occupancyPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.progressBar}`}
                      style={{ width: `${area.occupancyPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Node Diagnostics Strip */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#050D18] p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[9px]">PING LATENCY</span>
                    <span className="text-cyan-400 font-bold">{area.hardware?.lastSignalMs || 750} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">TEMP / HEALTH</span>
                    <span className="text-slate-300 font-bold">{area.hardware?.temperature || '38.5°C'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#0A1628] border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => triggerEntry(area.id)}
                  disabled={area.occupied >= area.capacity}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-bold font-mono transition-colors disabled:opacity-40"
                >
                  + Entry
                </button>
                <button
                  onClick={() => triggerExit(area.id)}
                  disabled={area.occupied <= 0}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold font-mono transition-colors disabled:opacity-40"
                >
                  - Exit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Activity Feed Stream */}
      <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Live Event Stream</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activityLogs.length} events logged
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#081220] border border-slate-800/80 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.type === 'ENTRY'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {log.type}
                </span>
                <span className="font-bold text-cyan-300">{log.areaId}</span>
                <span className="text-slate-400 text-[11px]">{log.slotId || 'Gate'}</span>
                <span className="text-slate-300 hidden sm:inline">{log.licensePlate} ({log.vehicleModel})</span>
              </div>

              <div className="text-slate-400 text-[11px]">
                {formatTimeAgo(log.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
