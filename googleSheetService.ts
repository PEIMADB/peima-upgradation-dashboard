import { CategoryStat, PhaseBreakdown } from '../types';
import { BASELINE_CATEGORIES, OFFICIAL_PHASE_BREAKDOWN } from '../data/defaultData';

export const SPREADSHEET_ID = '1GQ6LM5fIEW04dluc_QMHYLcbU8Wx82IEio26G25VmZg';
export const DEFAULT_GID = '0';

export interface SheetFetchResult {
  categories: CategoryStat[];
  phaseBreakdown: PhaseBreakdown;
  rawRowsCount: number;
  sourceType: 'live_gviz' | 'live_csv' | 'baseline';
  syncedAt: Date;
  warning?: string;
}

/**
 * Normalizes text for robust category matching
 */
function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/[\s._\-()]+/g, ' ').trim();
}

/**
 * Parse Google Visualization API JSONP response
 */
function parseGvizResponse(text: string): { headers: string[]; rows: string[][] } {
  const raw = (text || '').trim();
  const match = raw.match(/google\.visualization\.Query\.setResponse\((\{[\s\S]*\})\);?\s*$/);
  const jsonText = match ? match[1] : raw;
  const payload = JSON.parse(jsonText);

  if (payload?.status === 'error') {
    throw new Error(payload.errors?.map((e: { message?: string; reason?: string }) => e.message || e.reason).join('; ') || 'GViz error');
  }

  const cols = payload.table?.cols || [];
  const headers = cols.map((col: { label?: string; id?: string }, i: number) => (col.label || col.id || `Col_${i + 1}`).trim());

  const rows = (payload.table?.rows || []).map((row: { c?: Array<{ v?: string | number | null; f?: string | null }> }) => {
    return headers.map((_: string, i: number) => {
      const cell = row?.c?.[i];
      if (!cell) return '';
      if (cell.f !== undefined && cell.f !== null) return String(cell.f).trim();
      if (cell.v !== undefined && cell.v !== null) return String(cell.v).trim();
      return '';
    });
  });

  return { headers, rows };
}

/**
 * Parse CSV text response
 */
