import {
  School,
  FlaskConical,
  BookOpen,
  Cpu,
  Leaf,
  Lock,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { ROOMS, type Room } from '@/config/rooms';

const ICON_MAP: Record<string, LucideIcon> = {
  School,
  FlaskConical,
  BookOpen,
  Cpu,
  Leaf,
};

interface RoomSelectorProps {
  selectedId: string | null;
  onSelect: (room: Room) => void;
}

export function RoomSelector({ selectedId, onSelect }: RoomSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ROOMS.filter((room) => room.id === 'watson-101').map((room) => {
        const Icon = ICON_MAP[room.icon] ?? School;
        const isSelected = room.id === selectedId;
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room)}
            className={[
              'group relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
              isSelected
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
              room.blocked ? 'opacity-75' : '',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors',
                isSelected
                  ? 'bg-blue-500 text-white'
                  : room.blocked
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink-900 truncate">{room.name}</span>
                {room.blocked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    <Lock className="h-3 w-3" />
                    Blocked
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-sm text-ink-500">
                <span className="truncate">{room.building}</span>
                <span className="inline-flex items-center gap-1 shrink-0">
                  <Users className="h-3.5 w-3.5" />
                  {room.capacity}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Re-export to satisfy potential external use; prevents unused-import lint noise
export type { Room };
