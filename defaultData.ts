import { CategoryStat, PhaseBreakdown, SchoolRecord, ExecutiveInsight } from '../types';

export const OFFICIAL_PHASE_BREAKDOWN: PhaseBreakdown = {
  totalInitialSchools: 4276,
  phase1Approved8th: 235,
  phase1Approved7th: 96,
  phase1Approved6th: 66,
  totalPhase1Approved: 397,
  remainingAfterPhase1: 3879,
  moved7to8: 7,
  moved6to7: 5,
  moved6to8: 14,
  totalMoved: 26,
  grandTotalPool: 3905,
};

export const BASELINE_CATEGORIES: CategoryStat[] = [
  {
    id: 'grade-6th',
    category: '6th',
    count: 181,
    percentage: (181 / 3905) * 100,
    grade: '6th',
    classification: 'approved',
    priority: 'high',
    description: 'Schools meeting all infrastructure criteria and verified eligible for 6th Grade upgradation.',
    actionRequired: 'Issue formal Phase-2 notification for 6th Grade classes.',
  },
  {
    id: 'grade-7th',
    category: '7th',
    count: 94,
    percentage: (94 / 3905) * 100,
    grade: '7th',
    classification: 'approved',
    priority: 'high',
    description: 'Schools meeting all infrastructure criteria and verified eligible for 7th Grade upgradation.',
    actionRequired: 'Issue formal notification for 7th Grade operations & textbook allocation.',
  },
  {
    id: 'grade-7th-paf-6th',
    category: '7th ( .paf 6th )',
    count: 5,
    percentage: (5 / 3905) * 100,
    grade: '7th',
    pafDetails: 'Previously Approved for 6th Grade (.PAF 6th)',
    classification: 'paf_transition',
    priority: 'medium',
    description: 'Schools previously approved for 6th Grade now upgraded & transitioned into 7th Grade eligibility.',
    actionRequired: 'Update PEIMA portal roster to reflect progressive 6th -> 7th upgradation.',
  },
  {
    id: 'grade-8th',
    category: '8th',
    count: 143,
    percentage: (143 / 3905) * 100,
    grade: '8th',
    classification: 'approved',
    priority: 'high',
    description: 'Schools meeting complete middle-standard requirements and approved for 8th Grade level.',
    actionRequired: 'Finalize staffing requirements and middle-stage examination registration.',
  },
  {
    id: 'grade-8th-paf-7th',
    category: '8th ( .paf 7th )',
    count: 7,
    percentage: (7 / 3905) * 100,
    grade: '8th',
    pafDetails: 'Previously Approved for 7th Grade (.PAF 7th)',
    classification: 'paf_transition',
    priority: 'medium',
    description: 'Schools previously approved for 7th Grade now successfully upgraded to full 8th Grade Middle school standard.',
    actionRequired: 'Authorize 8th Grade board enrolment and grant middle school certification.',
  },
  {
    id: 'grade-8th-paf-6th',
    category: '8th ( .paf 6th )',
    count: 14,
    percentage: (14 / 3905) * 100,
    grade: '8th',
    pafDetails: 'Previously Approved for 6th Grade (.PAF 6th)',
    classification: 'paf_transition',
    priority: 'medium',
    description: 'Schools previously approved for 6th Grade granted fast-track progressive elevation up to 8th Grade.',
    actionRequired: 'Approve combined elementary-middle pedagogical plan and classroom allocation.',
  },
  {
    id: 'fail-rooms',
    category: 'Rooms fail',
    count: 1949,
    percentage: (1949 / 3905) * 100,
    classification: 'infrastructure_fail',
    priority: 'high',
    description: 'Schools failing the mandatory minimum classroom/instructional room count criteria.',
    actionRequired: 'Prioritize under PEIMA Annual Development Plan (ADP) for prefabricated / additional classroom construction.',
  },
  {
    id: 'fail-area',
    category: 'Area failed',
    count: 910,
    percentage: (910 / 3905) * 100,
    classification: 'geographic_fail',
    priority: 'high',
    description: 'Schools with insufficient land footprint or total covered area for accommodating higher grades.',
    actionRequired: 'Execute joint spatial survey with Revenue Department for adjacent community land acquisition.',
  },
  {
    id: 'fail-distance',
    category: 'Distance Failed',
    count: 528,
    percentage: (528 / 3905) * 100,
    classification: 'geographic_fail',
    priority: 'medium',
    description: 'Schools located within feeder catchment overlap with existing High/Higher Secondary schools.',
    actionRequired: 'Review GIS radius buffer (feeder overlap vs genuine student commute hardship appeals).',
  },
  {
    id: 'no-data',
    category: 'No Data Available',
    count: 74,
    percentage: (74 / 3905) * 100,
    classification: 'data_missing',
    priority: 'high',
    description: 'Schools with incomplete EMIS, pending field inspection, or unverified structural attributes.',
    actionRequired: 'Direct District Education Officers (DEOs) & Monitoring Officers to submit physical verification within 7 days.',
  },
];

