import { describe, expect, it } from 'vitest';
import { calculateCosting, isVendorPriceStale, type CostLine } from '@/lib/costing';

const lines:CostLine[]=[
  {id:'variable',name:'Meals',type:'per_pax',cost:100_000,priceLockedDate:'2026-08-20'},
  {id:'fixed',name:'Bus',type:'per_event',cost:5_000_000,priceLockedDate:'2026-08-20'},
  {id:'units',name:'Jeep',type:'per_unit',units:2,cost:1_000_000,priceLockedDate:'2026-08-20'},
];

describe('AIUEO costing source of truth',()=>{
  it('charges complimentary pax and keeps margin distinct from markup',()=>{
    const result=calculateCosting({lines,payingPax:100,compPax:10,contingencyPct:0,adhocPct:0,overheadPct:0,priceMode:'margin',priceValuePct:20});
    expect(result.directCost).toBe(18_000_000);
    expect(result.costPerPaying).toBe(180_000);
    expect(result.pricePerPax).toBe(225_000);
    expect(result.netMargin).toBeCloseTo(.2);
    expect(result.markupEquivalent).toBeCloseTo(.25);
  });
  it('applies the conservative loading stack multiplicatively',()=>{
    const result=calculateCosting({lines,payingPax:100,compPax:0,contingencyPct:5,adhocPct:5,overheadPct:15,priceMode:'markup',priceValuePct:25});
    expect(result.loading).toBeCloseTo(1.267875);
    expect(result.totalCost).toBeCloseTo(21_553_875);
  });
  it('does not divide by zero and marks missing vendor lock dates stale',()=>{
    const result=calculateCosting({lines,payingPax:0,compPax:1,contingencyPct:0,adhocPct:0,overheadPct:0,priceMode:'margin',priceValuePct:25});
    expect(result.costPerPaying).toBe(Number.POSITIVE_INFINITY);
    expect(isVendorPriceStale(undefined,new Date('2026-09-02'))).toBe(true);
    expect(isVendorPriceStale('2026-08-20',new Date('2026-09-02'))).toBe(false);
  });
  it('replaces percentage overhead with a monthly reality check',()=>{
    const result=calculateCosting({lines,payingPax:100,compPax:0,contingencyPct:0,adhocPct:0,overheadPct:10,priceMode:'margin',priceValuePct:25,monthlyOverhead:12_000_000,eventsPerMonth:2});
    expect(result.trueOverheadPerEvent).toBe(6_000_000);
    expect(result.overheadGap).toBe(4_300_000);
  });
});
