import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ExecutiveBanner } from './components/ExecutiveBanner';
import { HigherAuthorityAnswers } from './components/HigherAuthorityAnswers';
import { KpiSection } from './components/KpiSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { FilterBar } from './components/FilterBar';
import { DataTableSection } from './components/DataTableSection';
import { ExecutiveBriefingModal } from './components/ExecutiveBriefingModal';
import {
  CategoryStat,
  PhaseBreakdown,
  SchoolRecord,
  FilterState,
  SyncStatus,
} from './types';
import {
  BASELINE_CATEGORIES,
  OFFICIAL_PHASE_BREAKDOWN,
  PUNJAB_DISTRICTS,
  generateSampleSchoolRegistry,
} from './data/defaultData';
import { fetchLiveGoogleSheetData, SPREADSHEET_ID } from './services/googleSheetService';

export function App() {
  // Core Data States
  const [categories, setCategories] = useState<CategoryStat[]>(BASELINE_CATEGORIES);
  const [phaseData, setPhaseData] = useState<PhaseBreakdown>(OFFICIAL_PHASE_BREAKDOWN);
  const [schoolRecords] = useState<SchoolRecord[]>(() => generateSampleSchoolRegistry());
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  // Sync State for Google Sheet Connection
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLive: true,
    isLoading: false,
    lastSyncedAt: new Date(),
    sourceType: 'live_gviz',
    sheetId: SPREADSHEET_ID,
    errorMessage: null,
    autoRefreshEnabled: true,
    refreshIntervalSeconds: 45,
  });

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: '',
    grade: '',
    status: '',
    district: '',
    pafOnly: false,
  });

  // Sync with Google Sheet Function
  const loadSheetData = useCallback(async (isInitial = false) => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, errorMessage: null }));
    try {
      const result = await fetchLiveGoogleSheetData(SPREADSHEET_ID);
      setCategories(result.categories);
      setPhaseData(result.phaseBreakdown);
      setSyncStatus(prev => ({
        ...prev,
        isLoading: false,
        lastSyncedAt: result.syncedAt,
        sourceType: result.sourceType,
        errorMessage: result.warning || null,
        isLive: result.sourceType !== 'baseline',
      }));
    } catch (err: any) {
      console.warn('Sync encountered an issue, preserving current data:', err);
      setSyncStatus(prev => ({
        ...prev,
        isLoading: false,
        errorMessage: 'Unable to reach Google Sheet. Verified baseline data active.',
      }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadSheetData(true);
  }, [loadSheetData]);

  // Auto-polling interval to keep data real-time if any changes happen in Google Sheet
  useEffect(() => {
    if (!syncStatus.autoRefreshEnabled) return;

    const interval = setInterval(() => {
      loadSheetData(false);
    }, syncStatus.refreshIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [syncStatus.autoRefreshEnabled, syncStatus.refreshIntervalSeconds, loadSheetData]);

  // Handle manual filter updates
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      category: '',
      grade: '',
      status: '',
      district: '',
      pafOnly: false,
    });
  };

  const handleQuickFilterCategory = (categoryKey: string) => {
    if (categoryKey === 'approved') {
      setFilterState({
        searchQuery: '',
        category: '',
        grade: '',
        status: 'Approved',
        district: '',
        pafOnly: false,
      });
    } else {
      setFilterState({
        searchQuery: '',
        category: categoryKey,
        grade: '',
        status: '',
        district: '',
        pafOnly: false,
      });
    }
  };

  // Extract list of all districts for dropdown
  const districtList = useMemo(() => {
    return PUNJAB_DISTRICTS.map(d => d.name).sort();
  }, []);

  // Filtered Categories (for category table view)
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      if (filterState.category && cat.category !== filterState.category) {
        return false;
      }
      if (filterState.grade) {
        const g = filterState.grade.toLowerCase();
        if (!cat.category.toLowerCase().includes(g) && !cat.grade.toLowerCase().includes(g)) {
          return false;
        }
      }
      if (filterState.pafOnly && cat.classification !== 'paf_transition') {
        return false;
      }
      if (filterState.failureReason) {
        if (filterState.failureReason === 'rooms' && !cat.category.toLowerCase().includes('rooms')) return false;
        if (filterState.failureReason === 'area' && !cat.category.toLowerCase().includes('area')) return false;
        if (filterState.failureReason === 'distance' && !cat.category.toLowerCase().includes('distance')) return false;
        if (filterState.failureReason === 'no_data' && !cat.category.toLowerCase().includes('no data')) return false;
        if (filterState.failureReason === 'any_fail' && (cat.classification === 'approved' || cat.classification === 'paf_transition')) return false;
      }
      if (filterState.status) {
        if (filterState.status === 'Approved' && cat.classification !== 'approved' && cat.classification !== 'paf_transition') {
          return false;
        }
        if (filterState.status === 'Direct Approved' && cat.classification !== 'approved') {
          return false;
        }
        if (filterState.status === 'PAF Transition' && cat.classification !== 'paf_transition') {
          return false;
        }
        if (filterState.status === 'Failed' && (cat.classification === 'approved' || cat.classification === 'paf_transition')) {
          return false;
        }
        if (filterState.status === 'Rooms Failed' && cat.category !== 'Rooms fail') {
          return false;
        }
        if (filterState.status === 'Area Failed' && cat.category !== 'Area failed') {
          return false;
        }
        if (filterState.status === 'Distance Failed' && cat.category !== 'Distance Failed') {
          return false;
        }
        if (filterState.status === 'No Data Available' && cat.category !== 'No Data Available') {
          return false;
        }
      }
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesCategory = cat.category.toLowerCase().includes(query);
        const matchesDesc = cat.description.toLowerCase().includes(query);
        const matchesAction = cat.actionRequired.toLowerCase().includes(query);
        if (!matchesCategory && !matchesDesc && !matchesAction) return false;
      }
      return true;
    });
  }, [categories, filterState]);

  // Filtered School Records (for school registry view)
  const filteredSchools = useMemo(() => {
    return schoolRecords.filter(school => {
      if (filterState.district && school.district !== filterState.district) {
        return false;
      }
      if (filterState.category && school.categoryKey !== filterState.category) {
        return false;
      }
      if (filterState.grade) {
        const g = filterState.grade.toLowerCase();
        const matchesGrade = 
          school.appliedForGrade.toLowerCase().includes(g) || 
          school.categoryKey.toLowerCase().includes(g);
        if (!matchesGrade) return false;
      }
      if (filterState.pafOnly && school.eligibilityStatus !== 'PAF Transition') {
        return false;
      }
      if (filterState.failureReason) {
        if (filterState.failureReason === 'rooms' && school.eligibilityStatus !== 'Rooms Failed') return false;
        if (filterState.failureReason === 'area' && school.eligibilityStatus !== 'Area Failed') return false;
        if (filterState.failureReason === 'distance' && school.eligibilityStatus !== 'Distance Failed') return false;
        if (filterState.failureReason === 'no_data' && school.eligibilityStatus !== 'No Data Available') return false;
        if (filterState.failureReason === 'any_fail' && (school.eligibilityStatus === 'Approved' || school.eligibilityStatus === 'PAF Transition')) return false;
      }
      if (filterState.status) {
        if (filterState.status === 'Approved' && (school.eligibilityStatus !== 'Approved' && school.eligibilityStatus !== 'PAF Transition')) {
          return false;
        }
        if (filterState.status === 'Direct Approved' && school.eligibilityStatus !== 'Approved') {
          return false;
        }
        if (filterState.status === 'PAF Transition' && school.eligibilityStatus !== 'PAF Transition') {
          return false;
        }
        if (filterState.status === 'Failed' && (school.eligibilityStatus === 'Approved' || school.eligibilityStatus === 'PAF Transition')) {
          return false;
        }
        if (['Rooms Failed', 'Area Failed', 'Distance Failed', 'No Data Available'].includes(filterState.status)) {
          if (school.eligibilityStatus !== filterState.status) return false;
        }
      }
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesName = school.schoolName.toLowerCase().includes(query);
        const matchesEmis = school.emisCode.toLowerCase().includes(query);
        const matchesDistrict = school.district.toLowerCase().includes(query);
        const matchesTehsil = school.tehsil.toLowerCase().includes(query);
        const matchesRemarks = school.remarks.toLowerCase().includes(query);
        const matchesStatus = school.eligibilityStatus.toLowerCase().includes(query);
        if (!matchesName && !matchesEmis && !matchesDistrict && !matchesTehsil && !matchesRemarks && !matchesStatus) {
          return false;
        }
      }
      return true;
    });
  }, [schoolRecords, filterState]);

  // Calculate filtered counts
  const totalFilteredSchoolsCount = filteredSchools.length;
  const grandTotalPool = phaseData.grandTotalPool || 3905;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-700 selection:text-white">
      
      {/* 1. Official PEIMA Government Header */}
      <Header
        syncStatus={syncStatus}
        onRefresh={() => loadSheetData(false)}
        onToggleAutoRefresh={() =>
          setSyncStatus(prev => ({ ...prev, autoRefreshEnabled: !prev.autoRefreshEnabled }))
        }
        categories={categories}
        phaseData={phaseData}
        schoolRecords={schoolRecords}
        onOpenExecutiveBriefing={() => setIsBriefingOpen(true)}
      />

      {/* 2. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Sync / Status Notice Banner if present */}
        {syncStatus.errorMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{syncStatus.errorMessage}</span>
            </div>
            <button
              onClick={() => loadSheetData(false)}
              className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* 3. Executive Math & Pipeline Reconciliation Banner */}
        <ExecutiveBanner phaseData={phaseData} />

        {/* 4. Strategic Executive Questions Answered */}
        <HigherAuthorityAnswers
          categories={categories}
          phaseData={phaseData}
          onFilterCategory={handleQuickFilterCategory}
        />

        {/* 5. Key Performance Indicators Section */}
        <KpiSection
          categories={categories}
          phaseData={phaseData}
          onFilterCategory={handleQuickFilterCategory}
        />

        {/* 6. Visual Analytics & Charts Section */}
        <AnalyticsSection
          categories={categories}
          phaseData={phaseData}
          schoolRecords={schoolRecords}
        />

        {/* 7. Executive Filter & Search Console */}
        <FilterBar
          filterState={filterState}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          categories={categories}
          districts={districtList}
          totalFilteredCount={totalFilteredSchoolsCount}
          totalPoolCount={grandTotalPool}
        />

        {/* 8. Detailed Registers & Data Table Section */}
        <DataTableSection
          categories={categories}
          filteredCategories={filteredCategories}
          schoolRecords={schoolRecords}
          filteredSchools={filteredSchools}
          phaseData={phaseData}
          onFilterByCategory={handleQuickFilterCategory}
        />

      </main>

      {/* 9. Executive Briefing Modal (Printable) */}
      <ExecutiveBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        categories={categories}
        phaseData={phaseData}
      />

      {/* 10. Official Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">PEIMA Upgradation Monitoring System</span>
            <span>•</span>
            <span>Government of the Punjab</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            Connected to Live Google Sheet ID: <span className="font-mono text-slate-400">1GQ6LM5...</span> | Auto-synced on spreadsheet changes
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
