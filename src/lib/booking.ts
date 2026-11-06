import { BOOKINGS, MAX_DURATION, DAY_MINUTES, type Booking } from '@/config/rooms';

export interface CheckResult {
  available: boolean;
  reason: string | null;
  conflicts: Booking[];
}

function isWholeNumber(n: number): boolean {
  return Number.isFinite(n) && Number.isInteger(n);
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  // start-inclusive, end-exclusive; touching endpoints are OK
  // [aStart, aEnd) overlaps [bStart, bEnd) iff aStart < bEnd && bStart < aEnd
  return aStart < bEnd && bStart < aEnd;
}

export function checkAvailability(
  roomId: string,
  roomBlocked: boolean,
  start: number,
  end: number,
  currentTime: number,
): CheckResult {
  return evaluateAvailability(BOOKINGS, roomId, roomBlocked, start, end, currentTime);
}

export function evaluateAvailability(
  bookings: readonly Booking[],
  roomId: string,
  roomBlocked: boolean,
  start: number,
  end: number,
  currentTime: number,
): CheckResult {
  const roomBookings = bookings.filter((b) => b.roomId === roomId);
  const reject = (reason: string): CheckResult => ({ available: false, reason, conflicts: [] });

  // AC3: blocked room
  if (roomBlocked) {
    return reject('This room is currently blocked and cannot be booked.');
  }

  // AC1: whole minutes, 0 <= start < end <= 1440, start > currentTime
  if (!isWholeNumber(start) || !isWholeNumber(end)) {
    return reject('Start and end times must be whole minutes.');
  }

  if (start < 0 || end > DAY_MINUTES) {
    return reject('Times must be within the day (0 to 1440 minutes).');
  }

  if (start >= end) {
    return reject('Start time must be before end time.');
  }

  if (start <= currentTime) {
    return reject('Start time must be strictly after the current time.');
  }

  // AC2: duration over 120
  if (end - start > MAX_DURATION) {
    return reject(`Booking duration cannot exceed ${MAX_DURATION} minutes (2 hours).`);
  }

  // AC4: overlap with existing bookings (touching endpoints allowed)
  const conflicts = roomBookings.filter((b) => overlaps(start, end, b.start, b.end));

  if (conflicts.length > 0) {
    const labels = conflicts
      .map((c) => `${formatTime(c.start)}\u2013${formatTime(c.end)}`)
      .join(', ');
    return { available: false, reason: `Conflicts with existing booking (${labels}).`, conflicts };
  }

  return {
    available: true,
    reason: null,
    conflicts: [],
  };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
