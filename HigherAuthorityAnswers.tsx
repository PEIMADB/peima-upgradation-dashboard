import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, AlertOctagon, Lightbulb, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { CategoryStat, PhaseBreakdown } from '../types';

interface HigherAuthorityAnswersProps {
  categories: CategoryStat[];
  phaseData: PhaseBreakdown;
  onFilterCategory?: (categoryName: string) => void;
}

export const HigherAuthorityAnswers: React.FC<HigherAuthorityAnswersProps> = ({
  categories,
  phaseData,
  onFilterCategory,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getCount = (name: string) => categories.find(c => c.category === name)?.count || 0;

  const totalPool = phaseData.grandTotalPool || 3905;
  const approvedInPool = (getCount('6th') + getCount('7th') + getCount('8th') + getCount('7th ( .paf 6th )') + getCount('8th ( .paf 7th )') + getCount('8th ( .paf 6th )'));
  const totalApprovedUniverse = phaseData.totalPhase1Approved + approvedInPool; // 397 + 444 = 841

  const roomsDeficit = getCount('Rooms fail');
  const areaDeficit = getCount('Area failed');
  const distanceOverlap = getCount('Distance Failed');
  const noData = getCount('No Data Available');

  const questions = [
    {
      id: 'q1',
      question: '1. What is the net departmental achievement & immediate upgradation capacity?',
      summary: `841 Total Schools approved across Punjab (397 in Phase 1 + 444 in Active Pool). 444 schools ready for immediate administrative sanction.`,
      icon: CheckCircle2,
      badge: 'Executive Brief',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            Out of the initial universe of <strong>{phaseData.totalInitialSchools.toLocaleString()}</strong> primary and elementary institutions:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>397 Schools</strong> were formally notified in Phase 1 (235 for 8th, 96 for 7th, 66 for 6th).</li>
            <li><strong>444 Schools</strong> in the current pool satisfy all required infrastructure parameters (181 for 6th, 94 for 7th, 143 for 8th, plus 26 multi-grade progressive PAF transitions).</li>
            <li><strong>Recommendation:</strong> Department should issue immediate Phase-2 notification letters for these 444 institutions prior to the upcoming academic enrollment cycle.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'q2',
      question: '2. Why are 3,387 schools (86.7% of pool) failing eligibility criteria?',
      summary: `Classroom deficit is the primary bottleneck (1,949 schools / 49.9%), followed by insufficient land area (910 schools / 23.3%) and catchment distance overlap (528 schools / 13.5%).`,
      icon: AlertOctagon,
      badge: 'Infrastructure Audit',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      details: (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="space-y-2 my-2">
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-md flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-800">Inadequate Rooms: 1,949 Schools (57.5% of failures)</p>
                <p className="text-[11px] text-rose-600">Failed basic classroom infrastructure requirements. Average shortage: 2 to 3 rooms.</p>
              </div>
              <span className="text-lg font-black text-rose-700 font-mono">1,949</span>
            </div>

            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-md flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-800">Area Requirement Failed: 910 Schools (26.9% of failures)</p>
                <p className="text-[11px] text-amber-600">Plot size below authority mandate (&lt; 3.0 Kanals). Requires vertical survey.</p>
              </div>
              <span className="text-lg font-black text-amber-700 font-mono">910</span>
            </div>

            <div className="p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r-md flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Distance Constraint: 528 Schools (15.6% of failures)</p>
                <p className="text-[11px] text-slate-500">Proximity to existing high schools within feeder walking radius.</p>
              </div>
              <span className="text-lg font-black text-slate-700 font-mono">528</span>
            </div>
          </div>
          
          <div className="p-3 bg-indigo-900 rounded-lg text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Authority Insight &amp; Recommendation</p>
            <p className="text-xs leading-tight mt-1">
              50% of all schools failed due to Room availability. Prioritize PEIMA Annual Development Plan (ADP) capital grants for prefabricated classroom additions for quick conversion.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'q3',
      question: '3. What is the status of PAF (Previously Approved Facility) progressive transitions?',
      summary: `26 schools previously approved for lower grades have qualified for progressive elevation (7 to 8th: 7 schools, 6 to 7th: 5 schools, 6 to 8th: 14 schools).`,
      icon: TrendingUp,
      badge: 'Progressive Policy',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: (
        <div className="space-y-2 text-xs text-slate-700">
          <p>
            PEIMA progressive upgradation policy allows high-performing schools approved in earlier cycles to advance sequentially:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800">
              8th (.PAF 6th): 14 Schools (Fast-track to full Middle)
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800">
              8th (.PAF 7th): 7 Schools (Step elevation to 8th)
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800">
              7th (.PAF 6th): 5 Schools (Step elevation to 7th)
            </span>
          </div>
          <p className="pt-1">
            <strong>Recommendation:</strong> Endorse the consolidated PAF list for automated portal migration without requiring fresh structural re-vetting.
          </p>
        </div>
      ),
    },
    {
      id: 'q4',
      question: '4. What immediate administrative action is mandated for the 74 "No Data" schools?',
      summary: `74 schools have unverified EMIS data or pending spatial surveys. A 7-day field verification deadline is recommended for District Monitoring Units.`,
      icon: ShieldAlert,
      badge: 'Compliance Directive',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      details: (
        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r-md flex items-center justify-between my-2">
            <div>
              <p className="text-xs font-bold text-slate-800">No Data Available: 74 Schools</p>
              <p className="text-[11px] text-slate-500">Missing site inspection reports &amp; coordinates</p>
            </div>
            <span className="text-lg font-black text-slate-700 font-mono">74</span>
          </div>
          <p>
            <strong>Directive Template:</strong> Issue formal memo to Chief Executive Officers (DEAs) of relevant districts with a 7-day timeline to submit digital geotagged inspection reports via the PEIMA Monitoring App.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Lightbulb className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-tight">
              Higher Authority Executive Q&amp;A Briefing
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Direct analytical answers tailored for Secretary / CEO / Director PEIMA decision-making
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase px-3 py-1 bg-slate-100 text-slate-700 rounded border border-slate-300">
          Strategic Advisory
        </span>
      </div>

      <div className="space-y-2.5">
        {questions.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          const Icon = q.icon;
          return (
            <div
              key={q.id}
              className={`rounded-xl border transition duration-150 overflow-hidden ${
                isExpanded ? 'border-slate-300 bg-slate-50/70' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${isExpanded ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {q.question}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${q.badgeColor}`}>
                        {q.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {q.summary}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 hover:text-slate-600 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-200 sm:pl-12">
                  {q.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
