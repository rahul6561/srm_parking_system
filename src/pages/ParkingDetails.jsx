import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useParkingData } from '../context/ParkingContext';
import ParkingGrid from '../components/parking/ParkingGrid';
import StatusBadge from '../components/common/StatusBadge';
import { STATUS_CONFIG, formatTimeAgo } from '../utils/parkingUtils';
import { 
  ArrowLeft, 
  MapPin, 
  Cpu, 
  Clock, 
  Car, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Play, 
  Plus, 
  Minus,
  RotateCcw,
  Layers,
  AlertTriangle
} from 'lucide-react';

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    parkingAreas, 
    lastChangedSlotId, 
    triggerEntry, 
    triggerExit, 
    toggleSensor 
  } = useParkingData();

  // Find target area or default to first area (SRM-P01)
  const currentAreaId = id ? id.toUpperCase() : 'SRM-P01';
  const area = parkingAreas.find((a) => a.id.toUpperCase() === currentAreaId) || parkingAreas[0];

  if (!area) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">Parking Area Not Found</h2>
        <Link to="/parking-areas" className="mt-4 inline-block text-cyan-400 font-bold underline">
          Return to Parking Areas
        </Link>
      </div>
    );
  }

  const isFull = area.occupied >= area.capacity;
  const isEmpty = area.occupied === 0;
  const config = STATUS_CONFIG[area.status] || STATUS_CONFIG.AVAILABLE;

  const handleToggleOccupancy = (areaId, slotId, shouldOccupy) => {
    if (shouldOccupy) {
      triggerEntry(areaId, slotId);
    } else {
      triggerExit(areaId, slotId);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Quick Zone Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/parking-areas')}
            className="p-2 rounded-xl bg-[#0D1B30] border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Areas</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {area.id}
              </h1>
              <StatusBadge status={area.status} size="md" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {area.name} • {area.zone}
            </p>
          </div>
        </div>

        {/* 6 Zone Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full bg-[#0D1B30] p-1.5 rounded-2xl border border-slate-800">
          {parkingAreas.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/parking/${p.id}`)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                p.id === area.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {p.id.replace('SRM-', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Special State Alerts */}
      {isEmpty && (
        <div className="py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center uppercase tracking-wider flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>ALL SPACES AVAILABLE (150 OF 150 FREE)</span>
        </div>
      )}

      {isFull && (
        <div className="py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold text-center uppercase tracking-wider flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>PARKING FULL (150 OF 150 OCCUPIED)</span>
        </div>
      )}

      {/* Hero Stats & Sensor Info Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Capacity */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Capacity</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
            {area.capacity}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Fixed 150 Bays</p>
        </div>

        {/* Occupied Spaces */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Occupied Spaces</div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1">
            {area.occupied}
          </div>
          <p className="text-[10px] text-amber-300/80 mt-0.5">Vehicles Parked</p>
        </div>

        {/* Free Spaces */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Free Spaces</div>
          <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${area.available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {area.available}
          </div>
          <p className="text-[10px] text-emerald-300/80 mt-0.5">Ready for Entry</p>
        </div>

        {/* Occupancy % */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Occupancy Rate</div>
          <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${config.textClass}`}>
            {area.occupancyPercentage}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Current Fill Rate</p>
        </div>

        {/* Sensor Status */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Sensor Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                area.sensorStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-sm font-bold text-slate-200">
              {area.sensorStatus}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">
            {area.hardware?.rpiId || 'RPi-4B Node'}
          </p>
        </div>

        {/* Last Updated */}
        <div className="rounded-xl bg-[#0D1B30]/90 border border-slate-800 p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Last Telemetry</div>
          <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTimeAgo(area.lastUpdated)}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Ping: {area.hardware?.lastSignalMs || 650}ms
          </p>
        </div>
      </div>

      {/* Manual Interactive Simulator Control Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#0A1628] border border-cyan-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Play className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Manual Sensor Test Controller
            </h3>
            <p className="text-[11px] text-slate-400">
              Trigger vehicle entry or exit events directly on {area.id} to test live slot state changes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => triggerEntry(area.id)}
            disabled={area.occupied >= area.capacity}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Entry (+1)</span>
          </button>

          <button
            onClick={() => triggerExit(area.id)}
            disabled={area.occupied <= 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Simulate Exit (-1)</span>
          </button>

          <button
            onClick={() => toggleSensor(area.id)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
            title="Toggle Sensor Online/Offline"
          >
            <Cpu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 150-Slot Interactive Grid Component */}
      <section>
        <ParkingGrid
          area={area}
          lastChangedSlotId={lastChangedSlotId}
          onToggleOccupancy={handleToggleOccupancy}
        />
      </section>
    </div>
  );
};

export default ParkingDetails;
