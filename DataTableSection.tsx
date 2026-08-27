import React, { useState, useMemo } from 'react';
import { CategoryStat, SchoolRecord, PhaseBreakdown, SchoolSortField, CategorySortField, SortOrder } from '../types';
import { 
  Table, Download, FileSpreadsheet, ChevronLeft, ChevronRight, 
  CheckCircle2, AlertTriangle, Building, MapPin, Layers, ExternalLink, 
  ShieldCheck, ArrowUpDown, ArrowUp, ArrowDown, ListFilter 
} from 'lucide-react';
import { exportCategoriesCsv, exportSchoolsCsv, exportToExcel } from '../utils/exportUtils';

interface DataTableSectionProps {
  categories: CategoryStat[];
  filteredCategories: CategoryStat[];
  schoolRecords: SchoolRecord[];
  filteredSchools: SchoolRecord[];
  phaseData: PhaseBreakdown;
  onFilterByCategory: (catName: string) => void;
}

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  categories,
  filteredCategories,
  schoolRecords,
  filteredSchools,
  phaseData,
  onFilterByCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'schools' | 'paf'>('categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // School table sort state
  const [schoolSortField, setSchoolSortField] = useState<SchoolSortField>('emisCode');
  const [schoolSortOrder, setSchoolSortOrder] = useState<SortOrder>('asc');

  // Category table sort state
  const [catSortField, setCatSortField] = useState<CategorySortField>('count');
  const [catSortOrder, setCatSortOrder] = useState<SortOrder>('desc');

  // Handle school sorting toggle
  const handleSchoolSort = (field: SchoolSortField) => {
    if (schoolSortField === field) {
      setSchoolSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSchoolSortField(field);
      setSchoolSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Handle category sorting toggle
  const handleCatSort = (field: CategorySortField) => {
    if (catSortField === field) {
      setCatSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setCatSortField(field);
      setCatSortOrder(field === 'count' || field === 'percentage' ? 'desc' : 'asc');
    }
  };

  // Sorted Category Records
  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
      let comparison = 0;
      if (catSortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (catSortField === 'count') {
        comparison = a.count - b.count;
      } else if (catSortField === 'percentage') {
        comparison = a.percentage - b.percentage;
      } else if (catSortField === 'classification') {
        comparison = a.classification.localeCompare(b.classification);
      } else if (catSortField === 'priority') {
        const pOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        comparison = (pOrder[a.priority] || 0) - (pOrder[b.priority] || 0);
      }
      return catSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredCategories, catSortField, catSortOrder]);

  // Sorted School Records
  const sortedSchools = useMemo(() => {
    return [...filteredSchools].sort((a, b) => {
      let comparison = 0;
      switch (schoolSortField) {
        case 'emisCode':
          comparison = a.emisCode.localeCompare(b.emisCode, undefined, { numeric: true });
          break;
        case 'schoolName':
          comparison = a.schoolName.localeCompare(b.schoolName);
          break;
        case 'district':
          comparison = a.district.localeCompare(b.district) || a.tehsil.localeCompare(b.tehsil);
          break;
        case 'appliedForGrade':
          comparison = a.appliedForGrade.localeCompare(b.appliedForGrade);
          break;
        case 'eligibilityStatus':
          comparison = a.eligibilityStatus.localeCompare(b.eligibilityStatus);
          break;
        case 'roomsAvailable':
          comparison = a.roomsAvailable - b.roomsAvailable;
          break;
        case 'areaKanal':
          comparison = a.areaKanal - b.areaKanal;
          break;
        case 'distanceToHighKm':
          comparison = a.distanceToHighKm - b.distanceToHighKm;
          break;
        default:
          comparison = 0;
      }
      return schoolSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredSchools, schoolSortField, schoolSortOrder]);

  const totalPages = Math.ceil(sortedSchools.length / pageSize) || 1;
  const paginatedSchools = sortedSchools.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const grandTotal = phaseData.grandTotalPool || 3905;

  const renderSortIcon = (field: SchoolSortField | CategorySortField, activeField: string, order: SortOrder) => {
    if (field !== activeField) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-800 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-800 font-bold" />
    );
  };

  const getStatusBadge = (classification: string, statusText: string) => {
    switch (classification) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Approved
          </span>
        );
      case 'paf_transition':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <ShieldCheck className="w-3 h-3 text-teal-700" />
            PAF Upgraded
          </span>
        );
      case 'infrastructure_fail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Building className="w-3 h-3 text-amber-700" />
            Rooms Deficit
          </span>
        );
      case 'geographic_fail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <MapPin className="w-3 h-3 text-rose-700" />
            Area / Feeder Fail
          </span>
        );
      case 'data_missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3 h-3 text-slate-600" />
            No Data
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
            {statusText}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">Standard</span>;
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      
      {/* Table Header Strip & Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-800" />
            <span>Official Registers &amp; Classification Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Interactive table with multi-column sorting and direct filtering across {grandTotal.toLocaleString()} evaluated schools
          </p>
        </div>

        {/* Action Buttons & Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'categories' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Categories Summary (10)
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'schools' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EMIS Registry ({filteredSchools.length.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveTab('paf')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'paf' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PAF Upgraded (26)
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'categories') exportCategoriesCsv(categories);
              else exportSchoolsCsv(filteredSchools);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Category Summary Table */}
      {activeTab === 'categories' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12">#</th>
                <th 
                  onClick={() => handleCatSort('category')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                  title="Click to sort by category"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Eligibility Category / Grade</span>
                    {renderSortIcon('category', catSortField, catSortOrder)}
                  </div>
                </th>
                <th 
                  onClick={() => handleCatSort('count')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200 transition select-none group"
                  title="Click to sort by school count"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>No. of Schools</span>
                    {renderSortIcon('count', catSortField, catSortOrder)}
                  </div>
                </th>
                <th 
                  onClick={() => handleCatSort('percentage')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200 transition select-none group"
                  title="Click to sort by percentage"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>% of Pool</span>
                    {renderSortIcon('percentage', catSortField, catSortOrder)}
                  </div>
                </th>
                <th 
                  onClick={() => handleCatSort('classification')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                  title="Click to sort by classification"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Classification</span>
                    {renderSortIcon('classification', catSortField, catSortOrder)}
                  </div>
                </th>
                <th 
                  onClick={() => handleCatSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                  title="Click to sort by priority"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    {renderSortIcon('priority', catSortField, catSortOrder)}
                  </div>
                </th>
                <th className="py-3 px-4">Action Required for Higher Authority</th>
                <th className="py-3 px-4 text-center w-20">Filter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCategories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition group">
                  <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm">{cat.category}</span>
                      {cat.pafDetails && (
                        <span className="text-[11px] font-normal text-teal-700 font-mono mt-0.5">
                          {cat.pafDetails}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono text-sm">
                    {cat.count.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-mono font-medium">
                    {cat.percentage.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(cat.classification, cat.category)}
                  </td>
                  <td className="py-3 px-4">
                    {getPriorityBadge(cat.priority)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs text-[11.5px] leading-relaxed">
                    {cat.actionRequired}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onFilterByCategory(cat.category)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition cursor-pointer border border-slate-200"
                      title="Filter schools in this category"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold text-xs">
                <td className="py-3.5 px-4" colSpan={2}>
                  GRAND TOTAL EVALUATION POOL
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-white text-sm font-extrabold">
                  {categories.reduce((s, c) => s + c.count, 0).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-white">
                  100.00%
                </td>
                <td className="py-3.5 px-4 text-slate-300 text-[11px]" colSpan={4}>
                  Reconciled against 4,276 baseline &minus; 397 Phase 1 + 26 Multi-Grade = 3,905 Total
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Tab 2: School EMIS Registry */}
      {activeTab === 'schools' && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  {/* EMIS Code Sort */}
                  <th 
                    onClick={() => handleSchoolSort('emisCode')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by EMIS Code"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>EMIS Code</span>
                      {renderSortIcon('emisCode', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* School Name Sort */}
                  <th 
                    onClick={() => handleSchoolSort('schoolName')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by School Name"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>School Name</span>
                      {renderSortIcon('schoolName', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* District Sort */}
                  <th 
                    onClick={() => handleSchoolSort('district')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by District / Tehsil"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>District &amp; Tehsil</span>
                      {renderSortIcon('district', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* Grade Sort */}
                  <th 
                    onClick={() => handleSchoolSort('appliedForGrade')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by Applied Grade"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Grade</span>
                      {renderSortIcon('appliedForGrade', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* Eligibility Status Sort */}
                  <th 
                    onClick={() => handleSchoolSort('eligibilityStatus')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by Eligibility Decision"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Eligibility Status</span>
                      {renderSortIcon('eligibilityStatus', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* Rooms Sort */}
                  <th 
                    onClick={() => handleSchoolSort('roomsAvailable')}
                    className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by Available Rooms"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Rooms (Avail/Req)</span>
                      {renderSortIcon('roomsAvailable', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* Area Sort */}
                  <th 
                    onClick={() => handleSchoolSort('areaKanal')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by Land Area (Kanal)"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Area (Kanal)</span>
                      {renderSortIcon('areaKanal', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  {/* Distance Sort */}
                  <th 
                    onClick={() => handleSchoolSort('distanceToHighKm')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200 transition select-none group"
                    title="Sort by Distance (Km)"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Distance (Km)</span>
                      {renderSortIcon('distanceToHighKm', schoolSortField, schoolSortOrder)}
                    </div>
                  </th>

                  <th className="py-3 px-4">Assessment Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSchools.map(school => (
                  <tr key={school.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {school.emisCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {school.schoolName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium">{school.district}</div>
                      <div className="text-[11px] text-slate-500">{school.tehsil}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {school.appliedForGrade}
                    </td>
                    <td className="py-3 px-4">
                      {school.eligibilityStatus === 'Approved' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {school.eligibilityStatus === 'PAF Transition' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                          PAF Upgraded
                        </span>
                      )}
                      {school.eligibilityStatus === 'Rooms Failed' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Rooms Failed
                        </span>
                      )}
                      {school.eligibilityStatus === 'Area Failed' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                          Area Failed
                        </span>
                      )}
                      {school.eligibilityStatus === 'Distance Failed' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          Distance Failed
                        </span>
                      )}
                      {school.eligibilityStatus === 'No Data Available' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          No Data
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {school.roomsAvailable} / {school.roomsRequired}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {school.areaKanal.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {school.distanceToHighKm.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">
                      {school.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination and Page Size Control Bar */}
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-white">
            <div className="flex items-center gap-3">
              <div>
                Showing <strong className="text-slate-900 font-mono">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
                <strong className="text-slate-900 font-mono">{Math.min(currentPage * pageSize, sortedSchools.length)}</strong> of{' '}
                <strong className="text-slate-900 font-mono">{sortedSchools.length.toLocaleString()}</strong> schools
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="hidden sm:inline">| Rows:</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 font-mono"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer font-medium text-[11px]"
                title="First Page"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer font-medium text-[11px]"
                title="Last Page"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PAF Progressive Upgraded Roster */}
      {activeTab === 'paf' && (
        <div className="p-4 sm:p-6">
          <div className="mb-4 bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900">
            <div className="font-bold text-sm text-teal-950 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Special Roster: 26 Progressive Upgradations (PAF Transitions)</span>
            </div>
            <p>
              These schools were previously approved for lower grades (.PAF 6th / .PAF 7th) and have fulfilled subsequent infrastructure benchmarks to advance into higher grade brackets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* PAF Group 1 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 font-bold text-slate-900 text-sm">
                <span>8th ( .paf 6th )</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-700 text-white text-xs font-mono">14 Schools</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 font-medium">
                Schools previously cleared for 6th Grade granted progressive leap directly to 8th Middle School status.
              </p>
              <div className="text-[11px] text-teal-900 font-semibold bg-white p-2 rounded-md border border-slate-200">
                Action: Authorize 6th-8th combined curriculum and middle school exam code.
              </div>
            </div>

            {/* PAF Group 2 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 font-bold text-slate-900 text-sm">
                <span>8th ( .paf 7th )</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-700 text-white text-xs font-mono">7 Schools</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 font-medium">
                Schools previously cleared for 7th Grade advancing into final 8th Middle standard.
              </p>
              <div className="text-[11px] text-teal-900 font-semibold bg-white p-2 rounded-md border border-slate-200">
                Action: Issue middle school certification &amp; teacher allocation.
              </div>
            </div>

            {/* PAF Group 3 */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 font-bold text-slate-900 text-sm">
                <span>7th ( .paf 6th )</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-700 text-white text-xs font-mono">5 Schools</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 font-medium">
                Schools previously cleared for 6th Grade successfully expanding to 7th Grade.
              </p>
              <div className="text-[11px] text-teal-900 font-semibold bg-white p-2 rounded-md border border-slate-200">
                Action: Update PEIMA portal register for 7th Grade class operations.
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
