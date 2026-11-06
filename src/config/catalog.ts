import { ROOMS, BOOKINGS, type Room, type Booking } from './rooms';

export type CatalogRoom = Room & { equipment: readonly string[]; bookings: readonly Booking[] };
export const EQUIPMENT = ['Display', 'Whiteboard', 'Lab computers'] as const;
const equipmentByRoom: Record<string, readonly string[]> = {
  'watson-101': ['Display', 'Whiteboard'],
  'kepler-220': ['Display', 'Lab computers'],
  'thoreau-015': ['Whiteboard'],
  'einstein-330': ['Display', 'Whiteboard', 'Lab computers'],
  'darwin-105': ['Lab computers'],
};
const extraBookings: Booking[] = [
  { id: 'kepler-seminar', roomId: 'kepler-220', title: 'Science Seminar', start: 720, end: 780 },
  { id: 'darwin-study', roomId: 'darwin-105', title: 'Biology Study Group', start: 780, end: 840 },
];
const allBookings = [...BOOKINGS, ...extraBookings];
export const CATALOG: readonly CatalogRoom[] = ROOMS.map(room => ({
  ...room,
  equipment: equipmentByRoom[room.id],
  bookings: allBookings.filter(booking => booking.roomId === room.id),
}));
