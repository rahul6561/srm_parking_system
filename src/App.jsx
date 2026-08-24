import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ParkingAreas from './pages/ParkingAreas';
import ParkingDetails from './pages/ParkingDetails';
import LiveMonitoring from './pages/LiveMonitoring';
import Activity from './pages/Activity';
import Sensors from './pages/Sensors';
import Settings from './pages/Settings';

function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="parking-areas" element={<ParkingAreas />} />
            <Route path="parking/:id" element={<ParkingDetails />} />
            <Route path="live-monitoring" element={<LiveMonitoring />} />
            <Route path="activity" element={<Activity />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}

export default App;
