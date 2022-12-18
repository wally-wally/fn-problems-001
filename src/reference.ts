function Queue(worker: Function) {
  let queue_items: any[] = [];
  let working = false;
    
  function runNext() {
    if (working) return;
    if (queue_items.length === 0) return;
      
    working = true;

    let item = queue_items.shift();

    worker(item.data, function(val: any) {
      working = false;
      setTimeout(item.callback, 0, val);
      runNext();
    });
  }
    
  return function(data: any, callback: Function) {
    queue_items.push({
      data: data,
      callback: callback || function() {}
    });
    setTimeout(runNext, 0);
  };
}

function DroppingQueue(max: number, worker: Function) {
  let queue_items: any[] = [];
  let working = false;
    
  function runNext() {
    if (working) return;
    if (queue_items.length === 0) return;
      
    working = true;

    let item = queue_items.shift();

    worker(item.data, function(val: any) {
      working = false;
      setTimeout(item.callback, 0, val);
      runNext();
    });
  }
    
  return function(data: any, callback: Function) {
    queue_items.push({
      data: data,
      callback: callback || function() {}
    });
    while (queue_items.length > max) {
      queue_items.shift();
    }
    setTimeout(runNext, 0);
  };
}

function Cut(num: number, callback: Function) {
  let num_finished = 0; // 카운터를 0으로 초기화
  return function() { // 리턴되는 함수는 타임라인이 끝났을 때 호출함
    num_finished += 1; // 함수를 호출할 때마다 카운터가 증가
    if (num_finished === num) {
      callback(); // 마지막 타임라인이 끝났을 때 콜백을 호출
    };
  };
}

function JustOnce(action: Function) {
  let alreadyCalled = false; // 함수가 실행됐는지 기억한다.
  return function(a: any, b: any, c: any) {
    if (alreadyCalled) return; // 실행한 적이 있다면 바로 종료한다.
    alreadyCalled = true; // 함수가 실행됐다고 생각하고 실행한 사실을 기록한다.
    return action(a, b, c); // 인자와 함께 액션을 호출한다.
  }
}