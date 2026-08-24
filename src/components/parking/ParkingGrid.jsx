import React, { useState, useMemo } from 'react';
import ParkingSlot from './ParkingSlot';
import SlotDetailModal from './SlotDetailModal';
import { 
  Search, 
  Filter, 
  Car, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const ParkingGrid = ({ area, lastChangedSlotId, onToggleOccupancy }) => {
  const [filterType, setFilterType] = useState('ALL'); // ALL, FREE, OCCUPIED, EV
  const [slotSearch, setSlotSearch] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = area.slots || [];

  // Filter slots based on state/search
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Search by ID or plate
      if (slotSearch) {
        const query = slotSearch.toLowerCase().trim();
        const matchesId = slot.id.toLowerCase().includes(query);
        const matchesPlate = slot.vehicle?.licensePlate?.toLowerCase().includes(query);
        if (!matchesId && !matchesPlate) return false;
      }

      if (filterType === 'FREE') return !slot.isOccupied;
      if (filterType === 'OCCUPIED') return slot.isOccupied;
      if (filterType === 'EV') return slot.type === 'ev';
      return true;
    });
  }, [slots, filterType, slotSearch]);

  // Group slots by 5 Lanes: A, B, C, D, E (30 slots per lane)
  const lanes = useMemo(() => {
    const laneMap = { A: [], B: [], C: [], D: [], E: [] };
    filteredSlots.forEach((slot) => {
      const laneKey = slot.lane || 'A';
      if (laneMap[laneKey]) {
        laneMap[laneKey].push(slot);
      } else {
        laneMap[laneKey] = [slot];
      }
    });
    return laneMap;
  }, [filteredSlots]);

  const freeCount = slots.filter((s) => !s.isOccupied).length;
  const occupiedCount = slots.filter((s) => s.isOccupied).length;
  const evCount = slots.filter((s) => s.type === 'ev').length;

  return (
    <div className="space-y-6">
      {/* Grid Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0D1B30]/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        {/* Search Slot ID */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={slotSearch}
            onChange={(e) => setSlotSearch(e.target.value)}
            placeholder={`Search slot (e.g. ${area.id.replace('SRM-', '')}-S042 or license plate)...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#081220] border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              filterType === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-[#081220] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All (150)
          </button>

          <button
            onClick={() => setFilterType('FREE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'FREE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#081220] text-slate-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Free ({freeCount})</span>
          </button>

          <button
            onClick={() => setFilterType('OCCUPIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'OCCUPIED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#081220] text-slate-400 hover:text-amber-300 border border-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Occupied ({occupiedCount})</span>
          </button>

          <button
            onClick={() => setFilterType('EV')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              filterType === 'EV'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-[#081220] text-slate-400 hover:text-blue-300 border border-slate-800'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>EV Fast ({evCount})</span>
          </button>
        </div>
      </div>

      {/* 150-Slot Multi-Lane Layout */}
      <div className="bg-[#091526]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* Driveway Gate Markers */}
        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 bg-[#06101D] p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GATE ENTRY SENSOR A (RFID + LOOP)</span>
          </div>
          <div className="text-slate-400 hidden sm:block">
            DRIVE SPEED LIMIT: 10 KM/H
          </div>
          <div className="flex items-center gap-2 text-rose-400">
            <span>GATE EXIT SENSOR B</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Lanes Render */}
        {Object.entries(lanes).map(([laneKey, laneSlots]) => {
          if (laneSlots.length === 0) return null;

          return (
            <div
              key={laneKey}
              className="bg-[#0B1A2F]/70 border border-slate-800/70 rounded-xl p-3.5 sm:p-4 space-y-2.5"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/30 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold">
                    {laneKey}
                  </span>
                  <span className="font-bold text-slate-200">
                    LANE {laneKey} • Bays ({laneSlots[0]?.id.split('-')[1]} – {laneSlots[laneSlots.length - 1]?.id.split('-')[1]})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="text-emerald-400">
                    {laneSlots.filter((s) => !s.isOccupied).length} Free
                  </span>
                  <span>/</span>
                  <span>{laneSlots.length} Total</span>
                </div>
              </div>

              {/* Slots Grid: Compact, Responsive 10-column or 15-column layout */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-1.5">
                {laneSlots.map((slot) => (
                  <ParkingSlot
                    key={slot.id}
                    slot={slot}
                    isHighlighted={
                      slotSearch &&
                      (slot.id.toLowerCase().includes(slotSearch.toLowerCase()) ||
                        slot.vehicle?.licensePlate?.toLowerCase().includes(slotSearch.toLowerCase()))
                    }
                    isRecentlyChanged={lastChangedSlotId === slot.id}
                    onSelect={(s) => setSelectedSlot(s)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredSlots.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No parking slots matched your filter or search query.</p>
            <button
              onClick={() => {
                setFilterType('ALL');
                setSlotSearch('');
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Inspection & Simulator Modal */}
      {selectedSlot && (
        <SlotDetailModal
          slot={selectedSlot}
          area={area}
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onToggleOccupancy={onToggleOccupancy}
        />
      )}
    </div>
  );
};

export default ParkingGrid;
