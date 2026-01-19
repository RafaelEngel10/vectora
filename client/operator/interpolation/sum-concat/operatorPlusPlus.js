import { runActionOnElements } from '../../../../src/app/runActionOnElements.js';
import { macron } from '../../../../console.js';
import { filterAnimation } from '../../../../src/filter/switchFilterAnimation.js';
import { between } from '../../../../strings.js';

export class Interpolation {
  constructor(result) {
    this.result = result;

    if (result === 'SUM') {
      this.Sum = class {

        constructor(element, function1, function2) {
          this.el = element;
          this.fun1 = function1.split('(')[0] || '';
          this.fun2 = function2.split('(')[0] || '';
          this.args = [];
          this.args[0] = between(function1, '(', ')');
          this.args[1] = between(function2, '(', ')');
        }

        sumFunctions() {
          
        }

      }

    }


    else if (result === 'CONCAT') {
      this.Concat = class {

        constructor(element, function1, function2) {
          this.el = element;
          this.fun1 = function1.split('(')[0] || '';
          this.fun2 = function2.split('(')[0] || '';
          this.args = [];
          this.args[0] = between(function1, '(', ')');
          this.args[1] = between(function2, '(', ')');
        }

        async concatFunctions() {
          const waitingList = [this.fun1, this.fun2];
          for (let i = 0; i < waitingList.length; i++) {
            const waiter = waitingList[i];
            const animations = filterAnimation(waiter);
            const fn = animations[waiter];


            const result = await fn(this.el, this.args[i]); 

            console.log(`${waiter}, ${result instanceof Promise}`)
          }
        }
      }

    }


  }
}