import React from 'react';
import { BusStop, RouteStopNode, LoadStatus } from '../data/singaporeTransitData';
import { Navigation, Layers, Compass } from 'lucide-react';

interface InteractiveTransitMapProps {
  selectedStop: BusStop;
  allStops: BusStop[];
  onSelectStop: (stopCode: string) => void;
  activeServiceNo: string;
  routeNodes: RouteStopNode[];
}

export const InteractiveTransitMap: React.FC<InteractiveTransitMapProps> = ({
  selectedStop,
  allStops,
  onSelectStop,
  activeServiceNo,
  routeNodes,
}) => {
  const [showLiveBuses, setShowLiveBuses] = React.useState(true);
  const [showMrtCorridors, setShowMrtCorridors] = React.useState(true);

  const getLoadColor = (load: LoadStatus) => {
    if (load === 'SEA') return '#059669';
    if (load === 'SDA') return '#D97706';
    return '#DC2626';
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
      {/* Map Header Controls */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#8B1D74]" />
          <span className="font-display text-sm font-semibold text-[#181C26]">
            Singapore Central Corridor Telemetry
          </span>
          <span className="text-xs text-[#53424C] hidden sm:inline">
            · Service {activeServiceNo} GPS Vector
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLiveBuses((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
              showLiveBuses
                ? 'bg-[#8B1D74] text-white'
                : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            Live Fleet GPS
          </button>
          <button
            type="button"
            onClick={() => setShowMrtCorridors((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
              showMrtCorridors
                ? 'bg-[#1A365D] text-white'
                : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            MRT Interchanges
          </button>
        </div>
      </div>

      {/* Vector Geographic Canvas */}
      <div className="relative h-[300px] sm:h-[340px] w-full bg-[#EEF2F6] select-none overflow-hidden">
        <svg
          viewBox="0 0 800 420"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Interactive Singapore Bus Network Map"
        >
          <defs>
            <pattern id="sg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* Subtle Cartographic Grid */}
          <rect width="800" height="420" fill="#F1F5F9" />
          <rect width="800" height="420" fill="url(#sg-grid)" />

          {/* Singapore River / Marina Reservoir Stylized Waterway */}
          <path
            d="M 380 420 C 395 360, 440 340, 490 315 C 540 290, 595 310, 650 350 L 800 390 L 800 420 Z"
            fill="#DBEAFE"
            opacity="0.85"
          />
          <path
            d="M 240 285 Q 360 295 490 315"
            fill="none"
            stroke="#BFDBFE"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Green Parks (Fort Canning / Botanic / MacRitchie) */}
          <ellipse cx="320" cy="140" rx="68" ry="34" fill="#DCFCE7" opacity="0.7" />
          <ellipse cx="430" cy="235" rx="42" ry="22" fill="#DCFCE7" opacity="0.7" />

          {/* Major Arterial Roads */}
          <path
            d="M 60 80 L 290 195 L 485 225 L 690 140"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
          />
          <path
            d="M 140 350 L 385 265 L 495 215 L 470 55"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
          />

          {/* Optional MRT Line Underlays */}
          {showMrtCorridors && (
            <g opacity="0.45">
              {/* North-South Line (Red) */}
              <path
                d="M 280 35 L 350 115 L 355 215 L 485 255 L 515 335"
                fill="none"
                stroke="#D42E12"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              {/* East-West Line (Green) */}
              <path
                d="M 95 295 L 365 275 L 520 215 L 740 165"
                fill="none"
                stroke="#009645"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            </g>
          )}

          {/* Active Bus Route Trunk Polyline (#8B1D74) */}
          <path
            d="M 470 70 C 480 125, 515 165, 520 215 C 500 250, 425 270, 365 280 C 260 285, 190 290, 120 295"
            fill="none"
            stroke="#8B1D74"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Trunk Polyline (#1A365D) */}
          <path
            d="M 280 45 C 310 115, 330 175, 355 215 C 425 220, 475 215, 520 215 C 522 265, 518 300, 515 335"
            fill="none"
            stroke="#1A365D"
            strokeWidth="3.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />

          {/* Interactive Stop Markers */}
          {[
            { stop: allStops[4], x: 280, y: 45 }, // Woodlands 46009
            { stop: allStops[3], x: 470, y: 70 }, // Toa Payoh 52009
            { stop: allStops[1], x: 355, y: 215 }, // Orchard 09047
            { stop: allStops[0], x: 520, y: 215 }, // Hotel Grand Pacific 01012
            { stop: allStops[2], x: 515, y: 335 }, // One Raffles Quay 03218
          ].map(({ stop, x, y }) => {
            if (!stop) return null;
            const isSelected = stop.code === selectedStop.code;
            return (
              <g
                key={stop.code}
                onClick={() => onSelectStop(stop.code)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="#8B1D74"
                    opacity="0.18"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 9 : 6.5}
                  fill={isSelected ? '#8B1D74' : '#FFFFFF'}
                  stroke={isSelected ? '#FFFFFF' : '#1A365D'}
                  strokeWidth={isSelected ? 3 : 2.5}
                />
                {/* Stop Code Callout Label */}
                <g transform={`translate(${x + 12}, ${y - 12})`}>
                  <rect
                    x="0"
                    y="0"
                    width={isSelected ? 156 : 124}
                    height="26"
                    rx="5"
                    fill={isSelected ? '#1A365D' : '#FFFFFF'}
                    stroke={isSelected ? '#1A365D' : '#CBD5E1'}
                    strokeWidth="1"
                  />
                  <text
                    x="7"
                    y="16"
                    fill={isSelected ? '#FFFFFF' : '#181C26'}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {stop.code} · {stop.name.slice(0, 14)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Live Moving Bus Fleet Markers */}
          {showLiveBuses &&
            [
              { id: 'BUS-1', x: 502, y: 162, service: activeServiceNo, deck: 'DD', load: 'SEA' as LoadStatus },
              { id: 'BUS-2', x: 438, y: 256, service: activeServiceNo, deck: 'DD', load: 'SDA' as LoadStatus },
              { id: 'BUS-3', x: 342, y: 165, service: '190', deck: 'BD', load: 'LSD' as LoadStatus },
            ].map((bus) => (
              <g key={bus.id} transform={`translate(${bus.x - 26}, ${bus.y - 13})`}>
                <rect
                  x="0"
                  y="0"
                  width="54"
                  height="22"
                  rx="11"
                  fill="#8B1D74"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <circle
                  cx="10"
                  cy="11"
                  r="4"
                  fill={getLoadColor(bus.load)}
                />
                <text
                  x="18"
                  y="15"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="Space Grotesk, sans-serif"
                >
                  {bus.service} {bus.deck}
                </text>
              </g>
            ))}
        </svg>

        {/* Bottom Map Legend Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-sm border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold text-[#1A365D]">
              Stop {selectedStop.code}: {selectedStop.name}
            </span>
            <span className="text-[#53424C] hidden md:inline">
              ({selectedStop.lat.toFixed(4)}° N, {selectedStop.lng.toFixed(4)}° E)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1 text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              SEA Seats
            </span>
            <span className="flex items-center gap-1 text-[#D97706]">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              SDA Standing
            </span>
            <span className="flex items-center gap-1 text-[#DC2626]">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              LSD Limited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