export const EXECUTIVE_INSIGHTS: ExecutiveInsight[] = [
  {
    id: 'insight-1',
    title: 'Primary Ineligibility Factor: Classroom Deficit',
    metric: '1,949 Schools (49.91%)',
    context: 'Half of all evaluated schools fail solely due to insufficient classrooms, making room addition the single highest-yield intervention.',
    authorityAction: 'Approve targeted PEIMA Classroom Addition PC-1 package for high-density tehsils.',
    type: 'critical',
  },
  {
    id: 'insight-2',
    title: 'Combined Approved & Upgraded Capacity',
    metric: '444 Schools in Pool (11.37%) + 397 Phase-1 = 841 Total',
    context: '444 schools in the current pool (including 26 PAF progressive transitions) are fully cleared for immediate grade notifications.',
    authorityAction: 'Issue immediate sanction letters for 6th, 7th, and 8th Grade operations before academic year kickoff.',
    type: 'success',
  },
  {
    id: 'insight-3',
    title: 'Spatial & Land Footprint Constraints',
    metric: '910 Schools (23.30%)',
    context: 'Land area deficiency prevents standard horizontal expansion without community land donations or multi-story structures.',
    authorityAction: 'Formulate PEIMA Vertical Construction Policy & Land Donation guideline.',
    type: 'warning',
  },
  {
    id: 'insight-4',
    title: 'Urgent Missing Data Resolution',
    metric: '74 Schools (1.90%)',
    context: '74 schools lack verified baseline data and cannot be processed for either approval or capital funding.',
    authorityAction: 'Issue 7-day compliance deadline to respective District Monitoring Units (DMUs).',
    type: 'info',
  },
];

// District sample for Punjab to generate rich school-level records
export const PUNJAB_DISTRICTS = [
  { name: 'Lahore', tehsils: ['Lahore City', 'Model Town', 'Raiwind', 'Cantonment', 'Shalimar'] },
  { name: 'Faisalabad', tehsils: ['Faisalabad City', 'Sadar', 'Chak Jhumra', 'Jaranwala', 'Samundri', 'Tandlianwala'] },
  { name: 'Rawalpindi', tehsils: ['Rawalpindi', 'Gujar Khan', 'Kahuta', 'Kallar Syedan', 'Kotli Sattian', 'Taxila'] },
  { name: 'Multan', tehsils: ['Multan City', 'Multan Sadar', 'Shujabad', 'Jalalpur Pirwala'] },
  { name: 'Gujranwala', tehsils: ['Gujranwala City', 'Gujranwala Sadar', 'Kamoke', 'Nowshera Virkan', 'Wazirabad'] },
  { name: 'Bahawalpur', tehsils: ['Bahawalpur City', 'Bahawalpur Sadar', 'Ahmadpur East', 'Hasilpur', 'Khairpur Tamewali', 'Yazman'] },
  { name: 'Sargodha', tehsils: ['Sargodha', 'Bhalwal', 'Kot Momin', 'Sahiwal', 'Shahpur', 'Sillanwali'] },
  { name: 'Sialkot', tehsils: ['Sialkot', 'Daska', 'Pasrur', 'Sambrial'] },
  { name: 'Sheikhupura', tehsils: ['Sheikhupura', 'Ferozewala', 'Muridke', 'Safdarabad', 'Sharakpur'] },
  { name: 'Rahim Yar Khan', tehsils: ['Rahim Yar Khan', 'Khanpur', 'Liaquatpur', 'Sadiqabad'] },
  { name: 'Jhang', tehsils: ['Jhang', 'Athara Hazari', 'Shorkot', 'Ahmadpur Sial'] },
  { name: 'D.G. Khan', tehsils: ['Dera Ghazi Khan', 'Kot Chutta', 'Taunsa', 'De-Excluded Area'] },
  { name: 'Kasur', tehsils: ['Kasur', 'Chunian', 'Pattoki', 'Kot Radha Kishan'] },
  { name: 'Muzaffargarh', tehsils: ['Muzaffargarh', 'Alipur', 'Jatoi', 'Kot Addu'] },
  { name: 'Gujrat', tehsils: ['Gujrat', 'Kharian', 'Sarai Alamgir'] },
  { name: 'Okara', tehsils: ['Okara', 'Depalpur', 'Renala Khurd'] },
  { name: 'Sahiwal', tehsils: ['Sahiwal', 'Chichawatni'] },
  { name: 'Vehari', tehsils: ['Vehari', 'Burewala', 'Mailsi'] },
  { name: 'Bahawalnagar', tehsils: ['Bahawalnagar', 'Chishtian', 'Fort Abbas', 'Haroonabad', 'Minchinabad'] },
  { name: 'Mianwali', tehsils: ['Mianwali', 'Isa Khel', 'Piplan'] },
];

