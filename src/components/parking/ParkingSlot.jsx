import React from 'react';
import { Car, Zap, Accessibility, ShieldCheck, Check } from 'lucide-react';

const ParkingSlot = ({ slot, isHighlighted, isRecentlyChanged, onSelect }) => {
  const isOccupied = slot.isOccupied;
  const isEv = slot.type === 'ev';
  const isAccessible = slot.type === 'accessible';
  const isFaculty = slot.type === 'faculty';

  // Format short display: e.g. S001 from P01-S001
  const shortSlotNumber = slot.id.split('-')[1] || `S${String(slot.slotNumber).padStart(3, '0')}`;

  return (
    <div
      onClick={() => onSelect(slot)}
      title={`${slot.id} • ${isOccupied ? `Occupied: ${slot.vehicle?.licensePlate || 'Vehicle'}` : 'AVAILABLE (Free)'}`}
      className={`relative group cursor-pointer rounded-lg p-1.5 sm:p-2 border transition-all duration-200 flex flex-col items-center justify-between text-center select-none ${
        isHighlighted
          ? 'ring-2 ring-cyan-400 scale-105 z-20 shadow-lg shadow-cyan-500/40 bg-cyan-950/80 border-cyan-400'
          : isOccupied
          ? 'bg-[#181829]/90 border-slate-700/80 hover:border-amber-400/80 text-amber-300'
          : 'bg-[#0A231F]/80 border-emerald-500/40 hover:border-emerald-400 hover:bg-[#0E352F] text-emerald-400'
      } ${
        isRecentlyChanged
          ? isOccupied
            ? 'slot-enter-pulse'
            : 'slot-exit-pulse'
          : ''
      }`}
    >
      {/* Top Slot Header: Number & Type Icons */}
      <div className="w-full flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono font-bold tracking-tight text-slate-300">
          {shortSlotNumber}
        </span>

        <div className="flex items-center gap-0.5">
          {isEv && (
            <Zap className="w-2.5 h-2.5 text-cyan-400" title="EV Fast Charging Station" />
          )}
          {isAccessible && (
            <Accessibility className="w-2.5 h-2.5 text-blue-400" title="Accessible Parking" />
          )}
          {isFaculty && (
            <ShieldCheck className="w-2.5 h-2.5 text-amber-400" title="Faculty Reserved" />
          )}
        </div>
      </div>

      {/* Center Icon: Car or Open Slot Indicator */}
      <div className="my-1 flex items-center justify-center">
        {isOccupied ? (
          <div className="relative">
            <Car className="w-5 h-5 text-amber-400/90 transform -rotate-90 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full border border-emerald-500/50 bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Bottom Status text */}
      <div className="w-full">
        <span
          className={`text-[9px] font-mono font-bold block truncate uppercase ${
            isOccupied ? 'text-amber-400/90' : 'text-emerald-400'
          }`}
        >
          {isOccupied ? 'Occupied' : 'Free'}
        </span>
      </div>

      {/* Hover Tooltip Preview */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 pointer-events-none w-36 p-2 rounded-lg bg-[#071324] border border-slate-700 shadow-xl text-left">
        <div className="text-[10px] font-mono font-bold text-cyan-300">
          {slot.id}
        </div>
        <div className="text-[9px] text-slate-300 mt-0.5">
          {isOccupied ? (
            <>
              <div className="font-mono text-amber-300 font-bold truncate">
                {slot.vehicle?.licensePlate}
              </div>
              <div className="text-slate-400 truncate">{slot.vehicle?.model}</div>
              <div className="text-[8px] text-slate-400 mt-0.5">
                Parked {slot.vehicle?.parkedDurationMinutes}m ago
              </div>
            </>
          ) : (
            <span className="text-emerald-400 font-semibold">Available to Park</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingSlot;
