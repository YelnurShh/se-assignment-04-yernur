import { useMemo } from 'react';
import { BOOKINGS, DAY_MINUTES } from '@/config/rooms';
import { formatTime } from '@/lib/booking';

interface TimelineProps {
  roomId: string | null;
  candidateStart: number | null;
  candidateEnd: number | null;
  currentTime: number;
}

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i); // 0..24

export function Timeline({ roomId, candidateStart, candidateEnd, currentTime }: TimelineProps) {
  const roomBookings = useMemo(
    () => BOOKINGS.filter((b) => b.roomId === roomId),
    [roomId],
  );

  const pct = (min: number) => `${(min / DAY_MINUTES) * 100}%`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-700">Today's Timeline</h3>
        <div className="flex items-center gap-4 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> Booked
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Your request
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Now
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-12 rounded-lg bg-slate-100 overflow-hidden">
        {/* Existing bookings */}
        {roomBookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-0 bottom-0 bg-slate-400/80 flex items-center px-1 overflow-hidden"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${b.title} (${formatTime(b.start)}\u2013${formatTime(b.end)})`}
          >
            <span className="text-[10px] font-medium text-white truncate whitespace-nowrap">
              {b.title}
            </span>
          </div>
        ))}

        {/* Candidate slot */}
        {candidateStart !== null && candidateEnd !== null && candidateStart < candidateEnd && (
          <div
            className="absolute top-0 bottom-0 border-2 border-blue-500 bg-blue-400/40 flex items-center justify-center"
            style={{
              left: pct(Math.max(0, candidateStart)),
              width: pct(Math.min(DAY_MINUTES, candidateEnd) - Math.max(0, candidateStart)),
            }}
          />
        )}

        {/* Current time marker */}
        {currentTime >= 0 && currentTime <= DAY_MINUTES && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: pct(currentTime) }}
          >
            <div className="absolute -top-0.5 -left-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
          </div>
        )}
      </div>

      {/* Hour labels */}
      <div className="relative mt-1.5 h-5">
        {HOUR_MARKS.filter((h) => h % 3 === 0).map((h) => (
          <div
            key={h}
            className="absolute -translate-x-1/2 text-[10px] font-mono text-ink-300"
            style={{ left: pct(h * 60) }}
          >
            {h === 24 ? '24:00' : h === 0 ? '12a' : h === 12 ? '12p' : h < 12 ? `${h}a` : `${h - 12}p`}
          </div>
        ))}
      </div>
    </div>
  );
}
