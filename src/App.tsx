/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  SINGAPORE_BUS_STOPS,
  ROUTE_SEQUENCES,
  SERVICE_ALERTS,
  BusStop,
  BusServiceArrival,
} from './data/singaporeTransitData';
import { BusArrivalCard, LOAD_CONFIG } from './components/BusArrivalCard';
import { RouteSequencePanel } from './components/RouteSequencePanel';
import { InteractiveTransitMap } from './components/InteractiveTransitMap';
import {
  Search,
  MapPin,
  RefreshCw,
  Bookmark,
  AlertTriangle,
  Bus,
  Navigation,
  Clock,
  CheckCircle2,
  X,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';

type ActiveTab = 'live' | 'routes' | 'saved' | 'advisories';
type CategoryFilter = 'ALL' | 'TRUNK' | 'EXPRESS' | 'SEATS_ONLY';

interface BookmarkedPair {
  stopCode: string;
  serviceNo: string;
}

export default function App() {
  // Core state
  const [stopsData, setStopsData] = useState<BusStop[]>(SINGAPORE_BUS_STOPS);
  const [selectedStopCode, setSelectedStopCode] = useState<string>('01012');
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>('147');
  const [routeDirection, setRouteDirection] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');

  // Bookmarks state (pre-populated with key Singapore commuter stops)
  const [bookmarks, setBookmarks] = useState<BookmarkedPair[]>([
    { stopCode: '01012', serviceNo: '147' },
    { stopCode: '01012', serviceNo: '190' },
    { stopCode: '09047', serviceNo: '190' },
    { stopCode: '03218', serviceNo: '97e' },
  ]);

  // 30-second LTA DataMall polling countdown state
  const [pollCountdown, setPollCountdown] = useState<number>(30);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Countdown timer & live ETA simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPollCountdown((prev) => {
        if (prev <= 1) {
          triggerLiveRefresh(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerLiveRefresh = (manual = true) => {
    if (manual) {
      setIsRefreshing(true);
      setPollCountdown(30);
    }
    // Simulate subtle real-time ETA progression
    setStopsData((prevStops) =>
      prevStops.map((stop) => ({
        ...stop,
        services: stop.services.map((svc) => ({
          ...svc,
          nextBuses: svc.nextBuses.map((bus, idx) => {
            if (idx === 0) {
              const nextEta = bus.etaMinutes <= 0 ? 4 : bus.etaMinutes - 1;
              return { ...bus, etaMinutes: nextEta };
            }
            return bus;
          }) as typeof svc.nextBuses,
        })),
      }))
    );
    if (manual) {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  const handleLocateNearestStop = () => {
    setGpsStatus('Locating nearest LTA bus stop...');
    setTimeout(() => {
      setSelectedStopCode('01012');
      setGpsStatus('Nearest stop locked: 01012 Hotel Grand Pacific (85m)');
      setTimeout(() => setGpsStatus(null), 3500);
    }, 350);
  };

  const toggleBookmark = (stopCode: string, serviceNo: string) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.stopCode === stopCode && b.serviceNo === serviceNo
      );
      if (exists) {
        return prev.filter(
          (b) => !(b.stopCode === stopCode && b.serviceNo === serviceNo)
        );
      }
      return [...prev, { stopCode, serviceNo }];
    });
  };

  const isPairBookmarked = (stopCode: string, serviceNo: string) =>
    bookmarks.some((b) => b.stopCode === stopCode && b.serviceNo === serviceNo);

  // Selected Bus Stop Object
  const selectedStop = useMemo(
    () =>
      stopsData.find((s) => s.code === selectedStopCode) || stopsData[0],
    [stopsData, selectedStopCode]
  );

  // Filtered stops or services based on search input
  const matchingStops = useMemo(() => {
    if (!searchQuery.trim()) return stopsData;
    const q = searchQuery.toLowerCase().trim();
    return stopsData.filter(
      (stop) =>
        stop.code.toLowerCase().includes(q) ||
        stop.name.toLowerCase().includes(q) ||
        stop.roadName.toLowerCase().includes(q) ||
        stop.services.some((svc) => svc.serviceNo.toLowerCase().includes(q))
    );
  }, [stopsData, searchQuery]);

  // Filtered services inside the active bus stop
  const filteredServices = useMemo(() => {
    return selectedStop.services.filter((svc) => {
      const matchesQuery =
        !searchQuery.trim() ||
        svc.serviceNo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        svc.destinationName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        selectedStop.code.includes(searchQuery.trim()) ||
        selectedStop.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      if (!matchesQuery) return false;
      if (categoryFilter === 'TRUNK') return svc.category === 'TRUNK';
      if (categoryFilter === 'EXPRESS') return svc.category === 'EXPRESS';
      if (categoryFilter === 'SEATS_ONLY')
        return svc.nextBuses[0].load === 'SEA';
      return true;
    });
  }, [selectedStop, searchQuery, categoryFilter]);

  // Active Route Detail (fallback to 147 or 190 if another service is clicked)
  const activeRouteDetail = useMemo(() => {
    if (ROUTE_SEQUENCES[selectedServiceNo]) {
      return ROUTE_SEQUENCES[selectedServiceNo];
    }
    return ROUTE_SEQUENCES['147'];
  }, [selectedServiceNo]);

  // Circular SVG progress calculation for 30s LTA poll cycle
  const circleRadius = 9;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (pollCountdown / 30) * circleCircumference;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#181C26] flex flex-col pb-20 md:pb-10">
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('live');
            }}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#8B1D74] whitespace-nowrap"
          >
            Transit Pulse Singapore
          </a>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#53424C]">
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'live'
                  ? 'text-[#8B1D74] font-semibold underline underline-offset-8 decoration-2 decoration-[#8B1D74]'
                  : 'hover:text-[#181C26]'
              }`}
            >
              Live Arrivals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('routes')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'routes'
                  ? 'text-[#8B1D74] font-semibold underline underline-offset-8 decoration-2 decoration-[#8B1D74]'
                  : 'hover:text-[#181C26]'
              }`}
            >
              Route Explorer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'text-[#8B1D74] font-semibold underline underline-offset-8 decoration-2 decoration-[#8B1D74]'
                  : 'hover:text-[#181C26]'
              }`}
            >
              Saved Stops ({bookmarks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advisories')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'advisories'
                  ? 'text-[#8B1D74] font-semibold underline underline-offset-8 decoration-2 decoration-[#8B1D74]'
                  : 'hover:text-[#181C26]'
              }`}
            >
              Service Advisories
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions (30s LTA Poll Cycle + Refresh Button) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => triggerLiveRefresh(true)}
              aria-label="Refresh LTA DataMall Bus Timings"
              className="h-10 px-3.5 rounded-lg bg-[#8B1D74] hover:bg-[#5A1657] text-white font-display text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-5 h-5 -rotate-90 shrink-0" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r={circleRadius}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r={circleRadius}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="tabular-nums">
                {isRefreshing ? 'Syncing...' : `Poll ${pollCountdown}s`}
              </span>
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (1200px max-width per Design System) */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-6">
        {/* Top Search & Bus Stop Selector Bar */}
        <section className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* 48px Height Search Input with Leading Search & Trailing GPS Action */}
            <div className="lg:col-span-6 relative">
              <div className="relative flex items-center h-12 w-full bg-white border border-[#E2E8F0] rounded-lg focus-within:ring-2 focus-within:ring-[#8B1D74] focus-within:border-[#8B1D74] transition-all">
                <Search className="w-4 h-4 text-[#85727D] ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 5-digit stop code (01012), road, or bus service (147, 190)..."
                  className="w-full h-full px-3 text-sm text-[#181C26] placeholder-[#85727D] bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="p-2 text-[#85727D] hover:text-[#181C26] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLocateNearestStop}
                  title="Locate Nearest Bus Stop via GPS"
                  className="mr-1.5 h-9 px-3 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1A365D] font-display text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#8B1D74]" />
                  <span className="hidden sm:inline">Near Me</span>
                </button>
              </div>

              {gpsStatus && (
                <div className="mt-1.5 text-xs font-medium text-[#8B1D74] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{gpsStatus}</span>
                </div>
              )}
            </div>

            {/* Interactive Bus Stop Switcher Pills */}
            <div className="lg:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {matchingStops.map((stop) => {
                const isActive = stop.code === selectedStop.code;
                return (
                  <button
                    key={stop.code}
                    type="button"
                    onClick={() => {
                      setSelectedStopCode(stop.code);
                      if (stop.services.length > 0) {
                        setSelectedServiceNo(stop.services[0].serviceNo);
                      }
                    }}
                    className={`h-11 px-3.5 rounded-lg font-display text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1A365D] text-white'
                        : 'bg-white text-[#181C26] border border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <span className="tabular-nums font-bold">{stop.code}</span>
                    <span className="opacity-50">·</span>
                    <span className="truncate max-w-[130px]">{stop.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* TAB 1: LIVE ARRIVALS & SPLIT MONITOR (Default View) */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Active Bus Stop Header + Arrival Cards List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Bus Stop Infrastructure Banner */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded bg-[#1A365D] text-white font-display font-bold text-sm tabular-nums">
                        {selectedStop.code}
                      </span>
                      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#181C26] tracking-tight">
                        {selectedStop.name}
                      </h1>
                    </div>

                    {/* Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#53424C] mt-1.5">
                      <span className="font-medium text-[#181C26]">
                        {selectedStop.roadName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedStop.district}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {selectedStop.distanceMeters}m away
                      </span>
                    </div>
                  </div>

                  {/* MRT Interchange Badges */}
                  {selectedStop.mrtConnections && (
                    <div className="flex items-center gap-1.5">
                      {selectedStop.mrtConnections.map((mrt) => (
                        <span
                          key={mrt.code}
                          className="px-2 py-1 rounded text-xs font-display font-bold text-white tabular-nums"
                          style={{ backgroundColor: mrt.lineColor }}
                          title={`${mrt.stationName} MRT Station`}
                        >
                          {mrt.code} {mrt.stationName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter Segmented Control + LTA Load Legend */}
                <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                    {(
                      [
                        { id: 'ALL', label: 'All Services' },
                        { id: 'TRUNK', label: 'Trunk' },
                        { id: 'EXPRESS', label: 'Express' },
                        { id: 'SEATS_ONLY', label: 'Seats Avail' },
                      ] as { id: CategoryFilter; label: string }[]
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCategoryFilter(tab.id)}
                        className={`px-2.5 py-1.5 text-xs font-display font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          categoryFilter === tab.id
                            ? 'bg-white text-[#8B1D74] shadow-xs'
                            : 'text-[#53424C] hover:text-[#181C26]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* LTA Capacity Legend */}
                  <div className="flex items-center gap-3 text-xs text-[#53424C]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#059669]" />
                      <span>SEA Seats</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      <span>SDA Stand</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      <span>LSD Limited</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bus Arrival Cards Stack (space-sm / 8px-12px vertical rhythm) */}
              {filteredServices.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredServices.map((service) => (
                    <BusArrivalCard
                      key={service.serviceNo}
                      service={service}
                      stopCode={selectedStop.code}
                      isSelected={service.serviceNo === selectedServiceNo}
                      isBookmarked={isPairBookmarked(
                        selectedStop.code,
                        service.serviceNo
                      )}
                      onSelectService={(svcNo) => setSelectedServiceNo(svcNo)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 text-center">
                  <Bus className="w-8 h-8 text-[#85727D] mx-auto mb-2" />
                  <h3 className="font-display font-bold text-base text-[#181C26]">
                    No matching bus services at this stop
                  </h3>
                  <p className="text-sm text-[#53424C] mt-1">
                    Reset the category filter or clear your search query to view all LTA arrivals.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="mt-4 h-10 px-4 rounded-lg bg-[#8B1D74] text-white font-display text-xs font-semibold cursor-pointer"
                  >
                    Show All Services
                  </button>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Live Telemetry Map + Route Sequence Monitor */}
            <div className="lg:col-span-5 space-y-5">
              <InteractiveTransitMap
                selectedStop={selectedStop}
                allStops={stopsData}
                onSelectStop={(code) => setSelectedStopCode(code)}
                activeServiceNo={selectedServiceNo}
                routeNodes={activeRouteDetail.directions[routeDirection]}
              />

              <RouteSequencePanel
                routeDetail={activeRouteDetail}
                currentStopCode={selectedStop.code}
                direction={routeDirection}
                onToggleDirection={() =>
                  setRouteDirection((prev) => (prev === 1 ? 2 : 1))
                }
                onSelectStopFromRoute={(stopCode) => {
                  const found = stopsData.find((s) => s.code === stopCode);
                  if (found) {
                    setSelectedStopCode(found.code);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ROUTE EXPLORER VIEW */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h2 className="font-display text-lg font-bold text-[#181C26]">
                  Trunk & Express Route Directory
                </h2>
                <p className="text-xs text-[#53424C] mt-1">
                  Select a trunk service to inspect stop-by-stop headway, first/last bus timings, and active double-deck deployment.
                </p>

                <div className="mt-4 space-y-2">
                  {Object.values(ROUTE_SEQUENCES).map((route) => {
                    const active = route.serviceNo === activeRouteDetail.serviceNo;
                    return (
                      <button
                        key={route.serviceNo}
                        type="button"
                        onClick={() => setSelectedServiceNo(route.serviceNo)}
                        className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#F1F3FF] border-[#8B1D74]'
                            : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-10 min-w-[60px] px-3 rounded-full bg-[#8B1D74] text-white font-display font-bold text-lg flex items-center justify-center tabular-nums">
                            {route.serviceNo}
                          </span>
                          <div>
                            <div className="font-display font-semibold text-sm text-[#181C26]">
                              {route.direction1Label}
                            </div>
                            <div className="text-xs text-[#53424C] mt-0.5">
                              {route.operator} · {route.category} · Peak {route.headwayPeak}
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#8B1D74]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <InteractiveTransitMap
                selectedStop={selectedStop}
                allStops={stopsData}
                onSelectStop={(code) => setSelectedStopCode(code)}
                activeServiceNo={activeRouteDetail.serviceNo}
                routeNodes={activeRouteDetail.directions[routeDirection]}
              />
            </div>

            <div className="lg:col-span-7">
              <RouteSequencePanel
                routeDetail={activeRouteDetail}
                currentStopCode={selectedStop.code}
                direction={routeDirection}
                onToggleDirection={() =>
                  setRouteDirection((prev) => (prev === 1 ? 2 : 1))
                }
                onSelectStopFromRoute={(stopCode) => {
                  const found = stopsData.find((s) => s.code === stopCode);
                  if (found) {
                    setSelectedStopCode(found.code);
                    setActiveTab('live');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: SAVED / BOOKMARKED COMMUTER DASHBOARD */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[#181C26]">
                  Bookmarked Commuter Monitors
                </h2>
                <p className="text-sm text-[#53424C] mt-0.5">
                  Simultaneous multi-stop departure board for your daily Singapore transit routine.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className="h-10 px-4 rounded-lg border border-[#1A365D] text-[#1A365D] font-display text-xs font-semibold hover:bg-[#F1F5F9] cursor-pointer"
              >
                + Add Stop Services
              </button>
            </div>

            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((pair) => {
                  const stop = stopsData.find((s) => s.code === pair.stopCode);
                  const service = stop?.services.find(
                    (svc) => svc.serviceNo === pair.serviceNo
                  );
                  if (!stop || !service) return null;

                  return (
                    <div
                      key={`${pair.stopCode}-${pair.serviceNo}`}
                      className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#1A365D] text-white font-display font-bold text-xs tabular-nums">
                            {stop.code}
                          </span>
                          <span className="font-display font-semibold text-sm text-[#181C26]">
                            {stop.name}
                          </span>
                          <span className="text-xs text-[#53424C]">
                            · {stop.roadName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStopCode(stop.code);
                            setSelectedServiceNo(service.serviceNo);
                            setActiveTab('live');
                          }}
                          className="text-xs font-display font-semibold text-[#8B1D74] hover:underline cursor-pointer"
                        >
                          Open Stop →
                        </button>
                      </div>

                      <BusArrivalCard
                        service={service}
                        stopCode={stop.code}
                        isSelected={false}
                        isBookmarked={true}
                        onSelectService={(svcNo) => {
                          setSelectedStopCode(stop.code);
                          setSelectedServiceNo(svcNo);
                          setActiveTab('live');
                        }}
                        onToggleBookmark={toggleBookmark}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 text-center">
                <Bookmark className="w-8 h-8 text-[#85727D] mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-[#181C26]">
                  No bookmarked bus services yet
                </h3>
                <p className="text-sm text-[#53424C] mt-1">
                  Tap the bookmark icon on any bus arrival card to pin it to your personal departure dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('live')}
                  className="mt-4 h-11 px-5 rounded-lg bg-[#8B1D74] text-white font-display text-xs font-semibold cursor-pointer"
                >
                  Browse Live Bus Stops
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LTA SERVICE ADVISORIES & ROAD DIVERSIONS */}
        {activeTab === 'advisories' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5">
              <h2 className="font-display text-xl font-bold text-[#181C26]">
                Operational Service Announcements & Diversions
              </h2>
              <p className="text-sm text-[#53424C] mt-0.5">
                Live civic notices from SBS Transit, SMRT Buses, Tower Transit, and Go-Ahead Singapore.
              </p>
            </div>

            <div className="space-y-3">
              {SERVICE_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white border border-[#E2E8F0] rounded-lg p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-display font-semibold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${
                          alert.severity === 'DIVERSION'
                            ? 'bg-[#FFDBCA] text-[#5F2600]'
                            : alert.severity === 'DELAY'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#ECFDF5] text-[#059669]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[#53424C]">
                        {alert.interchangeOrRoad}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#833700]">{alert.effectiveWindow}</span>
                    </div>
                    <span className="text-xs text-[#85727D] tabular-nums">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-[#181C26] mt-2">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-[#53424C] mt-1 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#53424C] mr-1">
                        Affected Services:
                      </span>
                      {alert.servicesAffected.map((svcNo) => (
                        <button
                          key={svcNo}
                          type="button"
                          onClick={() => {
                            setSelectedServiceNo(svcNo);
                            setActiveTab('live');
                          }}
                          className="px-2.5 h-6 rounded-full bg-[#1A365D] hover:bg-[#8B1D74] text-white font-display font-bold text-xs tabular-nums transition-colors cursor-pointer"
                        >
                          {svcNo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Natural Thumb Zone, <= 15% Viewport Cap) */}
      <nav
        aria-label="Mobile Transit Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] grid grid-cols-4 items-center h-16 px-2"
      >
        <button
          type="button"
          onClick={() => setActiveTab('live')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'live' ? 'text-[#8B1D74]' : 'text-[#53424C]'
          }`}
        >
          <Bus className="w-5 h-5" />
          <span className="text-[11px] font-display font-semibold mt-0.5">
            Arrivals
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'routes' ? 'text-[#8B1D74]' : 'text-[#53424C]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[11px] font-display font-semibold mt-0.5">
            Routes
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'saved' ? 'text-[#8B1D74]' : 'text-[#53424C]'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[11px] font-display font-semibold mt-0.5">
            Saved ({bookmarks.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advisories')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'advisories' ? 'text-[#8B1D74]' : 'text-[#53424C]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[11px] font-display font-semibold mt-0.5">
            Alerts
          </span>
        </button>
      </nav>
    </div>
  );
}
