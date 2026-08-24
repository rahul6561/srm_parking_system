/**
 * SRM Smart Parking System - Service / API Layer
 * 
 * Future API Compatibility Layer:
 * When the Raspberry Pi gateway and backend are deployed,
 * replace the internal mock handlers with `fetch('/api/...')` endpoints.
 */

import { INITIAL_PARKING_AREAS, INITIAL_ACTIVITY_LOGS, generateSlotsForArea, getRandomLicensePlate, getRandomVehicle } from '../data/mockParkingData';
import { clampSpaces, getParkingStatus } from '../utils/parkingUtils';

// In-memory data store for the session
let _parkingAreas = INITIAL_PARKING_AREAS.map(area => {
  const slots = generateSlotsForArea(area.id, area.initialOccupied);
  const occupiedCount = slots.filter(s => s.isOccupied).length;
  const availableCount = area.capacity - occupiedCount;
  
  return {
    ...area,
    occupied: occupiedCount,
    available: availableCount,
    occupancyPercentage: parseFloat(((occupiedCount / area.capacity) * 100).toFixed(1)),
    status: getParkingStatus(occupiedCount, area.capacity, area.sensorStatus === 'Connected'),
    lastUpdated: new Date().toISOString(),
    slots: slots
  };
});

let _activityLogs = [...INITIAL_ACTIVITY_LOGS];

/**
 * Fetch all 6 parking areas summary
 * Target Endpoint: GET /api/parking
 */
export const getParkingAreas = async () => {
  // Simulating async network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([..._parkingAreas.map(({ slots, ...rest }) => ({ ...rest }))]);
    }, 50);
  });
};

/**
 * Fetch details for a specific parking area including slots
 * Target Endpoint: GET /api/parking/:id
 */
export const getParkingAreaById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const area = _parkingAreas.find(p => p.id.toUpperCase() === id.toUpperCase());
      if (area) {
        resolve({ ...area });
      } else {
        reject(new Error(`Parking area with ID ${id} not found.`));
      }
    }, 50);
  });
};

/**
 * Fetch slots grid for a specific parking area
 * Target Endpoint: GET /api/parking/:id/slots
 */
export const getParkingSlots = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const area = _parkingAreas.find(p => p.id.toUpperCase() === id.toUpperCase());
      if (area) {
        resolve([...area.slots]);
      } else {
        reject(new Error(`Parking area with ID ${id} not found.`));
      }
    }, 50);
  });
};

/**
 * Fetch sensor hardware status for all areas or single area
 * Target Endpoint: GET /api/sensors or GET /api/sensors/:id
 */
export const getSensorStatus = async (id = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id) {
        const area = _parkingAreas.find(p => p.id.toUpperCase() === id.toUpperCase());
        resolve(area ? { id: area.id, name: area.name, sensorStatus: area.sensorStatus, hardware: area.hardware } : null);
      } else {
        const sensors = _parkingAreas.map(a => ({
          id: a.id,
          name: a.name,
          sensorStatus: a.sensorStatus,
          hardware: a.hardware,
          entriesToday: a.entriesToday,
          exitsToday: a.exitsToday,
          lastUpdated: a.lastUpdated
        }));
        resolve(sensors);
      }
    }, 50);
  });
};

/**
 * Fetch recent entry/exit activity logs
 * Target Endpoint: GET /api/activity
 */
export const getRecentActivity = async (limit = 20) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_activityLogs.slice(0, limit));
    }, 50);
  });
};

/**
 * Simulate Vehicle Entry
 * Target Endpoint: POST /api/parking/:id/entry
 */
export const simulateVehicleEntry = async (areaId, targetSlotId = null) => {
  const areaIndex = _parkingAreas.findIndex(a => a.id === areaId);
  if (areaIndex === -1) return null;

  const area = _parkingAreas[areaIndex];
  if (area.occupied >= area.capacity) {
    return { success: false, message: 'Parking Area is FULL (150/150)' };
  }

  let slotToOccupy = null;
  if (targetSlotId) {
    slotToOccupy = area.slots.find(s => s.id === targetSlotId && !s.isOccupied);
  } else {
    // Pick random available slot
    const freeSlots = area.slots.filter(s => !s.isOccupied);
    if (freeSlots.length > 0) {
      slotToOccupy = freeSlots[Math.floor(Math.random() * freeSlots.length)];
    }
  }

  if (!slotToOccupy) return { success: false, message: 'No available slot found.' };

  const plate = getRandomLicensePlate();
  const model = getRandomVehicle();
  
  // Update slot
  slotToOccupy.isOccupied = true;
  slotToOccupy.vehicle = {
    licensePlate: plate,
    model: model,
    parkedAt: new Date().toISOString(),
    parkedDurationMinutes: 1,
    driverCategory: slotToOccupy.type === 'faculty' ? 'Faculty Staff' : 'Student / Visitor'
  };

  // Update area counters
  area.occupied = clampSpaces(area.occupied + 1, area.capacity);
  area.available = Math.max(0, area.capacity - area.occupied);
  area.occupancyPercentage = parseFloat(((area.occupied / area.capacity) * 100).toFixed(1));
  area.status = getParkingStatus(area.occupied, area.capacity, area.sensorStatus === 'Connected');
  area.entriesToday += 1;
  area.lastUpdated = new Date().toISOString();
  if (area.hardware) {
    area.hardware.lastSignalMs = Math.floor(Math.random() * 800) + 100;
  }

  const activityItem = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    type: 'ENTRY',
    areaId: area.id,
    slotId: slotToOccupy.id,
    licensePlate: plate,
    vehicleModel: model,
    timestamp: new Date().toISOString(),
    status: 'Verified Entry',
    gate: `${area.name} Sensor Gate`
  };

  _activityLogs.unshift(activityItem);
  if (_activityLogs.length > 100) _activityLogs.pop();

  return { success: true, area: { ...area }, slot: { ...slotToOccupy }, activity: activityItem };
};

