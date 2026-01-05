import * as fs from 'fs';

interface FeeSchedule {
  [cptCode: string]: number;
}

interface ChargeResult {
  cptCode: string;
  hospitalCharge: number;
  allowedFee: number;
  overcharge: number;
  savings: number;
}

interface CheckChargesResult {
  results: ChargeResult[];
  totalSavings: number;
}

function parseCSV(content: string): { [key: string]: string }[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: { [key: string]: string } = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || '';
    });
    return obj;
  });
}

export function checkCharges(userCsvPath: string, feeSchedulePath: string): CheckChargesResult {
  // Read and parse fee schedule JSON
  const feeScheduleContent = fs.readFileSync(feeSchedulePath, 'utf-8');
  const feeSchedule: FeeSchedule = JSON.parse(feeScheduleContent);

  // Read and parse user CSV
  const csvContent = fs.readFileSync(userCsvPath, 'utf-8');
  const csvRows = parseCSV(csvContent);

  const results: ChargeResult[] = [];
  let totalSavings = 0;

  for (const row of csvRows) {
    const cptCode = row['CPT Code'] || row['cpt'] || row['code'] || ''; // flexible column name
    const hospitalChargeStr = row['Hospital Charge'] || row['charge'] || '';
    const hospitalCharge = parseFloat(hospitalChargeStr) || 0;

    const allowedFee = feeSchedule[cptCode] || 0;
    const overcharge = Math.max(0, hospitalCharge - allowedFee);
    const savings = overcharge;

    results.push({
      cptCode,
      hospitalCharge,
      allowedFee,
      overcharge,
      savings
    });

    totalSavings += overcharge;
  }

  return { results, totalSavings };
}
