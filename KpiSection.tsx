import React from 'react';
import { CategoryStat, PhaseBreakdown } from '../types';
import { CheckCircle2, AlertTriangle, Building, MapPin, FileQuestion, Layers, Award, ArrowUpRight } from 'lucide-react';

interface KpiSectionProps {
  categories: CategoryStat[];
  phaseData: PhaseBreakdown;
  onFilterCategory?: (categoryName: string) => void;
}

export const KpiSection: React.FC<KpiSectionProps> = ({ categories, phaseData, onFilterCategory }) => {
  const getCount = (name: string) => categories.find(c => c.category === name)?.count || 0;

  const count6th = getCount('6th');
  const count7th = getCount('7th');
  const count7thPaf = getCount('7th ( .paf 6th )');
  const count8th = getCount('8th');
  const count8thPaf7th = getCount('8th ( .paf 7th )');
  const count8thPaf6th = getCount('8th ( .paf 6th )');

  const totalApprovedInPool = count6th + count7th + count7thPaf + count8th + count8thPaf7th + count8thPaf6th;
  const totalPafTransitions = count7thPaf + count8thPaf7th + count8thPaf6th;

  const roomsFailed = getCount('Rooms fail');
  const areaFailed = getCount('Area failed');
  const distanceFailed = getCount('Distance Failed');
  const noData = getCount('No Data Available');

  const grandTotal = phaseData.grandTotalPool || 3905;

  const kpis = [
    {
      id: 'kpi-approved',
      title: 'Total Approved',
      count: totalApprovedInPool,
      percentage: (totalApprovedInPool / grandTotal) * 100,
      subtext: `Includes ${totalPafTransitions} PAF transitions`,
      icon: CheckCircle2,
      color: 'emerald',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-100',
      textMain: 'text-emerald-800',
      textLabel: 'text-emerald-700',
      accentColor: 'text-emerald-700',
      tag: 'Ready for Sanction',
      filterKey: 'approved',
    },
    {
      id: 'kpi-rooms',
      title: 'Classroom Deficit',
      count: roomsFailed,
      percentage: (roomsFailed / grandTotal) * 100,
      subtext: '49.91% of pool — Primary bottleneck',
      icon: Building,
      color: 'amber',
      bgLight: 'bg-amber-50',
      border: 'border-amber-100',
      textMain: 'text-amber-800',
      textLabel: 'text-amber-700',
      accentColor: 'text-amber-700',
      tag: 'Priority 1 ADP',
      filterKey: 'Rooms fail',
    },
    {
      id: 'kpi-area',
      title: 'Land Area Deficit',
      count: areaFailed,
      percentage: (areaFailed / grandTotal) * 100,
      subtext: 'Plot size below authority mandate',
      icon: MapPin,
      color: 'rose',
      bgLight: 'bg-rose-50',
      border: 'border-rose-100',
      textMain: 'text-rose-800',
      textLabel: 'text-rose-700',
      accentColor: 'text-rose-700',
      tag: 'Vertical Survey',
      filterKey: 'Area failed',
    },
    {
      id: 'kpi-distance',
      title: 'Catchment Overlap',
      count: distanceFailed,
      percentage: (distanceFailed / grandTotal) * 100,
      subtext: 'High school within feeder radius',
      icon: AlertTriangle,
      color: 'blue',
      bgLight: 'bg-slate-50',
      border: 'border-slate-200',
      textMain: 'text-slate-800',
      textLabel: 'text-slate-600',
      accentColor: 'text-slate-700',
      tag: 'Distance Check',
      filterKey: 'Distance Failed',
    },
    {
      id: 'kpi-nodata',
      title: 'Action Required',
      count: noData,
      percentage: (noData / grandTotal) * 100,
      subtext: '74 schools require field inspection',
      icon: FileQuestion,
      color: 'slate',
      bgLight: 'bg-slate-800',
      border: 'border-slate-700',
      textMain: 'text-white',
      textLabel: 'text-slate-400',
      accentColor: 'text-slate-300',
      tag: '7-Day Audit',
      filterKey: 'No Data Available',
      isDark: true,
    },
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span>Executive Key Performance Indicators</span>
          <span className="text-xs font-normal text-slate-500 lowercase">({grandTotal.toLocaleString()} evaluated schools)</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Click any card to filter data below
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onFilterCategory && onFilterCategory(kpi.filterKey)}
              className={`${kpi.bgLight} rounded-xl p-4 border ${kpi.border} shadow-xs hover:shadow-sm transition duration-150 cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${kpi.textLabel}`}>
                    {kpi.title}
                  </span>
                  <Icon className={`w-4 h-4 ${kpi.accentColor}`} />
                </div>

                <div className="flex items-baseline gap-2">
                  <div className={`text-3xl font-extrabold ${kpi.textMain} font-mono tracking-tight`}>
                    {kpi.count.toLocaleString()}
                  </div>
                  <span className={`text-xs font-bold ${kpi.accentColor} font-mono`}>
                    {kpi.percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className={`w-full ${kpi.isDark ? 'bg-slate-700' : 'bg-slate-200/80'} rounded-full h-1.5 mt-2.5 overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${
                      kpi.color === 'emerald' ? 'bg-emerald-500' :
                      kpi.color === 'amber' ? 'bg-amber-500' :
                      kpi.color === 'rose' ? 'bg-rose-500' :
                      kpi.color === 'blue' ? 'bg-slate-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(kpi.percentage, 4)}%` }}
                  ></div>
                </div>
              </div>

              <div className={`mt-3 pt-2.5 border-t ${kpi.isDark ? 'border-slate-700' : 'border-slate-200/60'} flex items-center justify-between text-[11px]`}>
                <span className={`${kpi.isDark ? 'text-slate-300' : 'text-slate-600'} truncate mr-2 font-medium`}>
                  {kpi.subtext}
                </span>
                <span className={`font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                  kpi.isDark ? 'bg-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
                } whitespace-nowrap`}>
                  {kpi.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
