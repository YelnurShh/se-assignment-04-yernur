import { useState } from 'react';
import {
  Building2,
  ArrowRight,
  Clock,
  PlayCircle,
  StopCircle,
  CalendarClock,
  Search,
  RotateCcw,
} from 'lucide-react';
import { ROOMS, DEFAULT_CURRENT_TIME, type Room } from '@/config/rooms';
import { checkAvailability, formatTime, type CheckResult } from '@/lib/booking';
import { RoomSelector } from '@/components/RoomSelector';
import { TimeField } from '@/components/TimeField';
import { Timeline } from '@/components/Timeline';
import { ResultCard } from '@/components/ResultCard';

function parseMinutes(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(ROOMS[0]);
  const [startRaw, setStartRaw] = useState('');
  const [endRaw, setEndRaw] = useState('');
  const [currentTimeRaw, setCurrentTimeRaw] = useState(String(DEFAULT_CURRENT_TIME));
  const [result, setResult] = useState<CheckResult | null>(null);

  const startNum = parseMinutes(startRaw);
  const endNum = parseMinutes(endRaw);
  const currentTimeNum = parseMinutes(currentTimeRaw) ?? DEFAULT_CURRENT_TIME;

  // Inline validation feedback for the time fields
  const startError = startRaw !== '' && startNum === null ? 'Enter a whole number' : null;
  const endError = endRaw !== '' && endNum === null ? 'Enter a whole number' : null;
  const currentTimeError =
    currentTimeRaw !== '' && parseMinutes(currentTimeRaw) === null
      ? 'Enter a whole number'
      : null;

  const canCheck =
    selectedRoom !== null &&
    startNum !== null &&
    endNum !== null &&
    parseMinutes(currentTimeRaw) !== null;

  function handleCheck() {
    if (!selectedRoom || startNum === null || endNum === null) return;
    setResult(
      checkAvailability(
        selectedRoom.id,
        selectedRoom.blocked,
        startNum,
        endNum,
        currentTimeNum,
      ),
    );
  }

  function handleReset() {
    setSelectedRoom(ROOMS[0]);
    setStartRaw('');
    setEndRaw('');
    setCurrentTimeRaw(String(DEFAULT_CURRENT_TIME));
    setResult(null);
  }

  const duration =
    startNum !== null && endNum !== null && endNum > startNum ? endNum - startNum : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900 sm:text-2xl">
                Smart Campus Room Availability Checker
              </h1>
              <p className="text-sm text-ink-500">
                Find an open room for your study session in seconds.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Step 1: Select room */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                1
              </span>
              <h2 className="text-base font-semibold text-ink-700">Select a Room</h2>
            </div>
            <RoomSelector selectedId={selectedRoom?.id ?? null} onSelect={setSelectedRoom} />
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectedRoom?.blocked ?? false} onChange={(event) => {
                setSelectedRoom((room) => room ? { ...room, blocked: event.target.checked } : room);
                setResult(null);
              }} />
              Blocked room test fixture
            </label>
          </section>

          {/* Step 2: Enter times */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                2
              </span>
              <h2 className="text-base font-semibold text-ink-700">Enter Your Times</h2>
              <span className="text-xs text-ink-300">(minutes after midnight)</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              {/* Current time */}
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                <CalendarClock className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-sm text-ink-700">
                  Current time:
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1440}
                  step={1}
                  aria-label="Current time in minutes after midnight"
                  value={currentTimeRaw}
                  onChange={(e) => {
                    setCurrentTimeRaw(e.target.value);
                    setResult(null);
                  }}
                  className="w-20 rounded-md border border-amber-300 px-2 py-1 font-mono text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <span className="text-xs text-ink-500">
                  min ({formatTime(currentTimeNum)})
                </span>
                {currentTimeError && (
                  <span className="ml-auto text-xs text-red-500 font-medium">
                    {currentTimeError}
                  </span>
                )}
              </div>

              {/* Start & End */}
              <div className="flex flex-col sm:flex-row gap-4">
                <TimeField
                  id="start-time"
                  label="Start Time"
                  hint="E.g. 660 = 11:00 AM"
                  icon={<PlayCircle className="h-4 w-4" />}
                  value={startRaw}
                  onChange={(v) => {
                    setStartRaw(v);
                    setResult(null);
                  }}
                  error={startError}
                />
                <div className="hidden sm:flex items-end pb-6">
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </div>
                <TimeField
                  id="end-time"
                  label="End Time"
                  hint="E.g. 720 = 12:00 PM"
                  icon={<StopCircle className="h-4 w-4" />}
                  value={endRaw}
                  onChange={(v) => {
                    setEndRaw(v);
                    setResult(null);
                  }}
                  error={endError}
                />
              </div>

              {/* Duration hint */}
              {duration !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-ink-500" />
                  <span className="text-ink-500">
                    Duration:{' '}
                    <span
                      className={
                        duration > 120
                          ? 'font-semibold text-red-500'
                          : 'font-semibold text-ink-700'
                      }
                    >
                      {duration} min
                    </span>
                    {duration > 120 && (
                      <span className="ml-1 text-red-500">(max 120 min)</span>
                    )}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={!canCheck}
                  className={[
                    'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-sm transition-all duration-200',
                    canCheck
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed',
                  ].join(' ')}
                >
                  <Search className="h-4.5 w-4.5" />
                  Check Availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 font-semibold text-sm text-ink-500 hover:bg-slate-50 hover:text-ink-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Timeline */}
          {selectedRoom && (
            <section className="animate-fade-in">
              <Timeline
                roomId={selectedRoom.id}
                candidateStart={startNum}
                candidateEnd={endNum}
                currentTime={currentTimeNum}
              />
            </section>
          )}

          {/* Result */}
          <section>
            <ResultCard result={result} start={startNum} end={endNum} />
          </section>

          {/* Footer note */}
          <p className="text-center text-xs text-ink-300 pt-2">
            Prototype · Fictional data · No bookings are saved or confirmed
          </p>
        </div>
      </main>
    </div>
  );
}
