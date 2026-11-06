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
import { DEFAULT_CURRENT_TIME } from '@/config/rooms';
import { evaluateAvailability, formatTime, type CheckResult } from '@/lib/booking';
import { CATALOG, EQUIPMENT } from '@/config/catalog';
import { filterRooms } from '@/lib/roomFilters';
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
  const [selectedId, setSelectedId] = useState(CATALOG[0].id);
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);
  const matches = filterRooms(CATALOG, Number(attendees), equipment);
  const selectedRoom = matches.find(room => room.id === selectedId) ?? matches[0];
  const [startRaw, setStartRaw] = useState('');
  const [endRaw, setEndRaw] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const startNum = parseMinutes(startRaw);
  const endNum = parseMinutes(endRaw);
  const currentTimeNum = DEFAULT_CURRENT_TIME;
  const wholeNumberError = (raw: string, parsed: number | null) =>
    raw !== '' && parsed === null ? 'Enter a whole number' : null;
  const startError = wholeNumberError(startRaw, startNum);
  const endError = wholeNumberError(endRaw, endNum);
  const canCheck = Boolean(selectedRoom) && startNum !== null && endNum !== null;

  function handleCheck() {
    if (!selectedRoom || startNum === null || endNum === null) return;
    setResult(
      evaluateAvailability(
        selectedRoom.bookings,
        selectedRoom.id,
        selectedRoom.blocked,
        startNum,
        endNum,
        currentTimeNum,
      ),
    );
  }

  function handleReset() {
    setSelectedId(matches[0]?.id ?? '');
    setStartRaw('');
    setEndRaw('');
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
            <div className="mb-4 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
              <label className="block">Attendees
                <input className="ml-3 w-24 rounded border border-slate-300 p-1" type="number" min="1" step="1"
                  value={attendees} onChange={e => { setAttendees(e.target.value); setResult(null); }} />
              </label>
              <fieldset className="flex flex-wrap gap-3">
                <legend>Required equipment</legend>
                {EQUIPMENT.map(item => <label className="inline-flex items-center gap-2" key={item}>
                  <input type="checkbox" checked={equipment.includes(item)} onChange={() => {
                    setEquipment(list => list.includes(item) ? list.filter(value => value !== item) : [...list, item]);
                    setResult(null);
                  }} />{item}
                </label>)}
              </fieldset>
            </div>
            {matches.length ? <RoomSelector rooms={matches} selectedId={selectedRoom?.id ?? null}
              onSelect={room => { setSelectedId(room.id); setResult(null); }} /> :
              <p role="status">No rooms match. Change the attendee count or required equipment.</p>}
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
                <span className="text-xs text-ink-500">{currentTimeNum} min ({formatTime(currentTimeNum)})</span>
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
                roomBookings={selectedRoom.bookings}
                candidateStart={startNum}
                candidateEnd={endNum}
                currentTime={currentTimeNum}
              />
            </section>
          )}

          {/* Result */}
          <section aria-live="polite" data-testid={result ? "availability-result" : undefined}>
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
