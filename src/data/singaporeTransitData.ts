export type LoadStatus = 'SEA' | 'SDA' | 'LSD';
export type DeckType = 'SD' | 'DD' | 'BD';
export type OperatorType = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface BusArrivalTiming {
  etaMinutes: number; // 0 = Arr
  load: LoadStatus;
  deck: DeckType;
  isWAB: boolean;
  lat: number;
  lng: number;
  visitNumber: 1 | 2;
  monitored: boolean;
}

export interface BusServiceArrival {
  serviceNo: string;
  operator: OperatorType;
  category: 'TRUNK' | 'EXPRESS' | 'FEEDER' | 'CITY_DIRECT';
  originStopCode: string;
  destinationName: string;
  destinationStopCode: string;
  direction: 1 | 2;
  isFrequent: boolean;
  frequencyRange: string;
  nextBuses: [BusArrivalTiming, BusArrivalTiming, BusArrivalTiming];
  alertMessage?: string;
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  district: string;
  distanceMeters: number;
  lat: number;
  lng: number;
  mrtConnections?: {
    code: string;
    lineColor: string;
    stationName: string;
  }[];
  services: BusServiceArrival[];
}

export interface RouteStopNode {
  seq: number;
  stopCode: string;
  stopName: string;
  roadName: string;
  distanceKm: number;
  mrtCode?: string;
  mrtColor?: string;
  firstBusWeekday: string;
  lastBusWeekday: string;
  liveBusHere?: {
    deck: DeckType;
    load: LoadStatus;
    plate: string;
    progressBetweenStops: number; // 0 = at stop, 0.5 = halfway to next stop
  };
}

export interface BusRouteDetail {
  serviceNo: string;
  operator: OperatorType;
  category: string;
  direction1Label: string;
  direction2Label: string;
  headwayPeak: string;
  headwayOffPeak: string;
  directions: {
    1: RouteStopNode[];
    2: RouteStopNode[];
  };
}

