import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  placeholder = "Search by Parking ID (e.g. SRM-P01), Name, or Slot ID (e.g. P01-S042)..."
}) => {
  const filterOptions = [
    { value: 'ALL', label: 'All Zones' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'LIMITED', label: 'Limited' },
    { value: 'FULL', label: 'Full' },
    { value: 'OFFLINE', label: 'Offline' }
  ];

  const sortOptions = [
    { value: 'MOST_AVAILABLE', label: 'Most Available Spaces' },
    { value: 'LEAST_OCCUPIED', label: 'Least Occupied' },
    { value: 'MOST_OCCUPIED', label: 'Highest Occupancy' },
    { value: 'PARKING_ID', label: 'Parking ID (P01 - P06)' }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0D1B30]/90 border border-slate-800 p-3.5 rounded-2xl shadow-lg">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Status Filter Buttons */}
        <div className="flex items-center bg-[#081220] p-1 rounded-xl border border-slate-700/80 overflow-x-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === opt.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center bg-[#081220] border border-slate-700/80 rounded-xl px-3 py-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-2"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0D1B30] text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
