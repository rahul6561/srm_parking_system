import React, { useState, useEffect } from 'react';
import { useParkingData } from '../../context/ParkingContext';
import { 
  Wifi, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Menu, 
  User, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
  const { 
    campusSummary, 
    isSimulating, 
    setIsSimulating, 
    simulationSpeed, 
    setSimulationSpeed, 
    resetAllData 
  } = useParkingData();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="sticky top-0 z-40 w-full bg-[#081220]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu & Branding */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* SRM Logo Badge */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 border border-blue-500/40 shadow-lg shadow-blue-950/50 group">
              <div className="font-extrabold text-xs tracking-tighter text-amber-400 font-mono">
                SRM
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#081220]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                  SRM Smart Parking
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
                  v2.4 IoT Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Campus Parking Management System
              </p>
            </div>
          </div>
        </div>

        {/* Center Section: Live Clock & System Status */}
        <div className="hidden md:flex items-center gap-5">
          {/* Status Badges */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0C192E] border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>System Online</span>
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span>
                Sensor Connected ({campusSummary.onlineSensorsCount}/6)
              </span>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="text-right border-l border-slate-800 pl-4">
            <div className="text-xs font-mono font-bold text-slate-200 tracking-wider">
              {formattedTime}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Right Section: Live Simulator Controls & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Simulator Bar */}
          <div className="flex items-center bg-[#0C192E] border border-slate-700/60 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                isSimulating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
              title={isSimulating ? 'Pause Live IoT Sensor Simulation' : 'Resume Live IoT Sensor Simulation'}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paused</span>
                </>
              )}
            </button>

            {/* Speed Options */}
            <div className="hidden sm:flex items-center ml-1 border-l border-slate-800 pl-1 text-[11px]">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded font-mono font-semibold transition-colors ${
                    simulationSpeed === speed
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Simulation Speed ${speed}x`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetAllData}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ml-1"
              title="Reset Simulation to Initial Values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md border border-cyan-400/30">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Admin Gate</div>
              <div className="text-[10px] text-slate-400">SRM Security</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
