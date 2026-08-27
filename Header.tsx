import React, { useState } from 'react';
import { RefreshCw, Download, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Wifi, Clock, ChevronDown, Printer, Building2, ShieldCheck } from 'lucide-react';
import { SyncStatus, CategoryStat, PhaseBreakdown, SchoolRecord } from '../types';
import { exportToExcel, exportCategoriesCsv, exportSchoolsCsv } from '../utils/exportUtils';
import peimaLogo from '../assets/images/peima_logo_1787825703026.jpg';

interface HeaderProps {
  syncStatus: SyncStatus;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  categories: CategoryStat[];
  phaseData: PhaseBreakdown;
  schoolRecords: SchoolRecord[];
  onOpenExecutiveBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  syncStatus,
  onRefresh,
  onToggleAutoRefresh,
  categories,
  phaseData,
  schoolRecords,
  onOpenExecutiveBriefing,
}) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Top government authority micro-bar */}
      <div className="bg-slate-900 text-slate-200 px-4 sm:px-8 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold tracking-wider uppercase text-slate-100">GOVERNMENT OF THE PUNJAB</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">School Education Department</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">PEIMA Directorate</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Database Connected
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-mono">Phase 1 &amp; Phase 2 Master Portal</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Identity & PEIMA Logo Brand */}
          <div className="flex items-center gap-3.5">
            {/* Official PEIMA Logo */}
            <div className="relative flex-shrink-0">
              {!imgError ? (
                <img
                  src={peimaLogo}
                  alt="PEIMA Official Logo"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-700/80 shadow-xs bg-white p-0.5"
                />
              ) : (
                <div className="w-13 h-13 sm:w-14 sm:h-14 bg-emerald-800 flex flex-col items-center justify-center rounded-full shadow-inner flex-shrink-0 text-white font-bold text-xs text-center border-2 border-emerald-900 leading-none">
                  <span className="text-[11px] tracking-wider font-extrabold text-white">PEIMA</span>
                  <span className="text-[8px] font-semibold text-emerald-200 uppercase mt-0.5">PUNJAB</span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-emerald-800 text-white p-0.5 rounded-full border border-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase font-sans">
                  Punjab Education Initiatives Management Authority
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  PEIMA Upgradation Matrix
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-2">
                <span className="text-emerald-900 font-bold">School Upgradation &amp; Classification Dashboard</span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="text-slate-600 font-semibold hidden md:inline">3,905 Active Evaluation Pool</span>
                <span className="text-slate-300 hidden lg:inline">•</span>
                <span className="text-slate-500 font-normal hidden lg:inline">Phases 1 &amp; 2 Reconciled</span>
              </p>
            </div>
          </div>

          {/* Controls & Export Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Live Sync Status Indicator */}
            <div className="flex items-center bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
              <span>{syncStatus.sourceType === 'baseline' ? 'Verified Base' : 'Live: Sheets Connected'}</span>
              <span className="text-emerald-300 mx-1.5">|</span>
              <span className="text-[11px] text-emerald-700 font-normal font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(syncStatus.lastSyncedAt)}
              </span>
            </div>

            {/* Sync Now Button */}
            <button
              onClick={onRefresh}
              disabled={syncStatus.isLoading}
              title="Fetch fresh data from Google Sheet"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isLoading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>{syncStatus.isLoading ? 'Syncing...' : 'Sync Sheet'}</span>
            </button>

            {/* Executive Briefing Button */}
            <button
              onClick={onOpenExecutiveBriefing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Brief</span>
            </button>

            {/* Download Data Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Data</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {downloadMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDownloadMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Authorized Data Export
                    </div>
                    
                    <button
                      onClick={() => {
                        exportToExcel(categories, phaseData, schoolRecords);
                        setDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 transition text-slate-800 font-medium cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="font-semibold text-slate-900">Complete Excel Workbook (.xlsx)</div>
                        <div className="text-[10px] text-slate-500">Summary, Categories &amp; All 3,905 Schools</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        exportCategoriesCsv(categories);
                        setDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 transition text-slate-800 font-medium cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-teal-700" />
                      <div>
                        <div className="font-semibold text-slate-900">Category Breakdown (.csv)</div>
                        <div className="text-[10px] text-slate-500">10 Eligibility &amp; Failure Categories</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        exportSchoolsCsv(schoolRecords);
                        setDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 transition text-slate-800 font-medium cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                      <div>
                        <div className="font-semibold text-slate-900">School EMIS Registry (.csv)</div>
                        <div className="text-[10px] text-slate-500">Detailed list of schools with attributes</div>
                      </div>
                    </button>
                    
                    <div className="mt-1 pt-1.5 border-t border-slate-100 px-3.5 py-1 text-[10px] text-slate-400 italic">
                      Live sync updates automatically on sheet edit
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
