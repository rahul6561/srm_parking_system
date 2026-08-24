import React from 'react';
import { useParkingData } from '../context/ParkingContext';
import { 
  Cpu, 
  Wifi, 
  Activity, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  Zap,
  Terminal,
  Radio,
  Clock
} from 'lucide-react';
import { formatTimeAgo } from '../utils/parkingUtils';

const Sensors = () => {
  const { parkingAreas, toggleSensor } = useParkingData();

  const totalConnected = parkingAreas.filter((a) => a.sensorStatus === 'Connected').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              IoT Sensor Network & Edge Nodes
            </h1>
            <p className="text-xs text-slate-400">
              Raspberry Pi 4B telemetry gateways and induction loop health monitoring
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1B30] border border-slate-800 text-xs font-mono font-bold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{totalConnected} / 6 Nodes Online</span>
        </div>
      </div>

      {/* Hardware Architecture Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C1E38] via-[#0E284A] to-[#0A162B] border border-blue-500/30 text-xs text-slate-300 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase font-mono text-[11px]">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Hardware & Future Integration Architecture (Mock Data Notice)</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          This dashboard displays <strong>simulated real-time sensor node telemetry</strong>. In production, each of the 6 parking zones runs a dedicated <strong>Raspberry Pi 4B</strong> running an MQTT edge broker connected to magnetic loop sensors, barrier gates, and license plate recognition cameras.
        </p>
        <div className="flex items-center gap-4 text-[11px] font-mono text-cyan-400 pt-1 flex-wrap">
          <span>Target Endpoints: GET /api/sensors, GET /api/sensors/:id</span>
          <span>•</span>
          <span>Protocol: MQTT / WebSockets</span>
          <span>•</span>
          <span>Baud Rate: 115200</span>
        </div>
      </div>

      {/* 6 Hardware Sensor Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parkingAreas.map((area) => {
          const isConnected = area.sensorStatus === 'Connected';
          const hw = area.hardware || {};

          return (
            <div
              key={area.id}
              className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between transition-all hover:border-slate-700"
            >
              <div>
                {/* Node Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-cyan-400">
                        {area.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isConnected
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                          }`}
                        />
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">
                      {area.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Hardware ID: {hw.rpiId || 'RPI-4B-NODE'}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleSensor(area.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
                    title="Simulate toggle online/offline state"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Node Hardware Specifications */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono bg-[#071221] p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">IP Address</span>
                    <span className="font-bold text-slate-200">{hw.ip || '192.168.10.100'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Firmware</span>
                    <span className="font-bold text-slate-200">{hw.firmware || 'v2.4.1'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Ping Latency</span>
                    <span className="font-bold text-emerald-400">{hw.lastSignalMs || 850} ms</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Signal Strength</span>
                    <span className="font-bold text-cyan-300">{hw.signalDbm || -52} dBm</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Core Temp</span>
                    <span className="font-bold text-slate-300">{hw.temperature || '39.0°C'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">System Uptime</span>
                    <span className="font-bold text-slate-300">{hw.uptimeHours || 320}h</span>
                  </div>
                </div>

                {/* Sensor Count Telemetry */}
                <div className="mt-4 p-3 rounded-xl bg-[#0A1628] border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Entries Detected Today</span>
                    <span className="text-base font-bold text-emerald-400">{area.entriesToday}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Exits Detected Today</span>
                    <span className="text-base font-bold text-amber-400">{area.exitsToday}</span>
                  </div>
                </div>
              </div>

              {/* Node Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Last Signal: {formatTimeAgo(area.lastUpdated)}</span>
                </span>
                <span className="text-emerald-400 font-bold">
                  Health: {hw.sensorHealth || 'Optimal'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sensors;
