import React, { useState } from 'react';
import { useParkingData } from '../context/ParkingContext';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Bell, 
  Database, 
  ShieldCheck, 
  RotateCcw, 
  Code, 
  Check, 
  Radio, 
  Save, 
  AlertCircle
} from 'lucide-react';

const Settings = () => {
  const { 
    isSimulating, 
    setIsSimulating, 
    simulationSpeed, 
    setSimulationSpeed, 
    resetAllData 
  } = useParkingData();

  const [saved, setSaved] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [fullThreshold, setFullThreshold] = useState(95);
  const [enableSound, setEnableSound] = useState(false);
  const [campusName, setCampusName] = useState('SRM Institute of Science and Technology (KTR Main Campus)');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const apiEndpoints = [
    { method: 'GET', path: '/api/parking', desc: 'Returns summary for all 6 campus parking areas' },
    { method: 'GET', path: '/api/parking/:id', desc: 'Returns specific parking area including 150 slot states' },
    { method: 'GET', path: '/api/parking/:id/slots', desc: 'Returns slot layout array for specified zone' },
    { method: 'GET', path: '/api/sensors', desc: 'Returns all Raspberry Pi edge node health & ping stats' },
    { method: 'GET', path: '/api/activity', desc: 'Returns recent vehicle entry & exit events stream' },
    { method: 'POST', path: '/api/parking/:id/entry', desc: 'Trigger vehicle entry event from induction sensor' },
    { method: 'POST', path: '/api/parking/:id/exit', desc: 'Trigger vehicle exit event from induction sensor' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Campus System Configuration
            </h1>
            <p className="text-xs text-slate-400">
              Simulation telemetry parameters, sensor thresholds, and API integration settings
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Section 1: Real-time Simulation Engine Settings */}
      <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Real-time Simulation Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Live Sensor Heartbeat Simulation
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Automatically simulate random vehicle entries, exits, and induction loop events.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSimulating(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  isSimulating
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Enabled (Live)
              </button>
              <button
                onClick={() => setIsSimulating(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  !isSimulating
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Paused
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Simulation Update Speed
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Interval frequency between simulated IoT sensor events.
            </p>
            <div className="flex items-center gap-2">
              {[
                { speed: 1, label: 'Normal (3.5s)' },
                { speed: 2, label: 'Fast (2.0s)' },
                { speed: 5, label: 'Ultra (1.0s)' }
              ].map((item) => (
                <button
                  key={item.speed}
                  onClick={() => setSimulationSpeed(item.speed)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                    simulationSpeed === item.speed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Reset all 6 zones to their default starting states
          </span>
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Section 2: Occupancy Thresholds */}
      <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Occupancy Status Thresholds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Limited Capacity Warning (%)</span>
              <span className="text-amber-400 font-bold">{warningThreshold}% (120 vehicles)</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Bays switch to Amber / LIMITED when capacity exceeds this percentage.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Full Capacity Threshold (%)</span>
              <span className="text-rose-400 font-bold">{fullThreshold}% (143 vehicles)</span>
            </div>
            <input
              type="range"
              min="90"
              max="100"
              value={fullThreshold}
              onChange={(e) => setFullThreshold(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Bays switch to Red / FULL when capacity exceeds this percentage.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Future API & Hardware Endpoints Blueprint */}
      <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Future REST / MQTT API Blueprint</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            Frontend Service Layer Ready
          </span>
        </div>

        <p className="text-xs text-slate-300">
          The application service layer (<code className="text-cyan-300 font-mono">src/services/parkingService.js</code>) is constructed to directly interface with these endpoints once backend & Raspberry Pis are online:
        </p>

        <div className="space-y-2 font-mono text-xs">
          {apiEndpoints.map((ep, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center justify-between p-2.5 rounded-xl bg-[#071221] border border-slate-800 flex-col sm:flex-row gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'GET'
                      ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-slate-100 font-bold">{ep.path}</span>
              </div>
              <span className="text-slate-400 text-[11px] font-sans">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
