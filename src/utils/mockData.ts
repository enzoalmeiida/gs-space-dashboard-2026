export type CargoTelemetryEntry = {
  trackingId: string;
  cargoId: string;
  routeName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  satelliteLink: {
    satelliteId: string;
    connectivityStatus: 'CONNECTED' | 'DEGRADED' | 'OFFLINE';
    signalQuality: number;
  };
  temperatureSeries: {
    timestamp: string;
    temperatureCelsius: number;
  }[];
  climateAnomalies: {
    type: 'HEAT_SPIKE' | 'COLD_FRONT' | 'STORM_CELL';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    routePosition: string;
    detectedAt: string;
    description: string;
  }[];
  latestImageUri?: string;
};

export const mockTelemetryApiResponse = {
  apiVersion: '2026-05-27',
  source: 'cloud-rest-api',
  generatedAt: '2026-05-27T14:32:00.000Z',
  fleetSummary: {
    totalTrackedLoads: 184,
    loadsInTransit: 126,
    loadsDelivered: 48,
    loadsWithAlerts: 10,
    averageSignalStrength: 92,
    connectedFleetRatio: 87,
  },
  operationalStatusBreakdown: [
    { name: 'Conectado', value: 87, color: '#00D2FF', legendFontColor: '#9CA3AF', legendFontSize: 12 },
    { name: 'Degradado', value: 9, color: '#FF8A3D', legendFontColor: '#9CA3AF', legendFontSize: 12 },
    { name: 'Offline', value: 4, color: '#EF4444', legendFontColor: '#9CA3AF', legendFontSize: 12 },
  ],
  routes: ([
    {
      cargoId: 'GS-LOAD-2048',
      trackingId: 'TRK-SEA-001',
      routeName: 'Atlântico Sul -> Europa Ocidental',
      coordinates: [
        { latitude: -23.954, longitude: -46.333 },
        { latitude: -15.7797, longitude: -47.9297 },
        { latitude: -1.2833, longitude: -48.4902 },
        { latitude: 5.6037, longitude: -0.187 },
        { latitude: 51.5072, longitude: -0.1276 },
      ],
      satelliteLink: {
        satelliteId: 'SAT-ORION-11',
        connectivityStatus: 'CONNECTED',
        signalQuality: 96,
      },
      temperatureSeries: [
        { timestamp: '06:00', temperatureCelsius: 18.1 },
        { timestamp: '09:00', temperatureCelsius: 19.4 },
        { timestamp: '12:00', temperatureCelsius: 22.3 },
        { timestamp: '15:00', temperatureCelsius: 24.7 },
        { timestamp: '18:00', temperatureCelsius: 23.5 },
        { timestamp: '21:00', temperatureCelsius: 21.8 },
      ],
        latestImageUri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
      climateAnomalies: [
        {
          type: 'STORM_CELL',
          severity: 'MEDIUM',
          routePosition: 'Setor 03',
          detectedAt: '2026-05-27T11:48:00.000Z',
          description: 'Formação de nuvem convectiva no corredor marítimo norte.',
        },
      ],
    },
    {
      cargoId: 'GS-LOAD-3011',
      trackingId: 'TRK-EU-014',
      routeName: 'Roterdã -> Singapura via corredor orbital',
      coordinates: [
        { latitude: 51.9244, longitude: 4.4777 },
        { latitude: 30.0444, longitude: 31.2357 },
        { latitude: 14.5995, longitude: 120.9842 },
        { latitude: 1.3521, longitude: 103.8198 },
      ],
      satelliteLink: {
        satelliteId: 'SAT-NEBULA-04',
        connectivityStatus: 'DEGRADED',
        signalQuality: 81,
      },
      temperatureSeries: [
        { timestamp: '06:00', temperatureCelsius: 31.2 },
        { timestamp: '09:00', temperatureCelsius: 32.6 },
        { timestamp: '12:00', temperatureCelsius: 35.8 },
        { timestamp: '15:00', temperatureCelsius: 37.4 },
        { timestamp: '18:00', temperatureCelsius: 36.9 },
        { timestamp: '21:00', temperatureCelsius: 34.1 },
      ],
        latestImageUri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
      climateAnomalies: [
        {
          type: 'HEAT_SPIKE',
          severity: 'HIGH',
          routePosition: 'Setor 07',
          detectedAt: '2026-05-27T12:20:00.000Z',
          description: 'Elevação térmica acima do limite seguro para carga sensível.',
        },
        {
          type: 'COLD_FRONT',
          severity: 'LOW',
          routePosition: 'Setor 09',
          detectedAt: '2026-05-27T12:55:00.000Z',
          description: 'Mudança brusca de massa de ar detectada na trajetória aérea.',
        },
      ],
    },
  ] as unknown) as CargoTelemetryEntry[],
} as const;