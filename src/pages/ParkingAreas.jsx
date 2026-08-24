import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../context/ParkingContext';
import SearchFilter from '../components/common/SearchFilter';
import ParkingCard from '../components/dashboard/ParkingCard';
import StatusBadge from '../components/common/StatusBadge';
import { 
  Layers, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  Zap, 
  MapPin, 
  Cpu, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const ParkingAreas = () => {
  const { parkingAreas } = useParkingData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('MOST_AVAILABLE');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter & Sort
  const processedAreas = useMemo(() => {
    let result = [...parkingAreas];

    // Search filter: ID, Name, or Slot ID match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((area) => {
        const matchesId = area.id.toLowerCase().includes(q);
        const matchesName = area.name.toLowerCase().includes(q);
        const matchesZone = area.zone.toLowerCase().includes(q);
        const matchesSlot = area.slots?.some((s) => s.id.toLowerCase().includes(q));
        return matchesId || matchesName || matchesZone || matchesSlot;
      });
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((area) => area.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'MOST_AVAILABLE') {
        return b.available - a.available;
      }
      if (sortBy === 'LEAST_OCCUPIED') {
        return a.occupied - b.occupied;
      }
      if (sortBy === 'MOST_OCCUPIED') {
        return b.occupied - a.occupied;
      }
      if (sortBy === 'PARKING_ID') {
        return a.id.localeCompare(b.id);
      }
      return 0;
    });

    return result;
  }, [parkingAreas, searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Title & View Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                SRM Parking Areas Directory
              </h1>
              <p className="text-xs text-slate-400">
                Manage, filter, and inspect all 6 campus parking zones (150 slots each)
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#0D1B30] border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid View</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table View</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Grid or Table Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedAreas.map((area) => (
            <ParkingCard key={area.id} area={area} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0D1B30]/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1628] text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Zone ID</th>
                  <th className="py-3.5 px-4">Area Name & Campus Zone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Occupied</th>
                  <th className="py-3.5 px-4">Available</th>
                  <th className="py-3.5 px-4">Occupancy %</th>
                  <th className="py-3.5 px-4">Sensor Node</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {processedAreas.map((area) => (
                  <tr
                    key={area.id}
                    onClick={() => navigate(`/parking/${area.id}`)}
                    className="hover:bg-[#081220] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {area.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-bold">{area.name}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{area.zone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={area.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {area.capacity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                      {area.occupied}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {area.available}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${area.occupancyPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300 text-[11px]">
                          {area.occupancyPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {area.sensorStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parking/${area.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white font-bold text-xs transition-colors"
                      >
                        <span>View 150 Slots</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {processedAreas.length === 0 && (
        <div className="text-center py-16 bg-[#0D1B30]/50 rounded-2xl border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No Parking Areas Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No parking zones matched your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ParkingAreas;
