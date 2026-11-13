export class SeededRandom {
  constructor(seed) { this.state = seed >>> 0; }
  next() { let t = this.state += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  range(a,b) { return a + this.next() * (b-a); }
  pick(values) { return values[Math.floor(this.next()*values.length)]; }
}
