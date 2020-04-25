import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { flush, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

describe('Async Testing Example', () => {
  // Not recommended ****************************
  it('Asyncchronous test example with Jamine done()', (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  // Now test is executed inside an Angular Zone. fakeAsync monitors all async operations such as setTimeout,
  // and guarantee all async are completed befefore moving forward to assertions
  it('Asynchronous test example - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
    });

    setTimeout(() => {
        console.log('running assertions setTimeout()');
        test = true;
        expect(test).toBeTruthy();
    }, 1000);

    flush();
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - plain Promise', fakeAsync(() => {
    let test = false;
    console.log('Creating Promise');
    Promise.resolve()
      .then(() => {
        console.log('Promise FIRST evaluated successfully');
        return Promise.resolve();
      })
      .then(() => {
        console.log('Promise SECOND evaluated successfully');
        test = true;
      });

    flushMicrotasks();
    console.log('Running test assertion');
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it('Asynchronous test example - Observables', fakeAsync(() => {
    let test  = false;
    console.log('Creating Promise');

    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    tick(1000);
    console.log('Running test assertion');
    expect(test).toBeTruthy();
  }));

});
