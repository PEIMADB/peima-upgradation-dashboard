import React from 'react';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2, AlertOctagon, Building, Layers } from 'lucide-react';
import { CategoryStat, PhaseBreakdown } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import peimaLogo from '../assets/images/peima_logo_1787825703026.jpg';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryStat[];
  phaseData: PhaseBreakdown;
}

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({
  isOpen,
  onClose,
  categories,
  phaseData,
}) => {
  if (!isOpen) return null;

  const grandTotal = phaseData.grandTotalPool || 3905;
  const approvedTotal = categories
    .filter(c => c.classification === 'approved' || c.classification === 'paf_transition')
    .reduce((s, c) => s + c.count, 0);

  const roomsDeficit = categories.find(c => c.category === 'Rooms fail')?.count || 1949;
  const areaDeficit = categories.find(c => c.category === 'Area failed')?.count || 910;
  const distanceDeficit = categories.find(c => c.category === 'Distance Failed')?.count || 528;
  const noData = categories.find(c => c.category === 'No Data Available')?.count || 74;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white print:hidden sticky top-0 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              Official Briefing
            </span>
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">
              Executive Upgradation Summary for Higher Authority
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900">
          
          {/* Government Formal Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <img
              src={peimaLogo}
              alt="PEIMA Emblem"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-800 p-0.5 bg-white shadow-xs flex-shrink-0"
            />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Government of the Punjab • School Education Department
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Punjab Education Initiatives Management Authority (PEIMA)
              </h1>
              <div className="text-xs font-semibold text-emerald-900 mt-0.5">
                School Upgradation, Eligibility &amp; Infrastructure Assessment Directorate
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span><strong>Doc Ref:</strong> PEIMA/DIR-UPG/2026-08</span>
                <span>•</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span className="font-bold text-slate-700">Executive Confidential</span>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-xs font-bold uppercase text-slate-500">Subject:</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Comprehensive Audit &amp; Reconciliation of 4,276 Registered Schools: Phase-1 Sanctions, Multi-Grade Re-evaluations, and 3,905 Active Evaluation Pool
            </div>
          </div>

          {/* Section 1: Executive Mathematical Reconciliation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
              1. Pipeline Reconciliation Formula
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">Initial Universe</div>
                <div className="text-base font-extrabold text-slate-900 font-mono">4,276</div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <div className="text-emerald-800 font-medium">Phase 1 Approved</div>
                <div className="text-base font-extrabold text-emerald-900 font-mono">&minus; 397</div>
                <div className="text-[10px] text-emerald-700 font-medium">8th: 235 | 7th: 96 | 6th: 66</div>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <div className="text-amber-800 font-medium">Re-evaluated (PAF)</div>
                <div className="text-base font-extrabold text-amber-900 font-mono">+ 26</div>
                <div className="text-[10px] text-amber-700 font-medium">7&rarr;8: 7 | 6&rarr;7: 5 | 6&rarr;8: 14</div>
              </div>
              <div className="bg-slate-800 text-white p-2.5 rounded-lg">
                <div className="text-slate-300 font-medium">Active Evaluation Pool</div>
                <div className="text-base font-extrabold text-white font-mono">3,905</div>
                <div className="text-[10px] text-slate-300">3,879 + 26 = 3,905</div>
              </div>
            </div>
          </div>

          {/* Section 2: Complete Category Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
              2. Distribution Breakdown across the 3,905 Active Pool
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr>
                  <th className="p-2 border-b border-slate-200">Grade / Category</th>
                  <th className="p-2 border-b border-slate-200 text-right">No. of Schools</th>
                  <th className="p-2 border-b border-slate-200 text-right">% of Pool</th>
                  <th className="p-2 border-b border-slate-200">Classification</th>
                  <th className="p-2 border-b border-slate-200">Mandated Authority Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(c => (
                  <tr key={c.id}>
                    <td className="p-2 font-semibold text-slate-900">{c.category}</td>
                    <td className="p-2 text-right font-mono font-bold">{c.count.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">{c.percentage.toFixed(2)}%</td>
                    <td className="p-2 text-slate-700 capitalize">{c.classification.replace(/_/g, ' ')}</td>
                    <td className="p-2 text-[11px] text-slate-600">{c.actionRequired}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800 text-white font-bold">
                <tr>
                  <td className="p-2">Grand Total Pool</td>
                  <td className="p-2 text-right font-mono text-white">3,905</td>
                  <td className="p-2 text-right font-mono">100.00%</td>
                  <td className="p-2" colSpan={2}>Reconciled Against Official Authority Master Records</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Section 3: Strategic Recommendations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
              3. Strategic Policy Directives for Decision
            </h3>
            <div className="space-y-2 text-xs text-slate-800 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Directive A (Immediate Phase-2 Notifications):</strong> Clear administrative sanction orders for <strong>444 qualifying institutions</strong> (181 in 6th, 94 in 7th, 143 in 8th, plus 26 PAF transitions).
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Directive B (Civil Works &amp; ADP Prioritization):</strong> Address the classroom deficit affecting <strong>1,949 schools (49.9%)</strong> by commissioning prefabricated classroom additions in highest enrollment primary schools.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Directive C (7-Day Field Audit):</strong> Mandate District Monitoring Units (DMUs) to complete field inspection of the <strong>74 schools with missing data</strong> within 7 calendar days.
              </div>
            </div>
          </div>

          {/* Sign-off Block */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-700">
            <div>
              <div className="font-bold">Prepared by:</div>
              <div>EMIS &amp; Data Analysis Directorate</div>
              <div>PEIMA, Lahore</div>
            </div>
            <div className="text-right">
              <div className="font-bold">Submitted to:</div>
              <div>Chief Executive Officer / Secretary</div>
              <div>School Education Department, Punjab</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
