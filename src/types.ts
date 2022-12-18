export interface BoardingWaitingLine {
  /** 대기하는 탑승 고객 id */
  peopleId: string;

  /** 출국 심사 후 수행해야할 일 */
  callbackAfterImmigrating: (peopleId: string) => void
}