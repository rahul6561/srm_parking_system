/**
 * SRM Smart Parking System - Initial Mock Data
 * 
 * 6 Parking Areas, 150 Slots Each (Total 900 Slots)
 * Exact IDs: SRM-P01, SRM-P02, SRM-P03, SRM-P04, SRM-P05, SRM-P06
 */

const VEHICLE_MODELS = [
  'Tesla Model 3', 'Hyundai Ioniq 5', 'Tata Nexon EV', 'Honda City',
  'Toyota Innova', 'Mahindra XUV700', 'BMW 3 Series', 'Kia Seltos',
  'Volkswagen Virtus', 'Audi A4', 'Mercedes C-Class', 'Skoda Slavia',
  'MG ZS EV', 'Maruti Grand Vitara', 'Hyundai Creta'
];

const LICENSE_PREFIXES = ['TN-09', 'TN-22', 'TN-01', 'TN-07', 'TN-14', 'TN-19', 'TN-85', 'KA-01', 'AP-03'];

const getRandomLicensePlate = () => {
  const prefix = LICENSE_PREFIXES[Math.floor(Math.random() * LICENSE_PREFIXES.length)];
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${letters}-${num}`;
};

const getRandomVehicle = () => {
  return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};

// Helper to generate 150 slots for a parking area
export const generateSlotsForArea = (areaId, occupiedCount) => {
  const shortId = areaId.replace('SRM-', ''); // e.g. P01
  const slots = [];

  // Indices to occupy
  const occupiedIndices = new Set();
  while (occupiedIndices.size < Math.min(occupiedCount, 150)) {
    occupiedIndices.add(Math.floor(Math.random() * 150));
  }

  for (let i = 1; i <= 150; i++) {
    const slotNumberFormatted = String(i).padStart(3, '0');
    const slotId = `${shortId}-S${slotNumberFormatted}`;
    const isOccupied = occupiedIndices.has(i - 1);
    
    // Assign slot types
    let slotType = 'regular';
    if (i <= 15) slotType = 'ev';          // 15 EV slots
    else if (i <= 25) slotType = 'faculty'; // 10 Faculty reserved
    else if (i <= 35) slotType = 'accessible'; // 10 Accessible

    const parkedMinutes = isOccupied ? Math.floor(10 + Math.random() * 320) : null;

    slots.push({
      id: slotId,
      slotNumber: i,
      areaId: areaId,
      type: slotType,
      isOccupied: isOccupied,
      vehicle: isOccupied ? {
        licensePlate: getRandomLicensePlate(),
        model: getRandomVehicle(),
        parkedAt: new Date(Date.now() - parkedMinutes * 60 * 1000).toISOString(),
        parkedDurationMinutes: parkedMinutes,
        driverCategory: slotType === 'faculty' ? 'Faculty Staff' : (i % 3 === 0 ? 'Student' : 'Campus Visitor')
      } : null,
      lane: String.fromCharCode(65 + Math.floor((i - 1) / 30)), // Lanes A, B, C, D, E (30 slots each)
      bay: `Bay-${Math.ceil((i % 30 || 30) / 10)}`
    });
  }

  return slots;
};

// Initial definition of the 6 SRM parking zones
export const INITIAL_PARKING_AREAS = [
  {
    id: 'SRM-P01',
    name: 'Tech Park North Bay',
    zone: 'North Campus',
    description: 'Direct access to Tech Park, Computing Labs & Bio-Engineering Blocks.',
    coordinates: { x: 22, y: 25 },
    capacity: 150,
    initialOccupied: 87,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P01-GATE',
      ip: '192.168.10.101',
      firmware: 'v2.4.1-srm',
      lastSignalMs: 1200,
      signalDbm: -54,
      uptimeHours: 342,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '38.4°C'
    },
    entriesToday: 142,
    exitsToday: 55,
    evChargersCount: 15,
    accessibleCount: 10
  },
  {
    id: 'SRM-P02',
    name: 'Main Campus Central Hub',
    zone: 'Central Quad',
    description: 'Adjacent to Main Administrative Building, Library & Clock Tower.',
    coordinates: { x: 50, y: 35 },
    capacity: 150,
    initialOccupied: 132,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P02-HUB',
      ip: '192.168.10.102',
      firmware: 'v2.4.1-srm',
      lastSignalMs: 850,
      signalDbm: -48,
      uptimeHours: 512,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '41.1°C'
    },
    entriesToday: 210,
    exitsToday: 78,
    evChargersCount: 15,
    accessibleCount: 10
  },
  {
    id: 'SRM-P03',
    name: 'University Block Plaza',
    zone: 'East Campus',
    description: 'Servicing Architecture, Management Studies & Student Union.',
    coordinates: { x: 78, y: 28 },
    capacity: 150,
    initialOccupied: 54,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P03-PLAZA',
      ip: '192.168.10.103',
      firmware: 'v2.4.0-srm',
      lastSignalMs: 2400,
      signalDbm: -62,
      uptimeHours: 188,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '36.8°C'
    },
    entriesToday: 98,
    exitsToday: 44,
    evChargersCount: 15,
    accessibleCount: 10
  },
  {
    id: 'SRM-P04',
    name: 'Medical College Annex',
    zone: 'South Campus',
    description: 'Dedicated parking for SRM Medical College, Hospital & Research Center.',
    coordinates: { x: 80, y: 72 },
    capacity: 150,
    initialOccupied: 146,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P04-MED',
      ip: '192.168.10.104',
      firmware: 'v2.4.1-srm',
      lastSignalMs: 1100,
      signalDbm: -51,
      uptimeHours: 720,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '39.5°C'
    },
    entriesToday: 284,
    exitsToday: 138,
    evChargersCount: 15,
    accessibleCount: 10
  },
  {
    id: 'SRM-P05',
    name: 'Engineering Complex West',
    zone: 'West Campus',
    description: 'Serving Mechanical, Civil, Aerospace & High-Tech Workshops.',
    coordinates: { x: 20, y: 70 },
    capacity: 150,
    initialOccupied: 71,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P05-ENG',
      ip: '192.168.10.105',
      firmware: 'v2.4.1-srm',
      lastSignalMs: 1600,
      signalDbm: -58,
      uptimeHours: 410,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '37.9°C'
    },
    entriesToday: 135,
    exitsToday: 64,
    evChargersCount: 15,
    accessibleCount: 10
  },
  {
    id: 'SRM-P06',
    name: 'Auditorium & Stadium Bay',
    zone: 'South-West Bay',
    description: 'High-capacity parking for Dr. T.P. Ganesan Auditorium & Sports Complex.',
    coordinates: { x: 50, y: 80 },
    capacity: 150,
    initialOccupied: 108,
    sensorStatus: 'Connected',
    hardware: {
      rpiId: 'RPI-4B-P06-AUD',
      ip: '192.168.10.106',
      firmware: 'v2.4.0-srm',
      lastSignalMs: 1900,
      signalDbm: -65,
      uptimeHours: 290,
      sensorHealth: 'Optimal',
      batteryLevel: 'Mains Powered',
      temperature: '38.0°C'
    },
    entriesToday: 177,
    exitsToday: 69,
    evChargersCount: 15,
    accessibleCount: 10
  }
];

// Initial recent activity events
export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'ACT-901',
    type: 'ENTRY',
    areaId: 'SRM-P01',
    slotId: 'P01-S042',
    licensePlate: 'TN-09-CB-4821',
    vehicleModel: 'Honda City',
    timestamp: new Date(Date.now() - 45 * 1000).toISOString(),
    status: 'Verified Access',
    gate: 'North Gate Sensor #1'
  },
  {
    id: 'ACT-902',
    type: 'EXIT',
    areaId: 'SRM-P03',
    slotId: 'P03-S018',
    licensePlate: 'TN-22-AK-9102',
    vehicleModel: 'Tesla Model 3',
    timestamp: new Date(Date.now() - 110 * 1000).toISOString(),
    status: 'Gate Cleared',
    gate: 'East Gate Sensor #2'
  },
  {
    id: 'ACT-903',
    type: 'ENTRY',
    areaId: 'SRM-P05',
    slotId: 'P05-S093',
    licensePlate: 'TN-01-BH-3319',
    vehicleModel: 'Tata Nexon EV',
    timestamp: new Date(Date.now() - 180 * 1000).toISOString(),
    status: 'Verified Access',
    gate: 'West Gate Sensor #1'
  },
  {
    id: 'ACT-904',
    type: 'EXIT',
    areaId: 'SRM-P02',
    slotId: 'P02-S114',
    licensePlate: 'TN-14-MX-5501',
    vehicleModel: 'Mahindra XUV700',
    timestamp: new Date(Date.now() - 260 * 1000).toISOString(),
    status: 'Gate Cleared',
    gate: 'Central Hub Sensor #1'
  },
  {
    id: 'ACT-905',
    type: 'ENTRY',
    areaId: 'SRM-P04',
    slotId: 'P04-S149',
    licensePlate: 'TN-19-DF-8812',
    vehicleModel: 'Toyota Innova',
    timestamp: new Date(Date.now() - 320 * 1000).toISOString(),
    status: 'Emergency/Staff Pass',
    gate: 'Med Center Sensor #1'
  },
  {
    id: 'ACT-906',
    type: 'EXIT',
    areaId: 'SRM-P06',
    slotId: 'P06-S005',
    licensePlate: 'KA-01-EQ-7721',
    vehicleModel: 'Hyundai Ioniq 5',
    timestamp: new Date(Date.now() - 410 * 1000).toISOString(),
    status: 'Gate Cleared',
    gate: 'Auditorium Bay Sensor #1'
  }
];

export { getRandomLicensePlate, getRandomVehicle };
