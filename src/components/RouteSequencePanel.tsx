import React from 'react';
import {
  BusRouteDetail,
  RouteStopNode,
  LoadStatus,
} from '../data/singaporeTransitData';
import { LOAD_CONFIG } from './BusArrivalCard';
import { ArrowLeftRight, Bus, Clock, MapPin } from 'lucide-react';

interface RouteSequencePanelProps {
  routeDetail: BusRouteDetail;
  currentStopCode: string;
  direction: 1 | 2;
  onToggleDirection: () => void;
  onSelectStopFromRoute: (stopCode: string) => void;
}

export const RouteSequencePanel: React.FC<RouteSequencePanelProps> = ({
  routeDetail,
  currentStopCode,
  direction,
  onToggleDirection,
  onSelectStopFromRoute,
}) => {
  const stops: RouteStopNode[] = routeDetail.directions[direction];
  const directionLabel =
    direction === 1 ? routeDetail.direction1Label : routeDetail.direction2Label;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
      {/* Route Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-9 px-3 rounded-full bg-[#8B1D74] text-white font-display font-bold text-base flex items-center justify-center tabular-nums shrink-0">
              {routeDetail.serviceNo}
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base text-[#181C26] truncate">
                Route Sequence & Live Fleet
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#53424C]">
                <span>{routeDetail.operator}</span>
                <span aria-hidden="true">·</span>
                <span>{routeDetail.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Peak {routeDetail.headwayPeak}</span>
              </div>
            </div>
          </div>

          {/* Direction Switch Button (40x40px target) */}
          <button
            type="button"
            onClick={onToggleDirection}
            title="Switch Route Direction"
            className="h-10 px-3 rounded-lg bg-white border border-[#1A365D] text-[#1A365D] hover:bg-[#F1F5F9] text-xs font-display font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Dir {direction}</span>
          </button>
        </div>

        {/* Direction Terminus Bar */}
        <div className="mt-3 px-3 py-2 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1A365D] truncate">
            {directionLabel}
          </span>
          <span className="text-[#53424C] tabular-nums shrink-0 ml-2">
            {stops.length} Key Stops
          </span>
        </div>
      </div>

      {/* Vertical Timeline Sequence */}
      <div className="p-4 max-h-[460px] overflow-y-auto">
        <div className="relative">
          {stops.map((node, index) => {
            const isCurrentStop = node.stopCode === currentStopCode;
            const isLast = index === stops.length - 1;
            const liveBus = node.liveBusHere;

            return (
              <div
                key={node.stopCode}
                className="relative flex items-start gap-3.5 pb-5 last:pb-0 group"
              >
                {/* Vertical Timeline Track (2px solid #E2E8F0) */}
                {!isLast && (
                  <div
                    className="absolute left-[11px] top-5 bottom-0 w-[2px] bg-[#E2E8F0]"
                    aria-hidden="true"
                  />
                )}

                {/* Circular Node */}
                <div className="relative z-10 mt-1 flex items-center justify-center w-6 h-6 shrink-0">
                  {isCurrentStop ? (
                    <span className="w-5 h-5 rounded-full bg-[#8B1D74] ring-4 ring-[#FFD8EE] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#94A3B8] group-hover:border-[#8B1D74] transition-colors" />
                  )}
                </div>

                {/* Stop Content Row */}
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => onSelectStopFromRoute(node.stopCode)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectStopFromRoute(node.stopCode);
                      }
                    }}
                    className={`p-2.5 -my-1 rounded-lg transition-colors cursor-pointer ${
                      isCurrentStop
                        ? 'bg-[#F1F3FF] border border-[#8B1D74]/30'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-display text-sm font-semibold truncate ${
                            isCurrentStop ? 'text-[#8B1D74]' : 'text-[#181C26]'
                          }`}
                        >
                          {node.stopName}
                        </span>
                        {isCurrentStop && (
                          <span className="text-[11px] font-display font-semibold text-[#8B1D74]">
                            · Selected Stop
                          </span>
                        )}
                      </div>

                      <span className="font-display text-xs font-semibold text-[#1A365D] tabular-nums shrink-0">
                        #{node.stopCode}
                      </span>
                    </div>

                    {/* Road Name + Distance + MRT Interchange */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1 text-xs text-[#53424C]">
                      <div className="flex items-center gap-1.5">
                        <span>{node.roadName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{node.distanceKm.toFixed(1)} km</span>
                        {node.mrtCode && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-display font-bold text-white"
                              style={{ backgroundColor: node.mrtColor || '#1A365D' }}
                            >
                              {node.mrtCode}
                            </span>
                          </>
                        )}
                      </div>

                      <span className="text-[11px] tabular-nums text-[#85727D]">
                        First {node.firstBusWeekday} · Last {node.lastBusWeekday}
                      </span>
                    </div>

                    {/* Live Bus in Transit Pill along vertical rail */}
                    {liveBus && (
                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 h-5 rounded-full bg-[#8B1D74] text-white text-[11px] font-display font-semibold">
                            <Bus className="w-3 h-3" />
                            <span>{routeDetail.serviceNo}</span>
                            <span>·</span>
                            <span>{liveBus.deck}</span>
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 h-5 rounded-full text-[11px] font-semibold ${
                              LOAD_CONFIG[liveBus.load].bg
                            } ${LOAD_CONFIG[liveBus.load].text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                LOAD_CONFIG[liveBus.load].dot
                              }`}
                            />
                            {LOAD_CONFIG[liveBus.load].label}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#53424C] tabular-nums">
                          {liveBus.plate} ·{' '}
                          {liveBus.progressBetweenStops === 0
                            ? 'At Berth'
                            : 'In Transit'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
