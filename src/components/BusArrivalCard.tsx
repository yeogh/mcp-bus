import React from 'react';
import {
  BusServiceArrival,
  LoadStatus,
  DeckType,
} from '../data/singaporeTransitData';
import {
  ArrowRight,
  Bookmark,
  Accessibility,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface BusArrivalCardProps {
  service: BusServiceArrival;
  stopCode: string;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelectService: (serviceNo: string) => void;
  onToggleBookmark: (stopCode: string, serviceNo: string) => void;
}

export const LOAD_CONFIG: Record<
  LoadStatus,
  { label: string; shortLabel: string; bg: string; text: string; dot: string }
> = {
  SEA: {
    label: 'Seats Avail',
    shortLabel: 'Seats',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    dot: 'bg-[#059669]',
  },
  SDA: {
    label: 'Standing',
    shortLabel: 'Stand',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    dot: 'bg-[#D97706]',
  },
  LSD: {
    label: 'Limited',
    shortLabel: 'Full',
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
    dot: 'bg-[#DC2626]',
  },
};

export const DECK_LABELS: Record<DeckType, string> = {
  SD: 'Single Deck',
  DD: 'Double Deck',
  BD: 'Bendy Bus',
};

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  stopCode,
  isSelected,
  isBookmarked,
  onSelectService,
  onToggleBookmark,
}) => {
  return (
    <div
      onClick={() => onSelectService(service.serviceNo)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectService(service.serviceNo);
        }
      }}
      className={`group rounded-lg bg-white transition-all duration-150 cursor-pointer p-3.5 sm:p-4 ${
        isSelected
          ? 'border-2 border-[#8B1D74] shadow-[0px_2px_4px_rgba(24,28,38,0.06),0px_1px_2px_rgba(24,28,38,0.04)]'
          : 'border border-[#E2E8F0] hover:border-[#CBD5E1]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Bus Service Badge + Destination + Metadata */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          {/* Pill Service Route Number Badge */}
          <div
            className={`h-11 min-w-[68px] px-3.5 rounded-full flex items-center justify-center font-display font-bold text-xl tracking-tight tabular-nums shrink-0 ${
              isSelected
                ? 'bg-[#8B1D74] text-white'
                : 'bg-[#1A365D] text-white group-hover:bg-[#8B1D74] transition-colors'
            }`}
          >
            {service.serviceNo}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#181C26] truncate">
              <span className="text-[#53424C] font-normal">To</span>
              <span className="truncate">{service.destinationName}</span>
              <ChevronRight className="w-4 h-4 text-[#85727D] shrink-0 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Unboxed Metadata with Clean Separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#53424C] mt-0.5">
              <span className="font-medium text-[#1A365D]">{service.operator}</span>
              <span aria-hidden="true">·</span>
              <span>{service.category === 'EXPRESS' ? 'Express' : 'Trunk'}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Every {service.frequencyRange}</span>
            </div>
          </div>

          {/* Mobile Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(stopCode, service.serviceNo);
            }}
            aria-label={`Bookmark service ${service.serviceNo} at stop ${stopCode}`}
            className={`sm:hidden w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-[#FFD8EE] text-[#8B1D74]'
                : 'bg-[#F1F5F9] text-[#475569] hover:text-[#181C26]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Right: 3 Arrival Timings Cluster + Desktop Bookmark Action */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 flex-1 sm:flex-initial">
            {service.nextBuses.map((bus, idx) => {
              const loadStyle = LOAD_CONFIG[bus.load];
              const isImmediate = idx === 0;
              const isArriving = bus.etaMinutes === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between px-2.5 py-1.5 rounded-md min-w-[78px] sm:min-w-[86px] ${
                    isImmediate ? 'bg-[#F8FAFC] border border-[#E2E8F0]' : 'bg-transparent'
                  }`}
                >
                  {/* Arrival Figure */}
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-display font-bold tabular-nums tracking-tight ${
                        isImmediate
                          ? isArriving
                            ? 'text-2xl sm:text-[26px] leading-7 text-[#8B1D74]'
                            : 'text-2xl sm:text-[26px] leading-7 text-[#181C26]'
                          : 'text-lg leading-6 text-[#475569]'
                      }`}
                    >
                      {isArriving ? 'Arr' : `${bus.etaMinutes}`}
                    </span>
                    {!isArriving && (
                      <span className="text-[11px] font-medium text-[#53424C]">
                        min
                      </span>
                    )}
                  </div>

                  {/* Operational Load Pill + Deck Type Pill */}
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 h-5 rounded-full text-[11px] font-semibold whitespace-nowrap ${loadStyle.bg} ${loadStyle.text}`}
                      title={`LTA Capacity: ${loadStyle.label}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${loadStyle.dot}`} />
                      {isImmediate ? loadStyle.label : loadStyle.shortLabel}
                    </span>

                    <span
                      className="inline-flex items-center px-1.5 h-5 rounded-full text-[10px] font-display font-semibold bg-[#F1F5F9] text-[#475569]"
                      title={`${DECK_LABELS[bus.deck]} (${bus.isWAB ? 'Wheelchair Accessible' : 'Standard'})`}
                    >
                      {bus.deck}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Bookmark Quick Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(stopCode, service.serviceNo);
            }}
            aria-label={`Bookmark service ${service.serviceNo} at stop ${stopCode}`}
            className={`hidden sm:flex w-10 h-10 rounded-lg items-center justify-center shrink-0 transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-[#FFD8EE] text-[#8B1D74]'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#181C26]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Optional Route Alert Banner inside Card */}
      {service.alertMessage && (
        <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center gap-2 text-xs text-[#833700]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#D9681E] shrink-0" />
          <span className="truncate">{service.alertMessage}</span>
        </div>
      )}
    </div>
  );
};