function parseCsvResponse(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string) => {
    const row: string[] = [];
    let insideQuotes = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    return row;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

/**
 * Maps parsed sheet table to verified PEIMA categories
 */
function mapRowsToCategories(headers: string[], rows: string[][]): { categories: CategoryStat[]; totalCount: number } {
  const normHeaders = headers.map(h => normalizeText(h));
  
  // Find grade/category column and count column
  let catColIdx = normHeaders.findIndex(h => h.includes('grade') || h.includes('category') || h.includes('status') || h.includes('criteria') || h.includes('school'));
  let countColIdx = normHeaders.findIndex(h => h.includes('no of school') || h.includes('count') || h.includes('schools') || h.includes('total'));

  if (catColIdx === -1) catColIdx = 0;
  if (countColIdx === -1 && headers.length > 1) countColIdx = 1;

  // Build count map based on recognized keys
  const categoryCounts: Record<string, number> = {
    '6th': 0,
    '7th': 0,
    '7th ( .paf 6th )': 0,
    '8th': 0,
    '8th ( .paf 7th )': 0,
    '8th ( .paf 6th )': 0,
    'Rooms fail': 0,
    'Area failed': 0,
    'Distance Failed': 0,
    'No Data Available': 0,
  };

  let foundRecognizedData = false;

  for (const row of rows) {
    if (!row || row.length === 0) continue;
    const catRaw = row[catColIdx] || '';
    const normCat = normalizeText(catRaw);
    if (!normCat || normCat === 'grand total' || normCat === 'total') continue;

    let count = 1;
    if (countColIdx !== -1 && row[countColIdx]) {
      const parsedNum = parseInt(row[countColIdx].replace(/,/g, ''), 10);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        count = parsedNum;
      }
    }

    // Match against known patterns
    if (normCat.includes('8th') && normCat.includes('paf') && normCat.includes('6th')) {
      categoryCounts['8th ( .paf 6th )'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('8th') && normCat.includes('paf') && normCat.includes('7th')) {
      categoryCounts['8th ( .paf 7th )'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('7th') && normCat.includes('paf') && normCat.includes('6th')) {
      categoryCounts['7th ( .paf 6th )'] += count;
      foundRecognizedData = true;
    } else if (normCat === '6th' || normCat === '6' || normCat === 'grade 6' || normCat === 'grade 6th') {
      categoryCounts['6th'] += count;
      foundRecognizedData = true;
    } else if (normCat === '7th' || normCat === '7' || normCat === 'grade 7' || normCat === 'grade 7th') {
      categoryCounts['7th'] += count;
      foundRecognizedData = true;
    } else if (normCat === '8th' || normCat === '8' || normCat === 'grade 8' || normCat === 'grade 8th') {
      categoryCounts['8th'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('room')) {
      categoryCounts['Rooms fail'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('area')) {
      categoryCounts['Area failed'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('distance')) {
      categoryCounts['Distance Failed'] += count;
      foundRecognizedData = true;
    } else if (normCat.includes('no data') || normCat.includes('missing') || normCat.includes('n/a')) {
      categoryCounts['No Data Available'] += count;
      foundRecognizedData = true;
    }
  }

  // Calculate total
  const calculatedTotal = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  if (!foundRecognizedData || calculatedTotal === 0) {
    // If not matching or empty table, return verified baseline
    return {
      categories: BASELINE_CATEGORIES,
      totalCount: 3905,
    };
  }

  const updatedCategories: CategoryStat[] = BASELINE_CATEGORIES.map(baseline => {
    const liveCount = categoryCounts[baseline.category] ?? baseline.count;
    return {
      ...baseline,
      count: liveCount,
      percentage: calculatedTotal > 0 ? (liveCount / calculatedTotal) * 100 : baseline.percentage,
    };
  });

  return {
    categories: updatedCategories,
    totalCount: calculatedTotal,
  };
}

/**
 * Main fetcher function for Google Sheet data
 */
export async function fetchLiveGoogleSheetData(spreadsheetId: string = SPREADSHEET_ID, gid: string = DEFAULT_GID): Promise<SheetFetchResult> {
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}&_t=${Date.now()}`;
  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}&_t=${Date.now()}`;

  // Try GViz first
  try {
    const response = await fetch(gvizUrl, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      const parsed = parseGvizResponse(text);
      if (parsed.headers.length > 0 && parsed.rows.length > 0) {
        const { categories, totalCount } = mapRowsToCategories(parsed.headers, parsed.rows);
        return {
          categories,
          phaseBreakdown: {
            ...OFFICIAL_PHASE_BREAKDOWN,
            grandTotalPool: totalCount > 0 ? totalCount : 3905,
          },
          rawRowsCount: parsed.rows.length,
          sourceType: 'live_gviz',
          syncedAt: new Date(),
        };
      }
    }
  } catch (err) {
    console.warn('GViz fetch failed, trying CSV export fallback...', err);
  }

  // Try CSV export fallback
  try {
    const response = await fetch(csvUrl, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      const parsed = parseCsvResponse(text);
      if (parsed.headers.length > 0 && parsed.rows.length > 0) {
        const { categories, totalCount } = mapRowsToCategories(parsed.headers, parsed.rows);
        return {
          categories,
          phaseBreakdown: {
            ...OFFICIAL_PHASE_BREAKDOWN,
            grandTotalPool: totalCount > 0 ? totalCount : 3905,
          },
          rawRowsCount: parsed.rows.length,
          sourceType: 'live_csv',
          syncedAt: new Date(),
        };
      }
    }
  } catch (err) {
    console.warn('CSV export fallback failed, using official verified baseline data', err);
  }

  // Gracefully fallback to baseline data
  return {
    categories: BASELINE_CATEGORIES,
    phaseBreakdown: OFFICIAL_PHASE_BREAKDOWN,
    rawRowsCount: BASELINE_CATEGORIES.length,
    sourceType: 'baseline',
    syncedAt: new Date(),
    warning: 'Live spreadsheet connection timed out or is protected. Displaying verified baseline data.',
  };
}
