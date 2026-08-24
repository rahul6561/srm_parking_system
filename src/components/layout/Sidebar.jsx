import React from 'react';
import { NavLink } from 'react-router-dom';
import { useParkingData } from '../../context/ParkingContext';
import { 
  LayoutDashboard, 
  Car, 
  Radio, 
  History, 
  Cpu, 
  Settings, 
  Zap, 
  Layers, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { campusSummary, parkingAreas } = useParkingData();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/parking-areas',
      label: 'Parking Areas',
      icon: Layers,
      badge: '6 Areas'
    },
    {
      to: '/live-monitoring',
      label: 'Live Monitoring',
      icon: Radio,
      badge: 'LIVE',
      badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
    },
    {
      to: '/activity',
      label: 'Entry / Exit Logs',
      icon: History,
      badge: `${campusSummary.totalEntriesToday + campusSummary.totalExitsToday}`
    },
    {
      to: '/sensors',
      label: 'Sensor Nodes',
      icon: Cpu,
      badge: `${campusSummary.onlineSensorsCount}/6`
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30 h-full lg:h-[calc(100vh-61px)] w-64 bg-[#0A1424] border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation List */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="px-3 pt-2">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Management Portal
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400/80 group-hover:text-cyan-300 transition-colors" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.badgeClass || 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Parking Area Jumps */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Quick Jump (Zones)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">150 ea</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {parkingAreas.map((area) => {
                const isFull = area.occupied >= area.capacity;
                const isAvail = area.occupied < 120;
                return (
                  <NavLink
                    key={area.id}
                    to={`/parking/${area.id}`}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `px-2.5 py-2 rounded-lg border text-left transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#081220] border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span>{area.id}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isFull ? 'bg-rose-500' : isAvail ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {area.available} free
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Campus Health Widget */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#0F1E36] to-[#0B172A] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Campus Load
            </span>
            <span className="font-mono font-bold text-cyan-400">
              {campusSummary.occupancyPercentage}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                campusSummary.occupancyPercentage > 85
                  ? 'bg-rose-500'
                  : campusSummary.occupancyPercentage > 65
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${campusSummary.occupancyPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
            <span>{campusSummary.totalOccupied} Occ</span>
            <span>{campusSummary.totalAvailable} Avail</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
