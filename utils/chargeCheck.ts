import * as fs from 'fs';

interface ProcedureInput {
  code: string;
  hospitalCharge: number;
}

interface BreakdownItem {
  code: string;
  hospitalCharge: number;
  medicareFee: number | null;
  savings: number | null;
}

interface CheckChargesResult {
  breakdown: BreakdownItem[];
  totalSavings: number;
}

export function checkCharges(procedures: ProcedureInput[]): CheckChargesResult {
  // Read and parse fee schedule JSON
  const feeData: any[] = JSON.parse(fs.readFileSync('data/feeSchedule.json', 'utf-8'));

  // Create a map for efficient lookup of active codes
  const feeMap = new Map<string, number>();
  for (const item of feeData) {
    if (item.status === 'A') {
      feeMap.set(item.code, item.nonFacilityFee);
    }
  }

  const breakdown: BreakdownItem[] = [];
  let totalSavings = 0;

  for (const proc of procedures) {
    const medicareFee = feeMap.get(proc.code) || null;
    const savings = medicareFee !== null ? proc.hospitalCharge - medicareFee : null;

    breakdown.push({
      code: proc.code,
      hospitalCharge: proc.hospitalCharge,
      medicareFee,
      savings
    });

    if (savings !== null) {
      totalSavings += savings;
    }
  }

  return { breakdown, totalSavings };
}
