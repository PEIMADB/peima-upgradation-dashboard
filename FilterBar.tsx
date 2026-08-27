import React from 'react';
import { Search, Filter, RotateCcw, Building2, CheckCircle2, AlertTriangle, Layers, X, ShieldCheck, MapPin, Ruler } from 'lucide-react';
import { FilterState, CategoryStat } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onReset: () => void;
  categories: CategoryStat[];
  districts: string[];
  totalFilteredCount: number;
  totalPoolCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onReset,
  categories,
  districts,
  totalFilteredCount,
  totalPoolCount,
}) => {
  const isFiltered = 
    Boolean(filterState.searchQuery) ||
    Boolean(filterState.category) ||
    Boolean(filterState.grade) ||
    Boolean(filterState.status) ||
    Boolean(filterState.failureReason) ||
    Boolean(filterState.district) ||
    filterState.pafOnly;

  const quickPills = [
    { label: 'All Schools', count: totalPoolCount, filter: { category: '', grade: '', status: '', failureReason: '', pafOnly: false } },
    { label: 'Approved & Upgraded', count: 444, filter: { status: 'Approved', category: '', grade: '', failureReason: '', pafOnly: false } },
    { label: 'Rooms Deficit', count: 1949, filter: { failureReason: 'rooms', category: '', status: '', grade: '', pafOnly: false } },
    { label: 'Area Deficit', count: 910, filter: { failureReason: 'area', category: '', status: '', grade: '', pafOnly: false } },
    { label: 'Distance Overlap', count: 528, filter: { failureReason: 'distance', category: '', status: '', grade: '', pafOnly: false } },
    { label: 'Missing Data', count: 74, filter: { failureReason: 'no_data', category: '', status: '', grade: '', pafOnly: false } },
    { label: 'PAF Transitions (26)', count: 26, filter: { pafOnly: true, category: '', status: '', grade: '', failureReason: '' } },
    { label: '8th Grade', count: 1556, filter: { grade: '8th', category: '', status: '', failureReason: '', pafOnly: false } },
    { label: '7th Grade', count: 851, filter: { grade: '7th', category: '', status: '', failureReason: '', pafOnly: false } },
    { label: '6th Grade', count: 1498, filter: { grade: '6th', category: '', status: '', failureReason: '', pafOnly: false } },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6">
      
      {/* Header & Result Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-800 text-white shadow-2xs">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Interactive Filter &amp; Search Console
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            Multi-attribute school query &amp; eligibility screening
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">
            Showing <strong className="text-slate-900 font-mono">{totalFilteredCount.toLocaleString()}</strong> of <strong className="text-slate-900 font-mono">{totalPoolCount.toLocaleString()}</strong> schools
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition cursor-pointer border border-slate-300 shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-slate-600" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-3">
        
        {/* 1. Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Search Keyword / EMIS
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search EMIS code, school name, tehsil..."
              value={filterState.searchQuery}
              onChange={e => onFilterChange({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white text-slate-900 transition font-medium"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Grade Level Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Grade Level
          </label>
          <select
            value={filterState.grade}
            onChange={e => onFilterChange({ grade: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white text-slate-800 font-medium transition cursor-pointer"
          >
            <option value="">All Grades</option>
            <option value="6th">6th Grade (1,498)</option>
            <option value="7th">7th Grade (851)</option>
            <option value="8th">8th Grade (1,556)</option>
            <option value="6th to 7th">6th to 7th (PAF)</option>
            <option value="7th to 8th">7th to 8th (PAF)</option>
            <option value="6th to 8th">6th to 8th (PAF)</option>
          </select>
        </div>

        {/* 3. Approval Status Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Approval Status
          </label>
          <select
            value={filterState.status}
            onChange={e => onFilterChange({ status: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white text-slate-800 font-medium transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved (444 Total)</option>
            <option value="Direct Approved">Direct Approved (418)</option>
            <option value="PAF Transition">PAF Transition (26)</option>
            <option value="Failed">All Ineligible / Failed (3,461)</option>
          </select>
        </div>

        {/* 4. Failure Reasons Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Failure Reason
          </label>
          <select
            value={filterState.failureReason || ''}
            onChange={e => onFilterChange({ failureReason: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white text-slate-800 font-medium transition cursor-pointer"
          >
            <option value="">All Failure Reasons</option>
            <option value="any_fail">Any Failure (3,461)</option>
            <option value="rooms">Rooms Deficit (1,949)</option>
            <option value="area">Area Deficit (910)</option>
            <option value="distance">Distance Overlap (528)</option>
            <option value="no_data">Missing / No Data (74)</option>
          </select>
        </div>

        {/* 5. District Dropdown */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Punjab District
          </label>
          <select
            value={filterState.district}
            onChange={e => onFilterChange({ district: e.target.value })}
            className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white text-slate-800 font-medium transition cursor-pointer"
          >
            <option value="">All 36 Districts</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Active Filters Tag Bar (if any active) */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 py-2 px-3 mb-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Active Filters:
          </span>
          {filterState.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              Search: "{filterState.searchQuery}"
              <button onClick={() => onFilterChange({ searchQuery: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.grade && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              Grade: {filterState.grade}
              <button onClick={() => onFilterChange({ grade: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              Status: {filterState.status}
              <button onClick={() => onFilterChange({ status: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.failureReason && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              Failure: {filterState.failureReason.replace('_', ' ').toUpperCase()}
              <button onClick={() => onFilterChange({ failureReason: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              Category: {filterState.category}
              <button onClick={() => onFilterChange({ category: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.district && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800 font-medium">
              District: {filterState.district}
              <button onClick={() => onFilterChange({ district: '' })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterState.pafOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-300 text-teal-800 font-semibold">
              PAF Transitions Only
              <button onClick={() => onFilterChange({ pafOnly: false })} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={onReset}
            className="text-[11px] text-rose-700 hover:text-rose-900 underline font-semibold ml-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Quick Filter Chips / Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase text-slate-500 mr-1 tracking-wider">
          Quick Filters:
        </span>
        {quickPills.map(pill => {
          const isActive = 
            (pill.filter.category === filterState.category &&
             pill.filter.status === filterState.status &&
             pill.filter.grade === filterState.grade &&
             (pill.filter.failureReason ?? '') === (filterState.failureReason ?? '') &&
             pill.filter.pafOnly === filterState.pafOnly &&
             (pill.filter.category !== '' || pill.filter.status !== '' || pill.filter.grade !== '' || Boolean(pill.filter.failureReason) || pill.filter.pafOnly));

          const isAll = !isFiltered && pill.label === 'All Schools';

          return (
            <button
              key={pill.label}
              onClick={() => onFilterChange(pill.filter)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                isActive || isAll
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{pill.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isActive || isAll ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {pill.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
};
