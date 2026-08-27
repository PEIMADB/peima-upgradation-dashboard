import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CategoryStat, PhaseBreakdown, SchoolRecord } from '../types';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Layers, CheckCircle2, AlertTriangle, Building, MapPin } from 'lucide-react';

interface AnalyticsSectionProps {
  categories: CategoryStat[];
  phaseData: PhaseBreakdown;
  schoolRecords: SchoolRecord[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  categories,
  phaseData,
  schoolRecords,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bottlenecks' | 'grades' | 'districts'>('all');

  const grandTotal = phaseData.grandTotalPool || 3905;

  // 1. All Categories Chart Data
  const allCategoriesData = categories.map(c => ({
    name: c.category,
    count: c.count,
    percentage: parseFloat(c.percentage.toFixed(1)),
    classification: c.classification,
  }));

  // 2. High Level Bottlenecks & Approvals Composition
  const approvedTotal = categories
    .filter(c => c.classification === 'approved' || c.classification === 'paf_transition')
    .reduce((s, c) => s + c.count, 0);

  const roomsFailed = categories.find(c => c.category === 'Rooms fail')?.count || 1949;
  const areaFailed = categories.find(c => c.category === 'Area failed')?.count || 910;
  const distanceFailed = categories.find(c => c.category === 'Distance Failed')?.count || 528;
  const noData = categories.find(c => c.category === 'No Data Available')?.count || 74;

  const compositionData = [
    { name: 'Classroom Deficit (Rooms Fail)', count: roomsFailed, value: roomsFailed, color: '#f59e0b', pct: ((roomsFailed / grandTotal) * 100).toFixed(1) },
    { name: 'Land Deficit (Area Fail)', count: areaFailed, value: areaFailed, color: '#f43f5e', pct: ((areaFailed / grandTotal) * 100).toFixed(1) },
    { name: 'Feeder Overlap (Distance Fail)', count: distanceFailed, value: distanceFailed, color: '#64748b', pct: ((distanceFailed / grandTotal) * 100).toFixed(1) },
    { name: 'Approved & PAF Transitions', count: approvedTotal, value: approvedTotal, color: '#047857', pct: ((approvedTotal / grandTotal) * 100).toFixed(1) },
    { name: 'Missing Data / Pending Audit', count: noData, value: noData, color: '#334155', pct: ((noData / grandTotal) * 100).toFixed(1) },
  ];

  // 3. Grade-wise Approved Breakdown
  const gradeData = [
    {
      grade: 'Grade 6th',
      directApproved: 181,
      pafTransition: 0,
      total: 181,
      phase1: phaseData.phase1Approved6th,
    },
    {
      grade: 'Grade 7th',
      directApproved: 94,
      pafTransition: 5, // 7th (.paf 6th)
      total: 99,
      phase1: phaseData.phase1Approved7th,
    },
    {
      grade: 'Grade 8th',
      directApproved: 143,
      pafTransition: 21, // 7 (.paf 7th) + 14 (.paf 6th)
      total: 164,
      phase1: phaseData.phase1Approved8th,
    },
  ];

  // 4. District sample aggregation from representative records
  const districtMap: Record<string, { district: string; approved: number; roomsFail: number; areaFail: number; distanceFail: number; total: number }> = {};
  schoolRecords.forEach(s => {
    if (!districtMap[s.district]) {
      districtMap[s.district] = { district: s.district, approved: 0, roomsFail: 0, areaFail: 0, distanceFail: 0, total: 0 };
    }
    districtMap[s.district].total++;
    if (s.eligibilityStatus === 'Approved' || s.eligibilityStatus === 'PAF Transition') districtMap[s.district].approved++;
    else if (s.eligibilityStatus === 'Rooms Failed') districtMap[s.district].roomsFail++;
    else if (s.eligibilityStatus === 'Area Failed') districtMap[s.district].areaFail++;
    else if (s.eligibilityStatus === 'Distance Failed') districtMap[s.district].distanceFail++;
  });

  const districtData = Object.values(districtMap).slice(0, 10).sort((a, b) => b.total - a.total);

  const getBarColor = (classification: string) => {
    switch (classification) {
      case 'approved': return '#047857';
      case 'paf_transition': return '#059669';
      case 'infrastructure_fail': return '#f59e0b';
      case 'geographic_fail': return '#f43f5e';
      case 'data_missing': return '#475569';
      default: return '#64748b';
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-6">
      {/* Section Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Interactive Visual Analytics &amp; Constraint Diagnostics</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real-time visual distribution based on the {grandTotal.toLocaleString()} school evaluation pool
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 10 Categories
          </button>
          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'bottlenecks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bottlenecks &amp; Composition
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'grades' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade Progression
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'districts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top Districts
          </button>
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="min-h-[380px]">
        
        {/* Tab 1: All 10 Categories Horizontal / Vertical Bar Chart */}
        {activeTab === 'all' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2 px-1">
              <span className="font-semibold text-slate-700">Category Distribution ({grandTotal.toLocaleString()} Total Active Pool)</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700"></span> Approved
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span> PAF Transition
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span> Rooms Fail
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span> Area/Distance Fail
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-600"></span> No Data
                </span>
              </div>
            </div>
            
            <div className="h-84 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={allCategoriesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 2100]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600 }}
                    width={110}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} Schools`, 'Count']}
                    labelFormatter={(label: any) => `Category: ${label}`}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '6px', fontSize: '12px', border: 'none' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {allCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.classification)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Composition & Bottleneck Diagnostics */}
        {activeTab === 'bottlenecks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} Schools (${((Number(val)/grandTotal)*100).toFixed(1)}%)`, name]}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Executive Bottleneck Analysis
              </div>
              {compositionData.map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 font-mono">{item.count.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5 font-medium">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Grade-wise Approved Progression */}
        {activeTab === 'grades' && (
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Grade-wise Comparison: Direct Approved vs. PAF Progressive Upgradations
            </div>
            <div className="h-84 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gradeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="phase1" name="Phase 1 Baseline Notified" fill="#065f46" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="directApproved" name="Phase 2 Direct Approved" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pafTransition" name="PAF Progressive Transitions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 4: Top Districts Breakdown */}
        {activeTab === 'districts' && (
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Top Punjab Districts Evaluation Profile (Sample Distribution across 3,905 dataset)
            </div>
            <div className="h-84 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={districtData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="approved" name="Approved / PAF" fill="#047857" stackId="a" />
                  <Bar dataKey="roomsFail" name="Rooms Deficit" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="areaFail" name="Area Deficit" fill="#f43f5e" stackId="a" />
                  <Bar dataKey="distanceFail" name="Feeder Overlap" fill="#64748b" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
