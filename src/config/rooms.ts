export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  icon: string;
}

export const ROOMS: Room[] = [
  {
    id: 'watson-101',
    name: 'Watson 101',
    building: 'Watson Hall',
    capacity: 40,
    blocked: false,
    icon: 'School',
  },
  {
    id: 'kepler-220',
    name: 'Kepler 220',
    building: 'Kepler Science Center',
    capacity: 24,
    blocked: true,
    icon: 'FlaskConical',
  },
  {
    id: 'thoreau-015',
    name: 'Thoreau 015',
    building: 'Thoreau Library',
    capacity: 12,
    blocked: false,
    icon: 'BookOpen',
  },
  {
    id: 'einstein-330',
    name: 'Einstein 330',
    building: 'Einstein Engineering Wing',
    capacity: 30,
    blocked: false,
    icon: 'Cpu',
  },
  {
    id: 'darwin-105',
    name: 'Darwin 105',
    building: 'Darwin Life Sciences',
    capacity: 18,
    blocked: false,
    icon: 'Leaf',
  },
];

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  start: number;
  end: number;
}

// Fictional pre-existing booking: 600-660 minutes after midnight (10:00-11:00)
export const BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    roomId: 'watson-101',
    title: 'Intro to Algorithms',
    start: 600,
    end: 660,
  },
  {
    id: 'booking-2',
    roomId: 'thoreau-015',
    title: 'Study Group: Calculus',
    start: 600,
    end: 660,
  },
  {
    id: 'booking-3',
    roomId: 'einstein-330',
    title: 'Robotics Lab Session',
    start: 720,
    end: 840,
  },
];

// Default "current time" — can be overridden by user
export const DEFAULT_CURRENT_TIME = 540; // 9:00 AM

export const MAX_DURATION = 120;
export const DAY_MINUTES = 1440;