/**
 * Simulate Vehicle Exit
 * Target Endpoint: POST /api/parking/:id/exit
 */
export const simulateVehicleExit = async (areaId, targetSlotId = null) => {
  const areaIndex = _parkingAreas.findIndex(a => a.id === areaId);
  if (areaIndex === -1) return null;

  const area = _parkingAreas[areaIndex];
  if (area.occupied <= 0) {
    return { success: false, message: 'Parking Area is already EMPTY (0/150)' };
  }

  let slotToVacate = null;
  if (targetSlotId) {
    slotToVacate = area.slots.find(s => s.id === targetSlotId && s.isOccupied);
  } else {
    const occupiedSlots = area.slots.filter(s => s.isOccupied);
    if (occupiedSlots.length > 0) {
      slotToVacate = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
    }
  }

  if (!slotToVacate) return { success: false, message: 'No occupied slot found.' };

  const exitingPlate = slotToVacate.vehicle?.licensePlate || getRandomLicensePlate();
  const exitingModel = slotToVacate.vehicle?.model || getRandomVehicle();

  // Clear slot
  slotToVacate.isOccupied = false;
  slotToVacate.vehicle = null;

  // Update area counters
  area.occupied = clampSpaces(area.occupied - 1, area.capacity);
  area.available = Math.max(0, area.capacity - area.occupied);
  area.occupancyPercentage = parseFloat(((area.occupied / area.capacity) * 100).toFixed(1));
  area.status = getParkingStatus(area.occupied, area.capacity, area.sensorStatus === 'Connected');
  area.exitsToday += 1;
  area.lastUpdated = new Date().toISOString();
  if (area.hardware) {
    area.hardware.lastSignalMs = Math.floor(Math.random() * 900) + 100;
  }

  const activityItem = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    type: 'EXIT',
    areaId: area.id,
    slotId: slotToVacate.id,
    licensePlate: exitingPlate,
    vehicleModel: exitingModel,
    timestamp: new Date().toISOString(),
    status: 'Gate Cleared',
    gate: `${area.name} Exit Gate`
  };

  _activityLogs.unshift(activityItem);
  if (_activityLogs.length > 100) _activityLogs.pop();

  return { success: true, area: { ...area }, slot: { ...slotToVacate }, activity: activityItem };
};

/**
 * Toggle Sensor Online/Offline for diagnostics
 */
export const toggleAreaSensor = async (areaId) => {
  const area = _parkingAreas.find(a => a.id === areaId);
  if (!area) return null;

  area.sensorStatus = area.sensorStatus === 'Connected' ? 'Disconnected' : 'Connected';
  area.status = getParkingStatus(area.occupied, area.capacity, area.sensorStatus === 'Connected');
  area.lastUpdated = new Date().toISOString();
  
  return { ...area };
};

/**
 * Reset all parking areas to initial defaults
 */
export const resetParkingData = () => {
  _parkingAreas = INITIAL_PARKING_AREAS.map(area => {
    const slots = generateSlotsForArea(area.id, area.initialOccupied);
    const occupiedCount = slots.filter(s => s.isOccupied).length;
    return {
      ...area,
      occupied: occupiedCount,
      available: area.capacity - occupiedCount,
      occupancyPercentage: parseFloat(((occupiedCount / area.capacity) * 100).toFixed(1)),
      status: getParkingStatus(occupiedCount, area.capacity, area.sensorStatus === 'Connected'),
      lastUpdated: new Date().toISOString(),
      slots: slots
    };
  });
  _activityLogs = [...INITIAL_ACTIVITY_LOGS];
  return _parkingAreas;
};
