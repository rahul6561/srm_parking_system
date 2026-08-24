/**
 * Parking System Utilities & Helper Functions
 */

export const TOTAL_CAPACITY_PER_AREA = 150;
export const TOTAL_AREAS_COUNT = 6;
export const TOTAL_CAMPUS_CAPACITY = TOTAL_CAPACITY_PER_AREA * TOTAL_AREAS_COUNT; // 900

/**
 * Ensures occupied spaces stay strictly between 0 and 150
 */
export const clampSpaces = (val, max = TOTAL_CAPACITY_PER_AREA) => {
  return Math.max(0, Math.min(val, max));
};

/**
 * Calculates status string based on occupancy percentage and sensor state
 */
export const getParkingStatus = (occupied, capacity = TOTAL_CAPACITY_PER_AREA, isSensorOnline = true) => {
  if (!isSensorOnline) return 'OFFLINE';
  
  const clampedOccupied = clampSpaces(occupied, capacity);
  if (clampedOccupied >= capacity) return 'FULL';
  
  const percentage = (clampedOccupied / capacity) * 100;
  if (percentage >= 80) return 'LIMITED';
  return 'AVAILABLE';
};

/**
 * Status color maps and tailwind styling classes
 */
export const STATUS_CONFIG = {
  AVAILABLE: {
    label: 'AVAILABLE',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    borderClass: 'border-emerald-500/40',
    glowClass: 'glow-available',
    bgLight: 'bg-emerald-950/20',
    progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    textClass: 'text-emerald-400',
    description: 'Plenty of parking spaces available'
  },
  LIMITED: {
    label: 'LIMITED',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    dotClass: 'bg-amber-400',
    borderClass: 'border-amber-500/40',
    glowClass: 'glow-limited',
    bgLight: 'bg-amber-950/20',
    progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    textClass: 'text-amber-400',
    description: 'Limited spaces remaining (<20%)'
  },
  FULL: {
    label: 'FULL',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dotClass: 'bg-rose-400',
    borderClass: 'border-rose-500/40',
    glowClass: 'glow-full',
    bgLight: 'bg-rose-950/20',
    progressBar: 'bg-gradient-to-r from-rose-500 to-red-500',
    textClass: 'text-rose-400',
    description: 'Capacity reached — No open spaces'
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: 'slate',
    badgeClass: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    dotClass: 'bg-slate-400',
    borderClass: 'border-slate-500/40',
    glowClass: '',
    bgLight: 'bg-slate-900/30',
    progressBar: 'bg-slate-600',
    textClass: 'text-slate-400',
    description: 'Sensor node unreachable'
  }
};

/**
 * Calculates overall campus summary statistics
 */
export const calculateCampusSummary = (parkingAreas) => {
  if (!parkingAreas || parkingAreas.length === 0) {
    return {
      totalAreas: TOTAL_AREAS_COUNT,
      totalCapacity: TOTAL_CAMPUS_CAPACITY,
      totalOccupied: 0,
      totalAvailable: TOTAL_CAMPUS_CAPACITY,
      occupancyPercentage: 0,
      availablePercentage: 100,
      totalEntriesToday: 0,
      totalExitsToday: 0,
      onlineSensorsCount: 0
    };
  }

  let totalOccupied = 0;
  let totalCapacity = 0;
  let totalEntriesToday = 0;
  let totalExitsToday = 0;
  let onlineSensorsCount = 0;

  parkingAreas.forEach(area => {
    const occ = clampSpaces(area.occupied, area.capacity || TOTAL_CAPACITY_PER_AREA);
    totalOccupied += occ;
    totalCapacity += (area.capacity || TOTAL_CAPACITY_PER_AREA);
    totalEntriesToday += (area.entriesToday || 0);
    totalExitsToday += (area.exitsToday || 0);
    if (area.sensorStatus === 'Connected') {
      onlineSensorsCount++;
    }
  });

  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);
  const occupancyPercentage = totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : '0';
  const availablePercentage = totalCapacity > 0 ? ((totalAvailable / totalCapacity) * 100).toFixed(1) : '100';

  return {
    totalAreas: parkingAreas.length,
    totalCapacity,
    totalOccupied,
    totalAvailable,
    occupancyPercentage: parseFloat(occupancyPercentage),
    availablePercentage: parseFloat(availablePercentage),
    totalEntriesToday,
    totalExitsToday,
    onlineSensorsCount
  };
};

/**
 * Finds the best available parking area (highest free spaces)
 */
export const getBestAvailableParking = (parkingAreas) => {
  if (!parkingAreas || parkingAreas.length === 0) return null;

  const validAreas = parkingAreas
    .filter(a => a.sensorStatus === 'Connected')
    .map(a => ({
      ...a,
      available: Math.max(0, (a.capacity || TOTAL_CAPACITY_PER_AREA) - a.occupied)
    }))
    .sort((a, b) => b.available - a.available);

  return validAreas.length > 0 ? validAreas[0] : parkingAreas[0];
};

/**
 * Formats timestamps into human-readable relative or exact format
 */
export const formatTimeAgo = (isoString) => {
  if (!isoString) return 'Just now';
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(isoString).toLocaleDateString();
};
