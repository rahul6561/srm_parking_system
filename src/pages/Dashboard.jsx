import React from 'react';
import { useParkingData } from '../context/ParkingContext';
import AvailableSpacesBanner from '../components/dashboard/AvailableSpacesBanner';
import SummaryCards from '../components/dashboard/SummaryCards';
import BestAvailableCard from '../components/dashboard/BestAvailableCard';
import AvailableParkingList from '../components/dashboard/AvailableParkingList';
import ParkingMap from '../components/dashboard/ParkingMap';
import ParkingCard from '../components/dashboard/ParkingCard';
import SensorSummaryWidget from '../components/dashboard/SensorSummaryWidget';
import RecentActivityWidget from '../components/dashboard/RecentActivityWidget';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { parkingAreas, loading } = useParkingData();

  if (loading && parkingAreas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-cyan-400">Loading SRM Smart Parking telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Hero Availability Banner */}
      <AvailableSpacesBanner />

      {/* 2. Key Summary KPI Metrics */}
      <section aria-labelledby="summary-kpis">
        <SummaryCards />
      </section>

      {/* 3. Free Parking Detection & Best Recommendation */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <BestAvailableCard />
        </div>
        <div className="lg:col-span-6">
          <AvailableParkingList />
        </div>
      </section>

      {/* 4. Schematic Campus Parking Map */}
      <section>
        <ParkingMap />
      </section>

      {/* 5. 6 Parking Areas Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Campus Parking Zones (6 Areas • 900 Slots)
              </h2>
              <p className="text-xs text-slate-400">
                Click any zone card to inspect detailed 150-slot layout
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            SRM-P01 to SRM-P06
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parkingAreas.map((area) => (
            <ParkingCard key={area.id} area={area} />
          ))}
        </div>
      </section>

      {/* 6. Hardware Sensor Monitoring & Recent Activity Stream */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SensorSummaryWidget />
        </div>
        <div className="lg:col-span-6">
          <RecentActivityWidget />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