/**
 * Generate a deterministic representative sample of school-level records matching the 3,905 total
 */
export function generateSampleSchoolRegistry(): SchoolRecord[] {
  const records: SchoolRecord[] = [];
  let currentEmis = 31110001;

  const categoryConfigs: { key: string; count: number; status: SchoolRecord['eligibilityStatus']; grade: SchoolRecord['appliedForGrade']; paf?: string }[] = [
    { key: '6th', count: 181, status: 'Approved', grade: '6th' },
    { key: '7th', count: 94, status: 'Approved', grade: '7th' },
    { key: '7th ( .paf 6th )', count: 5, status: 'PAF Transition', grade: '7th', paf: 'Approved for 6th to 7th (.PAF 6th)' },
    { key: '8th', count: 143, status: 'Approved', grade: '8th' },
    { key: '8th ( .paf 7th )', count: 7, status: 'PAF Transition', grade: '8th', paf: 'Approved for 7th to 8th (.PAF 7th)' },
    { key: '8th ( .paf 6th )', count: 14, status: 'PAF Transition', grade: '8th', paf: 'Approved for 6th to 8th (.PAF 6th)' },
    { key: 'Rooms fail', count: 1949, status: 'Rooms Failed', grade: '6th to 8th' },
    { key: 'Area failed', count: 910, status: 'Area Failed', grade: '6th to 8th' },
    { key: 'Distance Failed', count: 528, status: 'Distance Failed', grade: '6th to 8th' },
    { key: 'No Data Available', count: 74, status: 'No Data Available', grade: '6th to 8th' },
  ];

  let idCounter = 1;

  categoryConfigs.forEach(cfg => {
    for (let i = 0; i < cfg.count; i++) {
      const distIndex = (idCounter + i * 3) % PUNJAB_DISTRICTS.length;
      const districtObj = PUNJAB_DISTRICTS[distIndex];
      const tehsilIndex = (idCounter + i) % districtObj.tehsils.length;
      const tehsil = districtObj.tehsils[tehsilIndex];
      const district = districtObj.name;

      let roomsAvailable = 4;
      let roomsRequired = 6;
      let areaKanal = 2.5;
      let distanceToHighKm = 3.8;
      let remarks = 'Standard assessment completed.';

      if (cfg.status === 'Approved') {
        roomsAvailable = 7 + (i % 4);
        roomsRequired = 6;
        areaKanal = 4.0 + (i % 5);
        distanceToHighKm = 4.5 + (i % 6);
        remarks = `All criteria satisfied for ${cfg.grade} upgradation.`;
      } else if (cfg.status === 'PAF Transition') {
        roomsAvailable = 6 + (i % 3);
        roomsRequired = 6;
        areaKanal = 3.5 + (i % 3);
        distanceToHighKm = 3.5 + (i % 4);
        remarks = `Previously approved facility transition verified (${cfg.paf}).`;
      } else if (cfg.status === 'Rooms Failed') {
        roomsAvailable = 2 + (i % 3);
        roomsRequired = 6;
        areaKanal = 3.0 + (i % 4);
        distanceToHighKm = 4.0 + (i % 5);
        remarks = `Deficit of ${roomsRequired - roomsAvailable} classrooms against standard middle school criteria.`;
      } else if (cfg.status === 'Area Failed') {
        roomsAvailable = 6 + (i % 2);
        roomsRequired = 6;
        areaKanal = 1.0 + ((i % 10) * 0.1);
        distanceToHighKm = 3.5 + (i % 5);
        remarks = `Land parcel (${areaKanal.toFixed(1)} Kanal) below the 3.0 Kanal standard for middle school footprint.`;
      } else if (cfg.status === 'Distance Failed') {
        roomsAvailable = 6 + (i % 3);
        roomsRequired = 6;
        areaKanal = 3.5 + (i % 3);
        distanceToHighKm = 0.8 + ((i % 15) * 0.1);
        remarks = `High School located within ${distanceToHighKm.toFixed(1)} km radius (feeder overlap).`;
      } else if (cfg.status === 'No Data Available') {
        roomsAvailable = 0;
        roomsRequired = 6;
        areaKanal = 0;
        distanceToHighKm = 0;
        remarks = 'Field survey data missing in EMIS repository. Verification team dispatched.';
      }

      records.push({
        id: `SCH-${idCounter}`,
        emisCode: String(currentEmis++),
        schoolName: `GPS ${tehsil} Block-${(i % 30) + 1} (${district})`,
        district,
        tehsil,
        currentLevel: 'Primary',
        appliedForGrade: cfg.grade,
        eligibilityStatus: cfg.status,
        categoryKey: cfg.key,
        pafTag: cfg.paf,
        roomsAvailable,
        roomsRequired,
        areaKanal,
        distanceToHighKm,
        remarks,
      });

      idCounter++;
    }
  });

  return records;
}
