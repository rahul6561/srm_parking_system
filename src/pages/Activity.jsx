import React, { useState, useMemo } from 'react';
import { useParkingData } from '../context/ParkingContext';
import { 
  History, 
  Search, 
  Filter, 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  Car, 
  Download, 
  Layers,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatTimeAgo } from '../utils/parkingUtils';

const Activity = () => {
  const { activityLogs, parkingAreas } = useParkingData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // ALL, ENTRY, EXIT
  const [selectedArea, setSelectedArea] = useState('ALL'); // ALL, SRM-P01 .. SRM-P06

  // Filter logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((item) => {
      // Type filter
      if (selectedType !== 'ALL' && item.type !== selectedType) return false;

      // Area filter
      if (selectedArea !== 'ALL' && item.areaId !== selectedArea) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesPlate = item.licensePlate?.toLowerCase().includes(q);
        const matchesModel = item.vehicleModel?.toLowerCase().includes(q);
        const matchesSlot = item.slotId?.toLowerCase().includes(q);
        const matchesArea = item.areaId?.toLowerCase().includes(q);
        if (!matchesPlate && !matchesModel && !matchesSlot && !matchesArea) return false;
      }

      return true;
    });
  }, [activityLogs, selectedType, selectedArea, searchTerm]);

  // Export CSV mock function
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Event ID,Type,Parking Area,Slot ID,License Plate,Vehicle Model,Timestamp,Status\n' +
      filteredLogs
        .map(
          (l) =>
            `${l.id},${l.type},${l.areaId},${l.slotId || ''},${l.licensePlate || ''},${
              l.vehicleModel || ''
            },${l.timestamp},${l.status || ''}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `srm_parking_activity_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalEntries = activityLogs.filter((l) => l.type === 'ENTRY').length;
  const totalExits = activityLogs.filter((l) => l.type === 'EXIT').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Vehicle Entry & Exit Activity Audit
            </h1>
            <p className="text-xs text-slate-400">
              Live audit trail of all campus gate sensors and bay allocations
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Activity (.CSV)</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D1B30]/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Recorded Events</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {activityLogs.length}
            </div>
          </div>
          <History className="w-6 h-6 text-cyan-400/60" />
        </div>

        <div className="p-4 rounded-xl bg-[#0D1B30]/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Inbound Entries</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {totalEntries}
            </div>
          </div>
          <ArrowDownRight className="w-6 h-6 text-emerald-400/60" />
        </div>

        <div className="p-4 rounded-xl bg-[#0D1B30]/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Outbound Exits</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              {totalExits}
            </div>
          </div>
          <ArrowUpRight className="w-6 h-6 text-rose-400/60" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0D1B30]/90 border border-slate-800 p-3.5 rounded-2xl shadow-lg">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by license plate (e.g. TN-09), car model, or slot ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#081220] border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        {/* Filter Types */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#081220] p-1 rounded-xl border border-slate-700/80">
            {['ALL', 'ENTRY', 'EXIT'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  selectedType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Events' : type === 'ENTRY' ? 'Entries (+)' : 'Exits (-)'}
              </button>
            ))}
          </div>

          {/* Area Selector */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-[#081220] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Zones (P01-P06)</option>
            {parkingAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} ({a.name.slice(0, 15)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A1628] text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Parking Zone</th>
                <th className="py-3.5 px-4">Slot Allocated</th>
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Sensor / Gate Node</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium font-mono">
              {filteredLogs.map((log) => {
                const isEntry = log.type === 'ENTRY';
                return (
                  <tr key={log.id} className="hover:bg-[#081220] transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isEntry
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isEntry ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        <span>{log.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-cyan-300">
                      {log.areaId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-800/80 px-2 py-1 rounded text-slate-200 border border-slate-700">
                        {log.slotId || 'General Gate'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{log.licensePlate}</div>
                      <div className="text-slate-400 text-[11px] font-sans font-normal">
                        {log.vehicleModel}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">
                      {log.gate || `${log.areaId} Induction Gate`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      <div>{formatTimeAgo(log.timestamp)}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status || 'Verified'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-semibold">No activity records matched your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
