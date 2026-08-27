import React from 'react';
import { PhaseBreakdown } from '../types';
import { ArrowRight, CheckCircle, Calculator, Building2, TrendingUp, Layers } from 'lucide-react';

interface ExecutiveBannerProps {
  phaseData: PhaseBreakdown;
}

export const ExecutiveBanner: React.FC<ExecutiveBannerProps> = ({ phaseData }) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-6">
      {/* Banner Top Strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Building2 className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
              Executive Upgradation Pipeline &amp; Summary Reconciliation
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Departmental audit formula: Initial Universe &minus; Phase 1 Approvals + Multi-Grade Re-evaluations = Active Evaluation Pool
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono">
            Phase-1 Completed: {phaseData.totalPhase1Approved}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-md font-mono">
            Active Pool: {phaseData.grandTotalPool.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4-Step Mathematical Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Step 1: Initial Universe */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 1: Total Universe</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {phaseData.totalInitialSchools.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Baseline primary &amp; elementary schools registered across Punjab
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Registered Schools</span>
            <span className="font-bold text-slate-800">100%</span>
          </div>
        </div>

        {/* Step 2: Phase 1 Approved */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Step 2: Phase 1 Approved</span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                &minus; 397
              </span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-800 font-mono tracking-tight">
              {phaseData.totalPhase1Approved.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-800 mt-1.5 flex flex-wrap gap-1">
              <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-medium">8th: {phaseData.phase1Approved8th}</span>
              <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-medium">7th: {phaseData.phase1Approved7th}</span>
              <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-medium">6th: {phaseData.phase1Approved6th}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
            <span>Net Remaining</span>
            <span className="font-bold text-emerald-950 font-mono">3,879 Schools</span>
          </div>
        </div>

        {/* Step 3: Progressive / Multi-Grade Re-evaluations */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Step 3: Re-evaluated</span>
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 font-mono">
                + 26
              </span>
            </div>
            <div className="text-3xl font-extrabold text-amber-900 font-mono tracking-tight">
              {phaseData.totalMoved}
            </div>
            <div className="text-[11px] text-amber-900 mt-1.5 flex flex-wrap gap-1">
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-medium">7 &rarr; 8: {phaseData.moved7to8}</span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-medium">6 &rarr; 7: {phaseData.moved6to7}</span>
              <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-medium">6 &rarr; 8: {phaseData.moved6to8}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900 font-medium">
            <span>Multi-Grade Elevations</span>
            <span className="font-bold text-amber-950 font-mono">26 Schools Added</span>
          </div>
        </div>

        {/* Step 4: Active Grand Total Pool */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-xs flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grand Total Pool</span>
              <span className="text-[10px] font-bold text-white bg-slate-700 px-2 py-0.5 rounded">
                Active Focus
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {phaseData.grandTotalPool.toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Current pool under active evaluation for Phase-2 approvals &amp; civil works
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span>Formula</span>
            <span className="font-bold text-white font-mono">3,879 + 26 = 3,905</span>
          </div>
        </div>

      </div>
    </section>
  );
};
