import { BoardingWaitingLine } from "./types";

export default class Airline {
  /** 탑승 대기 줄 */
  private boardingWaitingLine: BoardingWaitingLine[];

  /** 탑승 고객 */
  private readonly _customersOnBoard: string[];

  /** 출국 심사 중인지 확인 */
  private isImmigrating = false;

  /** 최대 탑승 고객 수 */
  private readonly maxCustomer: number;

  constructor(maxCustomer = Number.MAX_SAFE_INTEGER) {
    this.boardingWaitingLine = []; // 탑승 대기 줄 초기화
    this._customersOnBoard = []; // 탑승 고객 초기화
    this.maxCustomer = maxCustomer;
  }

  /** 탑승한 고객 가져오기 */
  get customersOnBoard() {
    return this._customersOnBoard;
  }

  /** 탑승 대기 줄에 줄 서기 */
  addToLine(peopleId: string) {
    console.log(`${peopleId} - 줄서기를 했습니다.`);
    this.boardingWaitingLine.push({
      peopleId,
      callbackAfterImmigrating: (peopleId) => {
        console.log(`${peopleId} - 탑승이 시작했습니다.`);
        this.addCustomerOnBoard(peopleId); // 탑승 완료 시키기
      }
    })

    // 새로운 체크인
    this.newCheckIn();
  }

  /** 탑승한 인원으로 추가하기 */
  addCustomerOnBoard(peopleId: string) {
    this._customersOnBoard.push(peopleId);
  }

  /** 
   * 출국 심사를 진행합니다.
   * 
   * 출국 심사는 출국심사원에 따라서 랜덤한 시간을 가집니다.
   */
  immigration(peopleId: string, callback: Function) {
    setTimeout(() => {
      console.log(`${peopleId} - 출국 심사 중...`);
      callback();
    }, Math.floor(Math.random() * 3 * 1000));
  }

  /**
   * 체크인 하기
   * 
   * 체크인은 시간이 걸립니다.
   */
  newCheckIn() {
    if (this.isImmigrating) {
      console.log('체크인 하는 사람 아직 있당');
      return;
    }

    if (!this.boardingWaitingLine.length) {
      console.log("탑승 가능한 인원이 없습니다.");
      return;
    }

    this.isImmigrating = true;

    // 대기줄에서 첫번째 사람을 탑승자로 지정한다.
    const { peopleId, callbackAfterImmigrating } = this.boardingWaitingLine.shift() as BoardingWaitingLine;

    if (this._customersOnBoard.length >= this.maxCustomer) {
      console.log('최대 탑승 고객 수에 도달했습니다.');
      return;
    }

    this.immigration(peopleId, () => {
      if (peopleId) {
        this.isImmigrating = false;
        callbackAfterImmigrating(peopleId);
        this.newCheckIn();
      }
    });
  }
}
