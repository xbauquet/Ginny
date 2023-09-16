export class ActionsBilling {
  constructor(public readonly includedMinutes: number,
              public readonly totalMinutesUsed: number,
              public readonly totalPaidMinutesUsed: number,
              public readonly minutesUsedBreakdown: any) {
  }
}