export interface ServiceAlert {
  id: string;
  severity: 'ADVISORY' | 'DIVERSION' | 'DELAY';
  servicesAffected: string[];
  title: string;
  description: string;
  effectiveWindow: string;
  timestamp: string;
  interchangeOrRoad: string;
}

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  {
    code: '01012',
    name: 'Hotel Grand Pacific',
    roadName: 'Victoria St',
    district: 'Bugis / Bras Basah',
    distanceMeters: 85,
    lat: 1.2968,
    lng: 103.8529,
    mrtConnections: [
      { code: 'EW12', lineColor: '#009645', stationName: 'Bugis' },
      { code: 'DT14', lineColor: '#005EC4', stationName: 'Bugis' },
    ],
    services: [
      {
        serviceNo: '147',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '52009',
        destinationName: 'Clementi Int',
        destinationStopCode: '17009',
        direction: 1,
        isFrequent: true,
        frequencyRange: '6–9 min',
        nextBuses: [
          { etaMinutes: 0, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2969, lng: 103.8531, visitNumber: 1, monitored: true },
          { etaMinutes: 5, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.3041, lng: 103.8588, visitNumber: 1, monitored: true },
          { etaMinutes: 14, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3125, lng: 103.8615, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '190',
        operator: 'SMRT',
        category: 'TRUNK',
        originStopCode: '44009',
        destinationName: 'New Bridge Rd Ter',
        destinationStopCode: '05009',
        direction: 1,
        isFrequent: true,
        frequencyRange: '4–7 min',
        alertMessage: 'High evening peak demand along Orchard Turn; extra DD fleet deployed.',
        nextBuses: [
          { etaMinutes: 2, load: 'LSD', deck: 'DD', isWAB: true, lat: 1.2982, lng: 103.8511, visitNumber: 1, monitored: true },
          { etaMinutes: 6, load: 'SDA', deck: 'BD', isWAB: true, lat: 1.3029, lng: 103.8419, visitNumber: 1, monitored: true },
          { etaMinutes: 11, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3092, lng: 103.8342, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '65',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '75009',
        destinationName: 'HarbourFront Int',
        destinationStopCode: '14009',
        direction: 1,
        isFrequent: false,
        frequencyRange: '8–12 min',
        nextBuses: [
          { etaMinutes: 3, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2991, lng: 103.8545, visitNumber: 1, monitored: true },
          { etaMinutes: 11, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3088, lng: 103.8599, visitNumber: 1, monitored: true },
          { etaMinutes: 21, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3189, lng: 103.8672, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '851e',
        operator: 'SBST',
        category: 'EXPRESS',
        originStopCode: '59009',
        destinationName: 'Eu Tong Sen St (Chinatown)',
        destinationStopCode: '05013',
        direction: 1,
        isFrequent: false,
        frequencyRange: '10–15 min',
        nextBuses: [
          { etaMinutes: 4, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.3005, lng: 103.8540, visitNumber: 1, monitored: true },
          { etaMinutes: 16, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3198, lng: 103.8562, visitNumber: 1, monitored: true },
          { etaMinutes: 28, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3390, lng: 103.8480, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '960',
        operator: 'SMRT',
        category: 'TRUNK',
        originStopCode: '46009',
        destinationName: 'Marina Ctr Ter',
        destinationStopCode: '02099',
        direction: 1,
        isFrequent: true,
        frequencyRange: '7–10 min',
        nextBuses: [
          { etaMinutes: 1, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.2974, lng: 103.8524, visitNumber: 1, monitored: true },
          { etaMinutes: 9, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3052, lng: 103.8501, visitNumber: 1, monitored: true },
          { etaMinutes: 18, load: 'SEA', deck: 'BD', isWAB: true, lat: 1.3145, lng: 103.8468, visitNumber: 1, monitored: true },
        ],
      },
    ],
  },
  {
    code: '09047',
    name: 'Orchard Stn / Tang Plaza',
    roadName: 'Orchard Rd',
    district: 'Orchard / Tanglin',
    distanceMeters: 210,
    lat: 1.3048,
    lng: 103.8318,
    mrtConnections: [
      { code: 'NS22', lineColor: '#D42E12', stationName: 'Orchard' },
      { code: 'TE14', lineColor: '#9D5B25', stationName: 'Orchard' },
    ],
    services: [
      {
        serviceNo: '190',
        operator: 'SMRT',
        category: 'TRUNK',
        originStopCode: '44009',
        destinationName: 'New Bridge Rd Ter',
        destinationStopCode: '05009',
        direction: 1,
        isFrequent: true,
        frequencyRange: '4–7 min',
        nextBuses: [
          { etaMinutes: 0, load: 'LSD', deck: 'BD', isWAB: true, lat: 1.3048, lng: 103.8318, visitNumber: 1, monitored: true },
          { etaMinutes: 4, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.3095, lng: 103.8290, visitNumber: 1, monitored: true },
          { etaMinutes: 9, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3150, lng: 103.8260, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '14e',
        operator: 'SBST',
        category: 'EXPRESS',
        originStopCode: '84009',
        destinationName: 'Bedok Int (Express)',
        destinationStopCode: '84009',
        direction: 2,
        isFrequent: false,
        frequencyRange: '12–15 min',
        nextBuses: [
          { etaMinutes: 3, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3061, lng: 103.8299, visitNumber: 1, monitored: true },
          { etaMinutes: 15, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3120, lng: 103.8210, visitNumber: 1, monitored: true },
          { etaMinutes: 27, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3190, lng: 103.8150, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '502',
        operator: 'SBST',
        category: 'EXPRESS',
        originStopCode: '22009',
        destinationName: 'Soon Lee Depot / Marina Bay',
        destinationStopCode: '03219',
        direction: 1,
        isFrequent: false,
        frequencyRange: '10–14 min',
        nextBuses: [
          { etaMinutes: 6, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3082, lng: 103.8255, visitNumber: 1, monitored: true },
          { etaMinutes: 17, load: 'SDA', deck: 'SD', isWAB: true, lat: 1.3160, lng: 103.8110, visitNumber: 1, monitored: true },
          { etaMinutes: 29, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3240, lng: 103.7980, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '77',
        operator: 'TTS',
        category: 'TRUNK',
        originStopCode: '28009',
        destinationName: 'Marina Ctr Ter',
        destinationStopCode: '02099',
        direction: 1,
        isFrequent: false,
        frequencyRange: '9–13 min',
        nextBuses: [
          { etaMinutes: 2, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3055, lng: 103.8305, visitNumber: 1, monitored: true },
          { etaMinutes: 12, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3105, lng: 103.8220, visitNumber: 1, monitored: true },
          { etaMinutes: 23, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3145, lng: 103.8105, visitNumber: 1, monitored: true },
        ],
      },
    ],
  },
  {
    code: '03218',
    name: 'One Raffles Quay',
    roadName: 'Raffles Quay',
    district: 'Marina Bay / Raffles Place',
    distanceMeters: 340,
    lat: 1.2812,
    lng: 103.8519,
    mrtConnections: [
      { code: 'NS26', lineColor: '#D42E12', stationName: 'Raffles Place' },
      { code: 'EW14', lineColor: '#009645', stationName: 'Raffles Place' },
      { code: 'DT17', lineColor: '#005EC4', stationName: 'Downtown' },
    ],
    services: [
      {
        serviceNo: '97e',
        operator: 'TTS',
        category: 'EXPRESS',
        originStopCode: '28009',
        destinationName: 'Marine Parade / Marina Ctr',
        destinationStopCode: '02099',
        direction: 1,
        isFrequent: true,
        frequencyRange: '5–8 min',
        nextBuses: [
          { etaMinutes: 1, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.2805, lng: 103.8512, visitNumber: 1, monitored: true },
          { etaMinutes: 7, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2755, lng: 103.8458, visitNumber: 1, monitored: true },
          { etaMinutes: 13, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2715, lng: 103.8390, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '133',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '54009',
        destinationName: 'Ang Mo Kio Int',
        destinationStopCode: '54009',
        direction: 2,
        isFrequent: false,
        frequencyRange: '8–12 min',
        nextBuses: [
          { etaMinutes: 0, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2812, lng: 103.8519, visitNumber: 1, monitored: true },
          { etaMinutes: 8, load: 'SDA', deck: 'SD', isWAB: true, lat: 1.2790, lng: 103.8540, visitNumber: 1, monitored: true },
          { etaMinutes: 19, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2760, lng: 103.8580, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '10',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '75009',
        destinationName: 'Kent Ridge Ter',
        destinationStopCode: '16009',
        direction: 1,
        isFrequent: false,
        frequencyRange: '9–12 min',
        nextBuses: [
          { etaMinutes: 4, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.2845, lng: 103.8542, visitNumber: 1, monitored: true },
          { etaMinutes: 13, load: 'SDA', deck: 'DD', isWAB: true, lat: 1.2912, lng: 103.8610, visitNumber: 1, monitored: true },
          { etaMinutes: 22, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.2988, lng: 103.8720, visitNumber: 1, monitored: true },
        ],
      },
    ],
  },
  {
    code: '52009',
    name: 'Toa Payoh Bus Interchange',
    roadName: 'Lor 6 Toa Payoh',
    district: 'Toa Payoh Central',
    distanceMeters: 520,
    lat: 1.3325,
    lng: 103.8475,
    mrtConnections: [
      { code: 'NS19', lineColor: '#D42E12', stationName: 'Toa Payoh' },
    ],
    services: [
      {
        serviceNo: '147',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '52009',
        destinationName: 'Clementi Int',
        destinationStopCode: '17009',
        direction: 1,
        isFrequent: true,
        frequencyRange: '6–9 min',
        nextBuses: [
          { etaMinutes: 2, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
          { etaMinutes: 9, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
          { etaMinutes: 17, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '238',
        operator: 'SBST',
        category: 'FEEDER',
        originStopCode: '52009',
        destinationName: 'Lor 8 Toa Payoh (Loop)',
        destinationStopCode: '52009',
        direction: 1,
        isFrequent: true,
        frequencyRange: '4–6 min',
        nextBuses: [
          { etaMinutes: 0, load: 'SDA', deck: 'SD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
          { etaMinutes: 5, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3350, lng: 103.8520, visitNumber: 1, monitored: true },
          { etaMinutes: 10, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3380, lng: 103.8550, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '157',
        operator: 'SBST',
        category: 'TRUNK',
        originStopCode: '52009',
        destinationName: 'Boon Lay Int',
        destinationStopCode: '22009',
        direction: 1,
        isFrequent: false,
        frequencyRange: '8–11 min',
        nextBuses: [
          { etaMinutes: 4, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
          { etaMinutes: 13, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
          { etaMinutes: 22, load: 'SEA', deck: 'SD', isWAB: true, lat: 1.3325, lng: 103.8475, visitNumber: 1, monitored: true },
        ],
      },
    ],
  },
  {
    code: '46009',
    name: 'Woodlands Integrated Transport Hub',
    roadName: 'Woodlands Sq',
    district: 'Woodlands Regional Ctr',
    distanceMeters: 1250,
    lat: 1.4362,
    lng: 103.7865,
    mrtConnections: [
      { code: 'NS9', lineColor: '#D42E12', stationName: 'Woodlands' },
      { code: 'TE2', lineColor: '#9D5B25', stationName: 'Woodlands' },
    ],
    services: [
      {
        serviceNo: '960',
        operator: 'SMRT',
        category: 'TRUNK',
        originStopCode: '46009',
        destinationName: 'Marina Ctr Ter',
        destinationStopCode: '02099',
        direction: 1,
        isFrequent: true,
        frequencyRange: '7–10 min',
        nextBuses: [
          { etaMinutes: 1, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
          { etaMinutes: 8, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
          { etaMinutes: 16, load: 'SEA', deck: 'BD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
        ],
      },
      {
        serviceNo: '961M',
        operator: 'SMRT',
        category: 'TRUNK',
        originStopCode: '46009',
        destinationName: 'Lor 1 Geylang Ter',
        destinationStopCode: '80009',
        direction: 1,
        isFrequent: false,
        frequencyRange: '10–14 min',
        nextBuses: [
          { etaMinutes: 5, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
          { etaMinutes: 15, load: 'SDA', deck: 'SD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
          { etaMinutes: 26, load: 'SEA', deck: 'DD', isWAB: true, lat: 1.4362, lng: 103.7865, visitNumber: 1, monitored: true },
        ],
      },
    ],
  },
];

export const ROUTE_SEQUENCES: Record<string, BusRouteDetail> = {
  '147': {
    serviceNo: '147',
    operator: 'SBST',
    category: 'Trunk Service',
    direction1Label: 'Toa Payoh Int → Clementi Int',
    direction2Label: 'Clementi Int → Toa Payoh Int',
    headwayPeak: '6–9 mins',
    headwayOffPeak: '10–14 mins',
    directions: {
      1: [
        { seq: 1, stopCode: '52009', stopName: 'Toa Payoh Bus Interchange', roadName: 'Lor 6 Toa Payoh', distanceKm: 0.0, mrtCode: 'NS19', mrtColor: '#D42E12', firstBusWeekday: '05:30', lastBusWeekday: '23:45' },
        { seq: 4, stopCode: '52049', stopName: 'Opp Blk 192', roadName: 'Lor 6 Toa Payoh', distanceKm: 1.2, firstBusWeekday: '05:34', lastBusWeekday: '23:49' },
        { seq: 9, stopCode: '60081', stopName: 'Boon Keng Stn / Blk 102', roadName: 'Serangoon Rd', distanceKm: 3.6, mrtCode: 'NE9', mrtColor: '#9900AA', firstBusWeekday: '05:42', lastBusWeekday: '23:57', liveBusHere: { deck: 'DD', load: 'SEA', plate: 'SBS8921K', progressBetweenStops: 0.4 } },
        { seq: 13, stopCode: '07531', stopName: 'Farrer Park Stn Exit A', roadName: 'Serangoon Rd', distanceKm: 5.1, mrtCode: 'NE8', mrtColor: '#9900AA', firstBusWeekday: '05:48', lastBusWeekday: '00:03' },
        { seq: 16, stopCode: '07551', stopName: 'Tekka Ctr', roadName: 'Serangoon Rd', distanceKm: 6.0, mrtCode: 'DT12', mrtColor: '#005EC4', firstBusWeekday: '05:52', lastBusWeekday: '00:07', liveBusHere: { deck: 'DD', load: 'SDA', plate: 'SBS6640M', progressBetweenStops: 0.1 } },
        { seq: 19, stopCode: '01012', stopName: 'Hotel Grand Pacific', roadName: 'Victoria St', distanceKm: 7.4, mrtCode: 'EW12', mrtColor: '#009645', firstBusWeekday: '05:58', lastBusWeekday: '00:13', liveBusHere: { deck: 'DD', load: 'SEA', plate: 'SBS3819B', progressBetweenStops: 0 } },
        { seq: 21, stopCode: '01019', stopName: 'St. Joseph\'s Ch', roadName: 'Victoria St', distanceKm: 7.9, mrtCode: 'CC3', mrtColor: '#FA9E0D', firstBusWeekday: '06:00', lastBusWeekday: '00:15' },
        { seq: 24, stopCode: '04167', stopName: 'Clarke Quay Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 9.2, mrtCode: 'NE5', mrtColor: '#9900AA', firstBusWeekday: '06:05', lastBusWeekday: '00:20' },
        { seq: 26, stopCode: '05013', stopName: 'People\'s Pk Ctr', roadName: 'Eu Tong Sen St', distanceKm: 9.8, mrtCode: 'NE4', mrtColor: '#9900AA', firstBusWeekday: '06:08', lastBusWeekday: '00:23', liveBusHere: { deck: 'SD', load: 'SEA', plate: 'SBS2104T', progressBetweenStops: 0.65 } },
        { seq: 29, stopCode: '10017', stopName: 'Outram Pk Stn Exit 3', roadName: 'New Bridge Rd', distanceKm: 10.9, mrtCode: 'EW16', mrtColor: '#009645', firstBusWeekday: '06:12', lastBusWeekday: '00:27' },
        { seq: 36, stopCode: '11169', stopName: 'Queenstown Stn Exit B', roadName: 'C\'wealth Ave', distanceKm: 14.5, mrtCode: 'EW19', mrtColor: '#009645', firstBusWeekday: '06:24', lastBusWeekday: '00:39' },
        { seq: 42, stopCode: '17009', stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', distanceKm: 19.2, mrtCode: 'EW23', mrtColor: '#009645', firstBusWeekday: '06:40', lastBusWeekday: '00:55' },
      ],
      2: [
        { seq: 1, stopCode: '17009', stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', distanceKm: 0.0, mrtCode: 'EW23', mrtColor: '#009645', firstBusWeekday: '05:30', lastBusWeekday: '23:45' },
        { seq: 7, stopCode: '11161', stopName: 'Queenstown Stn Exit A', roadName: 'C\'wealth Ave', distanceKm: 4.7, mrtCode: 'EW19', mrtColor: '#009645', firstBusWeekday: '05:44', lastBusWeekday: '23:59', liveBusHere: { deck: 'DD', load: 'SEA', plate: 'SBS9012A', progressBetweenStops: 0.2 } },
        { seq: 14, stopCode: '10011', stopName: 'Outram Pk Stn Exit 1', roadName: 'Eu Tong Sen St', distanceKm: 8.3, mrtCode: 'EW16', mrtColor: '#009645', firstBusWeekday: '05:56', lastBusWeekday: '00:11' },
        { seq: 17, stopCode: '05022', stopName: 'Chinatown Pt', roadName: 'New Bridge Rd', distanceKm: 9.4, mrtCode: 'NE4', mrtColor: '#9900AA', firstBusWeekday: '06:01', lastBusWeekday: '00:16' },
        { seq: 22, stopCode: '01013', stopName: 'Bugis Cube', roadName: 'North Bridge Rd', distanceKm: 11.8, mrtCode: 'EW12', mrtColor: '#009645', firstBusWeekday: '06:10', lastBusWeekday: '00:25', liveBusHere: { deck: 'DD', load: 'SDA', plate: 'SBS7741P', progressBetweenStops: 0 } },
        { seq: 28, stopCode: '07219', stopName: 'Lavender Stn Exit B', roadName: 'Kallang Rd', distanceKm: 13.4, mrtCode: 'EW11', mrtColor: '#009645', firstBusWeekday: '06:17', lastBusWeekday: '00:32' },
        { seq: 38, stopCode: '52009', stopName: 'Toa Payoh Bus Interchange', roadName: 'Lor 6 Toa Payoh', distanceKm: 19.2, mrtCode: 'NS19', mrtColor: '#D42E12', firstBusWeekday: '06:38', lastBusWeekday: '00:53' },
      ],
    },
  },
  '190': {
    serviceNo: '190',
    operator: 'SMRT',
    category: 'High-Frequency Trunk',
    direction1Label: 'Choa Chu Kang Int → New Bridge Rd Ter',
    direction2Label: 'New Bridge Rd Ter → Choa Chu Kang Int',
    headwayPeak: '4–7 mins',
    headwayOffPeak: '8–11 mins',
    directions: {
      1: [
        { seq: 1, stopCode: '44009', stopName: 'Choa Chu Kang Int', roadName: 'Choa Chu Kang Loop', distanceKm: 0.0, mrtCode: 'NS4', mrtColor: '#D42E12', firstBusWeekday: '05:15', lastBusWeekday: '23:45' },
        { seq: 6, stopCode: '44259', stopName: 'Bukit Panjang Stn / Plaza', roadName: 'Jelepang Rd', distanceKm: 3.8, mrtCode: 'DT1', mrtColor: '#005EC4', firstBusWeekday: '05:27', lastBusWeekday: '23:57' },
        { seq: 11, stopCode: '40231', stopName: 'Stevens Stn Exit B', roadName: 'Whitley Rd', distanceKm: 13.4, mrtCode: 'DT10', mrtColor: '#005EC4', firstBusWeekday: '05:45', lastBusWeekday: '00:15', liveBusHere: { deck: 'BD', load: 'SDA', plate: 'SMB8014Z', progressBetweenStops: 0.3 } },
        { seq: 14, stopCode: '09047', stopName: 'Orchard Stn / Tang Plaza', roadName: 'Orchard Rd', distanceKm: 15.9, mrtCode: 'NS22', mrtColor: '#D42E12', firstBusWeekday: '05:52', lastBusWeekday: '00:22', liveBusHere: { deck: 'DD', load: 'LSD', plate: 'SMB5122C', progressBetweenStops: 0 } },
        { seq: 16, stopCode: '09037', stopName: 'Somerset Stn', roadName: 'Orchard Rd', distanceKm: 16.7, mrtCode: 'NS23', mrtColor: '#D42E12', firstBusWeekday: '05:56', lastBusWeekday: '00:26' },
        { seq: 18, stopCode: '08057', stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', distanceKm: 17.6, mrtCode: 'NS24', mrtColor: '#D42E12', firstBusWeekday: '06:00', lastBusWeekday: '00:30' },
        { seq: 20, stopCode: '01012', stopName: 'Hotel Grand Pacific', roadName: 'Victoria St', distanceKm: 18.8, mrtCode: 'EW12', mrtColor: '#009645', firstBusWeekday: '06:05', lastBusWeekday: '00:35', liveBusHere: { deck: 'DD', load: 'LSD', plate: 'SMB3301Y', progressBetweenStops: 0.5 } },
        { seq: 24, stopCode: '04167', stopName: 'Clarke Quay Stn Exit E', roadName: 'Eu Tong Sen St', distanceKm: 20.4, mrtCode: 'NE5', mrtColor: '#9900AA', firstBusWeekday: '06:11', lastBusWeekday: '00:41' },
        { seq: 27, stopCode: '05009', stopName: 'New Bridge Rd Bus Terminal', roadName: 'New Bridge Rd', distanceKm: 21.8, mrtCode: 'EW16', mrtColor: '#009645', firstBusWeekday: '06:17', lastBusWeekday: '00:47' },
      ],
      2: [
        { seq: 1, stopCode: '05009', stopName: 'New Bridge Rd Bus Terminal', roadName: 'New Bridge Rd', distanceKm: 0.0, mrtCode: 'EW16', mrtColor: '#009645', firstBusWeekday: '05:45', lastBusWeekday: '00:10' },
        { seq: 5, stopCode: '04168', stopName: 'Clarke Quay Stn Exit B', roadName: 'New Bridge Rd', distanceKm: 1.5, mrtCode: 'NE5', mrtColor: '#9900AA', firstBusWeekday: '05:51', lastBusWeekday: '00:16' },
        { seq: 9, stopCode: '09022', stopName: 'Orchard Stn / Lucky Plaza', roadName: 'Orchard Rd', distanceKm: 4.8, mrtCode: 'NS22', mrtColor: '#D42E12', firstBusWeekday: '06:04', lastBusWeekday: '00:29', liveBusHere: { deck: 'DD', load: 'SDA', plate: 'SMB5089G', progressBetweenStops: 0.4 } },
        { seq: 19, stopCode: '44009', stopName: 'Choa Chu Kang Int', roadName: 'Choa Chu Kang Loop', distanceKm: 21.8, mrtCode: 'NS4', mrtColor: '#D42E12', firstBusWeekday: '06:35', lastBusWeekday: '01:00' },
      ],
    },
  },
};

export const SERVICE_ALERTS: ServiceAlert[] = [
  {
    id: 'ALT-2026-089',
    severity: 'DIVERSION',
    servicesAffected: ['147', '190', '65', '851e'],
    title: 'Civic District Night Run — Victoria St & Bras Basah Road Closure',
    description: 'Four stops along Victoria St (01012 to 01113) will observe temporary lane control from 22:30 to 01:00. Commuters may board at Bugis Stn Exit B temporary berth.',
    effectiveWindow: 'Tonight · 22:30 – 01:00 SGT',
    timestamp: 'Updated 14m ago',
    interchangeOrRoad: 'Victoria St / Bras Basah',
  },
  {
    id: 'ALT-2026-084',
    severity: 'ADVISORY',
    servicesAffected: ['190', '960', '502'],
    title: 'Extra Double-Deckers Deployed on BKE–Orchard Corridor',
    description: 'High evening peak commuter load observed along Orchard Turn & Stevens Rd. SMRT and SBS Transit have injected 6 additional Euro VI Double-Deck wheelchair-accessible buses.',
    effectiveWindow: 'Active Now · Peak Fleet Boost',
    timestamp: 'Updated 6m ago',
    interchangeOrRoad: 'Orchard Rd / BKE Corridor',
  },
  {
    id: 'ALT-2026-079',
    severity: 'DELAY',
    servicesAffected: ['97e', '133', '10'],
    title: 'Heavy Wet-Weather Traffic Approaching Marina Coastal Expressway (MCE)',
    description: 'Expect 4–6 mins additional headway on CBD-bound express services due to surface water regulation near Maxwell Rd slip road.',
    effectiveWindow: 'Active Now · +4m Headway',
    timestamp: 'Updated 22m ago',
    interchangeOrRoad: 'Raffles Quay / MCE Exit 2',
  },
];
