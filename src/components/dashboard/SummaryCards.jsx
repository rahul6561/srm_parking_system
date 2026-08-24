import React from 'react';
import { useParkingData } from '../../context/ParkingContext';
import { 
  Building2, 
  Layers, 
  Car, 
  CheckCircle2, 
  Percent, 
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

const SummaryCards = () => {
  const { campusSummary } = useParkingData();

  const cards = [
    {
      title: 'Total Parking Areas',
      value: campusSummary.totalAreas,
      unit: 'Zones',
      subtext: 'SRM-P01 through SRM-P06',
      icon: Layers,
      color: 'blue',
      glow: 'shadow-blue-900/20',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Total Capacity',
      value: campusSummary.totalCapacity,
      unit: 'vehicles',
      subtext: '150 slots per area',
      icon: Building2,
      color: 'indigo',
      glow: 'shadow-indigo-900/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
    },
    {
      title: 'Currently Available',
      value: campusSummary.totalAvailable,
      unit: 'spaces',
      subtext: `${campusSummary.availablePercentage}% free on campus`,
      icon: CheckCircle2,
      color: 'emerald',
      glow: 'shadow-emerald-900/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'Open Spots',
      badgeClass: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      title: 'Currently Occupied',
      value: campusSummary.totalOccupied,
      unit: 'vehicles',
      subtext: `${campusSummary.occupancyPercentage}% current load`,
      icon: Car,
      color: 'amber',
      glow: 'shadow-amber-900/20',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: 'Active Parked',
      badgeClass: 'bg-amber-500/20 text-amber-300'
    },
    {
      title: 'Overall Occupancy',
      value: `${campusSummary.occupancyPercentage}%`,
      unit: '',
      subtext: `${campusSummary.totalOccupied} of 900 in use`,
      icon: Percent,
      color: 'cyan',
      glow: 'shadow-cyan-900/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      badge: campusSummary.occupancyPercentage > 80 ? 'Heavy Load' : 'Moderate',
      badgeClass: campusSummary.occupancyPercentage > 80 ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl bg-[#0D1B30]/90 border border-slate-800/80 p-4.5 hover:border-slate-700 transition-all duration-200 shadow-lg ${card.glow}`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              {card.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${card.badgeClass}`}>
                  {card.badge}
                </span>
              )}
            </div>

            <div className="mt-3.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {card.title}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-medium text-slate-400">
                    {card.unit}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
