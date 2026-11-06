import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { formatTime, formatDuration, type CheckResult } from '@/lib/booking';

interface ResultCardProps {
  result: CheckResult | null;
  start: number | null;
  end: number | null;
}

export function ResultCard({ result, start, end }: ResultCardProps) {
  if (!result) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <Clock className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm text-ink-500 font-medium">
          Select a room and enter times, then check availability.
        </p>
      </div>
    );
  }

  if (result.available) {
    const duration = start !== null && end !== null ? end - start : 0;
    return (
      <div className="animate-slide-up rounded-xl border-2 border-green-500 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-700">Available</h3>
            <p className="mt-1 text-sm text-green-600">
              This room is open for your requested time.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200">
                <Clock className="h-3.5 w-3.5" />
                {start !== null && end !== null
                  ? `${formatTime(start)} \u2013 ${formatTime(end)}`
                  : ''}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200">
                {formatDuration(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unavailable
  return (
    <div className="animate-slide-up rounded-xl border-2 border-red-400 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-600">Unavailable</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {result.reason}
          </p>
          {result.conflicts.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {result.conflicts.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-red-600 border border-red-200 mr-2"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{c.title}</span>
                  <span className="text-red-400">
                    {formatTime(c.start)} – {formatTime(c.end)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
