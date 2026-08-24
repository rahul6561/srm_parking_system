import React from 'react';
import Modal from '../common/Modal';
import { 
  Car, 
  Clock, 
  MapPin, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowRightLeft,
  UserCheck
} from 'lucide-react';
import { formatTimeAgo } from '../../utils/parkingUtils';

const SlotDetailModal = ({ slot, area, isOpen, onClose, onToggleOccupancy }) => {
  if (!slot || !area) return null;

  const isOccupied = slot.isOccupied;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-bold">{slot.id}</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-white text-sm font-semibold">{area.name}</span>
        </div>
      }
      subtitle={`Lane ${slot.lane} • ${slot.bay} • SRM Smart Sensor Gate`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Status Highlight Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isOccupied
              ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isOccupied ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {isOccupied ? <Car className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider">
                Current Status
              </div>
              <div className="text-base font-extrabold font-mono">
                {isOccupied ? 'OCCUPIED' : 'AVAILABLE (FREE)'}
              </div>
            </div>
          </div>

          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
              isOccupied ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {slot.type} Spot
          </span>
        </div>

        {/* Vehicle / Telemetry Info */}
        {isOccupied && slot.vehicle ? (
          <div className="bg-[#081220] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Parked Vehicle Details</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">License Plate</span>
                <p className="font-mono font-bold text-cyan-300 text-sm mt-0.5">
                  {slot.vehicle.licensePlate}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Vehicle Model</span>
                <p className="font-semibold text-slate-200 text-sm mt-0.5">
                  {slot.vehicle.model}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Driver Category</span>
                <p className="font-medium text-slate-300 mt-0.5">
                  {slot.vehicle.driverCategory || 'Campus Visitor'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Parked Duration</span>
                <p className="font-mono text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{slot.vehicle.parkedDurationMinutes} mins</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#081220] border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-300">
            <p className="font-semibold text-emerald-400">
              This space is currently vacant and ready for vehicle parking.
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Ultrasonic and magnetic ground loop sensors detect immediate parking.
            </p>
          </div>
        )}

        {/* Slot Attributes */}
        <div className="bg-[#081220] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-400 text-[10px] block">PARKING ZONE</span>
            <span className="font-bold text-white">{area.id}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">AISLE / LANE</span>
            <span className="font-bold text-white">Lane {slot.lane}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">CHARGER</span>
            <span className="font-bold text-cyan-400">
              {slot.type === 'ev' ? 'Fast 22kW' : 'None'}
            </span>
          </div>
        </div>

        {/* Interactive Simulation Override Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onToggleOccupancy(area.id, slot.id, !isOccupied);
              onClose();
            }}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
              isOccupied
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>
              {isOccupied
                ? 'Simulate Vehicle Exit (Vacate Slot)'
                : 'Simulate Vehicle Entry (Park in this Slot)'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SlotDetailModal;
