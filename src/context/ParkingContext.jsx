import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as parkingService from '../services/parkingService';
import { calculateCampusSummary, getBestAvailableParking } from '../utils/parkingUtils';

const ParkingContext = createContext(null);

export const ParkingProvider = ({ children }) => {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1 = 3.5s, 2 = 2s, 5 = 1s
  const [toasts, setToasts] = useState([]);
  const [lastChangedSlotId, setLastChangedSlotId] = useState(null);

  // Initialize data from service
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const areas = await Promise.all(
        ['SRM-P01', 'SRM-P02', 'SRM-P03', 'SRM-P04', 'SRM-P05', 'SRM-P06'].map(id =>
          parkingService.getParkingAreaById(id)
        )
      );
      const activity = await parkingService.getRecentActivity(30);
      setParkingAreas(areas);
      setActivityLogs(activity);
    } catch (err) {
      console.error('Error loading initial parking data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast notification helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [{ id, ...toast }, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Trigger manual or simulated entry
  const triggerEntry = useCallback(async (areaId, slotId = null) => {
    try {
      const result = await parkingService.simulateVehicleEntry(areaId, slotId);
      if (result && result.success) {
        setParkingAreas((prev) =>
          prev.map((a) => (a.id === areaId ? result.area : a))
        );
        setActivityLogs((prev) => [result.activity, ...prev.slice(0, 49)]);
        setLastChangedSlotId(result.slot.id);

        addToast({
          type: 'ENTRY',
          title: `Vehicle Entered • ${areaId}`,
          message: `${result.activity.vehicleModel} (${result.activity.licensePlate}) parked at slot ${result.slot.id}`,
          timestamp: new Date().toLocaleTimeString()
        });
        return result;
      }
    } catch (err) {
      console.error('Error triggering vehicle entry:', err);
    }
  }, [addToast]);

  // Trigger manual or simulated exit
  const triggerExit = useCallback(async (areaId, slotId = null) => {
    try {
      const result = await parkingService.simulateVehicleExit(areaId, slotId);
      if (result && result.success) {
        setParkingAreas((prev) =>
          prev.map((a) => (a.id === areaId ? result.area : a))
        );
        setActivityLogs((prev) => [result.activity, ...prev.slice(0, 49)]);
        setLastChangedSlotId(result.slot.id);

        addToast({
          type: 'EXIT',
          title: `Vehicle Exited • ${areaId}`,
          message: `${result.activity.vehicleModel} departed from slot ${result.slot.id}. Slot is now free.`,
          timestamp: new Date().toLocaleTimeString()
        });
        return result;
      }
    } catch (err) {
      console.error('Error triggering vehicle exit:', err);
    }
  }, [addToast]);

  // Toggle sensor online/offline status
  const toggleSensor = useCallback(async (areaId) => {
    const updated = await parkingService.toggleAreaSensor(areaId);
    if (updated) {
      setParkingAreas((prev) =>
        prev.map((a) => (a.id === areaId ? updated : a))
      );
      addToast({
        type: 'SENSOR',
        title: `Sensor Node ${updated.sensorStatus === 'Connected' ? 'Online' : 'Offline'}`,
        message: `${updated.id} (${updated.name}) is now ${updated.sensorStatus}.`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }, [addToast]);

  // Reset all simulation data
  const resetAllData = useCallback(() => {
    const reset = parkingService.resetParkingData();
    setParkingAreas(reset);
    setActivityLogs(parkingService.getRecentActivity());
    addToast({
      type: 'INFO',
      title: 'Simulation Reset',
      message: 'All 6 parking areas and sensor counters have been reset to default state.',
      timestamp: new Date().toLocaleTimeString()
    });
  }, [addToast]);

  // Real-time Simulation Engine
  useEffect(() => {
    if (!isSimulating || loading || parkingAreas.length === 0) return;

    const intervalTime = simulationSpeed === 5 ? 1200 : simulationSpeed === 2 ? 2200 : 3800;

    const interval = setInterval(() => {
      // Pick random parking area
      const randomArea = parkingAreas[Math.floor(Math.random() * parkingAreas.length)];
      if (!randomArea || randomArea.sensorStatus !== 'Connected') return;

      // 55% chance entry, 45% chance exit (depending on occupancy)
      const occupancyRatio = randomArea.occupied / randomArea.capacity;
      const isEntry = occupancyRatio < 0.2 ? true : occupancyRatio > 0.9 ? false : Math.random() > 0.45;

      if (isEntry && randomArea.occupied < randomArea.capacity) {
        triggerEntry(randomArea.id);
      } else if (!isEntry && randomArea.occupied > 0) {
        triggerExit(randomArea.id);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, loading, parkingAreas, triggerEntry, triggerExit]);

  // Computed summary metrics
  const campusSummary = useMemo(() => {
    return calculateCampusSummary(parkingAreas);
  }, [parkingAreas]);

  // Computed best parking spot
  const bestAvailable = useMemo(() => {
    return getBestAvailableParking(parkingAreas);
  }, [parkingAreas]);

  const value = {
    parkingAreas,
    activityLogs,
    loading,
    campusSummary,
    bestAvailable,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    toasts,
    removeToast,
    triggerEntry,
    triggerExit,
    toggleSensor,
    resetAllData,
    lastChangedSlotId,
    loadData
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export const useParkingData = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingData must be used within a ParkingProvider');
  }
  return context;
};
