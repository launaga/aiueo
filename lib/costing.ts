export type CostLineType = 'per_pax' | 'per_event' | 'per_unit';

export type CostLine = {
  id: string;
  name: string;
  type: CostLineType;
  cost: number;
  units?: number;
  priceLockedDate?: string;
};

export type CostingInput = {
  lines: CostLine[];
  payingPax: number;
  compPax: number;
  contingencyPct: number;
  adhocPct: number;
  overheadPct: number;
  priceMode: 'margin' | 'markup';
  priceValuePct: number;
  ppnPct?: number;
  monthlyOverhead?: number;
  eventsPerMonth?: number;
};

export function calculateCosting(input: CostingInput) {
  const positive = (value: number) => Number.isFinite(value) && value > 0 ? value : 0;
  const payingPax = positive(input.payingPax);
  const compPax = positive(input.compPax);
  const totalPax = payingPax + compPax;
  const varPerPax = input.lines.filter((line)=>line.type==='per_pax').reduce((sum,line)=>sum+positive(line.cost),0);
  const perEvent = input.lines.filter((line)=>line.type==='per_event').reduce((sum,line)=>sum+positive(line.cost),0);
  const perUnit = input.lines.filter((line)=>line.type==='per_unit').reduce((sum,line)=>sum+positive(line.units||0)*positive(line.cost),0);
  const fixed = perEvent + perUnit;
  const contingency = positive(input.contingencyPct)/100;
  const adhoc = positive(input.adhocPct)/100;
  const overhead = positive(input.overheadPct)/100;
  const loading = (1+contingency)*(1+adhoc)*(1+overhead);
  const directCost = fixed + varPerPax*totalPax;
  const contingencyAmount = directCost*contingency;
  const afterContingency = directCost+contingencyAmount;
  const adhocAmount = afterContingency*adhoc;
  const beforeOverhead = afterContingency+adhocAmount;
  const overheadAmount = beforeOverhead*overhead;
  const totalCost = beforeOverhead+overheadAmount;
  const costPerPaying = payingPax>0 ? totalCost/payingPax : Number.POSITIVE_INFINITY;
  const priceFactor = positive(input.priceValuePct)/100;
  const pricePerPax = input.priceMode==='margin'
    ? priceFactor<1 ? costPerPaying/(1-priceFactor) : Number.POSITIVE_INFINITY
    : costPerPaying*(1+priceFactor);
  const netMargin = pricePerPax>0&&Number.isFinite(pricePerPax) ? 1-costPerPaying/pricePerPax : Number.NEGATIVE_INFINITY;
  const markupEquivalent = costPerPaying>0&&Number.isFinite(pricePerPax) ? pricePerPax/costPerPaying-1 : Number.NaN;
  const revenue = pricePerPax*payingPax;
  const profit = revenue-totalCost;
  const profitPerPax = payingPax>0 ? profit/payingPax : Number.NaN;
  const denominator = pricePerPax-loading*varPerPax;
  const breakEven = denominator>0 ? loading*(fixed+varPerPax*compPax)/denominator : Number.POSITIVE_INFINITY;
  const lowPayingPax = Math.max(0,Math.round(payingPax*.8));
  const lowCost = (fixed+varPerPax*(lowPayingPax+compPax))*loading;
  const lowMargin = lowPayingPax>0&&pricePerPax>0 ? 1-(lowCost/lowPayingPax)/pricePerPax : Number.NEGATIVE_INFINITY;
  const ppnPct = positive(input.ppnPct||0);
  const priceWithPpn = pricePerPax*(1+ppnPct/100);
  const trueOverheadPerEvent = positive(input.monthlyOverhead||0)>0&&positive(input.eventsPerMonth||0)>0
    ? positive(input.monthlyOverhead||0)/positive(input.eventsPerMonth||0)
    : null;
  const trueTotalCost = trueOverheadPerEvent===null ? null : beforeOverhead+trueOverheadPerEvent;
  const trueMargin = trueTotalCost===null||payingPax<=0||pricePerPax<=0 ? null : 1-(trueTotalCost/payingPax)/pricePerPax;
  const trueProfit = trueTotalCost===null ? null : revenue-trueTotalCost;
  const overheadGap = trueOverheadPerEvent===null ? null : trueOverheadPerEvent-overheadAmount;

  return { payingPax,compPax,totalPax,varPerPax,perEvent,perUnit,fixed,loading,directCost,contingencyAmount,adhocAmount,overheadAmount,totalCost,costPerPaying,pricePerPax,priceWithPpn,netMargin,markupEquivalent,revenue,profit,profitPerPax,breakEven,lowPayingPax,lowMargin,trueOverheadPerEvent,trueMargin,trueProfit,overheadGap };
}

export function isVendorPriceStale(priceLockedDate?: string, referenceDate=new Date()) {
  if (!priceLockedDate) return true;
  const locked = new Date(`${priceLockedDate}T00:00:00`);
  if (Number.isNaN(locked.getTime())) return true;
  return referenceDate.getTime()-locked.getTime()>90*24*60*60*1000;
}
