export interface CategoryStat {
  id: string;
  category: string;
  count: number;
  percentage: number;
  grade?: string;
  pafDetails?: string;
  classification: 'approved' | 'infrastructure_fail' | 'geographic_fail' | 'data_missing' | 'paf_transition';
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionRequired: string;
}

export interface PhaseBreakdown {
  totalInitialSchools: number; // 4276
  phase1Approved8th: number; // 235
  phase1Approved7th: number; // 96
  phase1Approved6th: number; // 66
  totalPhase1Approved: number; // 397
  remainingAfterPhase1: number; // 3879
  
  // Upgraded / Multi-grade moved
  moved7to8: number; // 7
  moved6to7: number; // 5
  moved6to8: number; // 14
  totalMoved: number; // 26

  // Grand Total in Evaluation Pool
  grandTotalPool: number; // 3905
}

export interface SchoolRecord {
  id: string;
  emisCode: string;
  schoolName: string;
  district: string;
  tehsil: string;
  currentLevel: 'Primary' | 'Elementary' | 'Middle';
  appliedForGrade: '6th' | '7th' | '8th' | '6th to 7th' | '7th to 8th' | '6th to 8th';
  eligibilityStatus: 'Approved' | 'Rooms Failed' | 'Area Failed' | 'Distance Failed' | 'No Data Available' | 'PAF Transition';
  categoryKey: string;
  pafTag?: string;
  roomsAvailable: number;
  roomsRequired: number;
  areaKanal: number;
  distanceToHighKm: number;
  remarks: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  grade: string;
  status: string;
  failureReason?: string;
  district: string;
  pafOnly: boolean;
}

export type SchoolSortField = 
  | 'emisCode' 
  | 'schoolName' 
  | 'district' 
  | 'appliedForGrade' 
  | 'eligibilityStatus' 
  | 'roomsAvailable' 
  | 'areaKanal' 
  | 'distanceToHighKm';

export type CategorySortField = 
  | 'category' 
  | 'count' 
  | 'percentage' 
  | 'classification' 
  | 'priority';

export type SortOrder = 'asc' | 'desc';

export interface SyncStatus {
  isLive: boolean;
  isLoading: boolean;
  lastSyncedAt: Date | null;
  sourceType: 'live_gviz' | 'live_csv' | 'baseline';
  sheetId: string;
  errorMessage?: string | null;
  autoRefreshEnabled: boolean;
  refreshIntervalSeconds: number;
}

export interface ExecutiveInsight {
  id: string;
  title: string;
  metric: string;
  context: string;
  authorityAction: string;
  type: 'critical' | 'warning' | 'success' | 'info';
}
