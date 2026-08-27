import * as XLSX from 'xlsx';
import { CategoryStat, PhaseBreakdown, SchoolRecord } from '../types';

/**
 * Downloads comprehensive Excel workbook with multiple tabs
 */
export function exportToExcel(
  categories: CategoryStat[],
  phaseData: PhaseBreakdown,
  schoolRecords: SchoolRecord[],
  fileName: string = 'PEIMA_School_Eligibility_Report'
) {
  const wb = XLSX.utils.book_new();

  // Tab 1: Executive Summary
  const summaryData = [
    ['PUNJAB EDUCATION INITIATIVES MANAGEMENT AUTHORITY (PEIMA)'],
    ['GOVERNMENT OF THE PUNJAB - SCHOOL UPGRADATION & ELIGIBILITY REPORT'],
    ['Generated On:', new Date().toLocaleString()],
    [''],
    ['EXECUTIVE SUMMARY METRICS', 'COUNT', '% OF RELEVANT UNIVERSE'],
    ['Total Initial Schools Universe', phaseData.totalInitialSchools, '100.0%'],
    ['Phase 1 Approved - 8th Grade', phaseData.phase1Approved8th, `${((phaseData.phase1Approved8th / phaseData.totalInitialSchools) * 100).toFixed(1)}%`],
    ['Phase 1 Approved - 7th Grade', phaseData.phase1Approved7th, `${((phaseData.phase1Approved7th / phaseData.totalInitialSchools) * 100).toFixed(1)}%`],
    ['Phase 1 Approved - 6th Grade', phaseData.phase1Approved6th, `${((phaseData.phase1Approved6th / phaseData.totalInitialSchools) * 100).toFixed(1)}%`],
    ['Total Phase 1 Approved', phaseData.totalPhase1Approved, `${((phaseData.totalPhase1Approved / phaseData.totalInitialSchools) * 100).toFixed(1)}%`],
    ['Remaining After Phase 1 Deductions', phaseData.remainingAfterPhase1, `${((phaseData.remainingAfterPhase1 / phaseData.totalInitialSchools) * 100).toFixed(1)}%`],
    [''],
    ['PROGRESSIVE UPGRADATIONS & PAF RE-EVALUATIONS', 'COUNT', 'NOTES'],
    ['Approved for Grades 7 to 8', phaseData.moved7to8, 'Progressive elevation from 7th to 8th'],
    ['Approved for Grades 6 to 7', phaseData.moved6to7, 'Progressive elevation from 6th to 7th'],
    ['Approved for Grades 6 to 8', phaseData.moved6to8, 'Multi-grade elevation from 6th to 8th'],
    ['Total Re-evaluated & Moved', phaseData.totalMoved, 'Added into Active Evaluation Pool'],
    [''],
    ['ACTIVE EVALUATION POOL (GRAND TOTAL)', phaseData.grandTotalPool, '3879 + 26 = 3905'],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // Tab 2: Category Breakdown
  const catHeaders = ['Category / Grade', 'No. of Schools', '% Share', 'Classification', 'Priority', 'Operational Action Required'];
  const catRows = categories.map(c => [
    c.category,
    c.count,
    `${c.percentage.toFixed(2)}%`,
    c.classification.replace(/_/g, ' ').toUpperCase(),
    c.priority.toUpperCase(),
    c.actionRequired,
  ]);
  const wsCategory = XLSX.utils.aoa_to_sheet([
    ['PEIMA SCHOOL ELIGIBILITY CATEGORY BREAKDOWN'],
    [''],
    catHeaders,
    ...catRows,
    [''],
    ['Grand Total', categories.reduce((sum, c) => sum + c.count, 0), '100.0%'],
  ]);
  XLSX.utils.book_append_sheet(wb, wsCategory, 'Category Breakdown');

  // Tab 3: Detailed School Registry
  const schoolHeaders = [
    'EMIS Code',
    'School Name',
    'District',
    'Tehsil',
    'Current Level',
    'Applied Grade',
    'Eligibility Status',
    'PAF Tag',
    'Rooms Avail',
    'Rooms Req',
    'Area (Kanal)',
    'Distance to High (Km)',
    'Assessment Remarks',
  ];
  const schoolRows = schoolRecords.map(s => [
    s.emisCode,
    s.schoolName,
    s.district,
    s.tehsil,
    s.currentLevel,
    s.appliedForGrade,
    s.eligibilityStatus,
    s.pafTag || 'N/A',
    s.roomsAvailable,
    s.roomsRequired,
    s.areaKanal,
    s.distanceToHighKm,
    s.remarks,
  ]);
  const wsSchools = XLSX.utils.aoa_to_sheet([
    ['PEIMA REGISTERED SCHOOLS & EMIS LEVEL EVALUATION'],
    [''],
    schoolHeaders,
    ...schoolRows,
  ]);
  XLSX.utils.book_append_sheet(wb, wsSchools, 'School Registry');

  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Downloads single category breakdown CSV
 */
export function exportCategoriesCsv(categories: CategoryStat[], fileName: string = 'PEIMA_Categories_Summary') {
  const header = ['Category / Grade', 'No. of Schools', 'Percentage', 'Classification', 'Priority', 'Action Required'];
  const rows = categories.map(c => [
    `"${c.category}"`,
    c.count,
    `${c.percentage.toFixed(2)}%`,
    `"${c.classification}"`,
    `"${c.priority}"`,
    `"${c.actionRequired.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads school registry CSV
 */
export function exportSchoolsCsv(schoolRecords: SchoolRecord[], fileName: string = 'PEIMA_School_Records') {
  const header = ['EMIS Code', 'School Name', 'District', 'Tehsil', 'Current Level', 'Applied Grade', 'Eligibility Status', 'PAF Tag', 'Rooms Available', 'Rooms Required', 'Area (Kanal)', 'Distance (Km)', 'Remarks'];
  const rows = schoolRecords.map(s => [
    s.emisCode,
    `"${s.schoolName}"`,
    `"${s.district}"`,
    `"${s.tehsil}"`,
    `"${s.currentLevel}"`,
    `"${s.appliedForGrade}"`,
    `"${s.eligibilityStatus}"`,
    `"${s.pafTag || ''}"`,
    s.roomsAvailable,
    s.roomsRequired,
    s.areaKanal,
    s.distanceToHighKm,
    `"${s.remarks.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
