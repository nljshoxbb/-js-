function Promise(executor) {
  var self = this

  self.status = 'pending'
  self.onResolvedCallback = []
  self.onRejectedCallback = []

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }

  function reject(reason) {
    setTimeout(function() { // 异步执行所有的回调函数
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason)
        }
      }
    })
  }

  try {
    executor(resolve, reject)
  } catch (reason) {
    reject(reason)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') { //because x could resolved by a Promise Object
      x.then(function(v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
      x.then(resolve, reject)
    }
    return
  }

  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then //because x.then could be a getter
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2
  onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
    return v
  }
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
    throw r
  }

  if (self.status === 'resolved') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onResolved
        try {
          var x = onResolved(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }

  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() { // 异步执行onRejected
        try {
          var x = onRejected(self.data)
          resolvePromise(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    })
  }

  if (self.status === 'pending') {
    // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })

      self.onRejectedCallback.push(function(reason) {
          try {
            var x = onRejected(reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (r) {
            reject(r)
          }
        })
    })
  }
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}




// var Promise = function(fn) {
//   var value = null;
//   var callbacks = [];
//   var state = "pending"; // pending, fulfilled, rejected

//   var promise = this;

//   // 注册then事件，供resolve后调用
//   promise.then = function(onFulfilled, onRejected) {
//     // 返回promise实现链式promise调用
//     return new Promise(function(resolve, reject) {
//       handle({
//         onFulfilled: onFulfilled || null,
//         onRejected: onRejected || null,
//         resolve: resolve,
//         reject: reject
//       });
//     });
//   };

//   promise.catch = function(onRejected) {
//     return promise.then(undefined, onRejected);
//   };

//   function handle(callback) {
//     // 状态变化前，事件推进队列里；状态一旦变化后不再变动，直接执行结果
//     if (state === "pending") {
//       callbacks.push(callback);
//     } else {
//       var cb = state === "fulfilled" ? callback.onFulfilled : callback.onRejected;
//       // then方法没有传递任何参数的情况下，返回结果值
//       if (!cb) {
//         cb = state === "fulfilled" ? callback.resolve : callback.reject;
//         cb(value);
//       } else {
//         try {
//           var ret = cb(value);
//           callback.resolve(ret);
//         } catch (e) {
//           callback.reject(e);
//         }
//       }
//     }
//   }

//   function resolve(newValue) {
//     // 状态一旦改变便不再改变
//     if (state !== "pending") return;
//     // 假如resolve了一个promise的话（链式promise）
//     if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
//       var then = newValue.then;
//       if (typeof then === "function") {
//         // 调用第二个promise中的then，递归直到不是一个promise值为止
//         then.call(newValue, resolve, reject);
//         return;
//       }
//     }

//     value = newValue;
//     state = "fulfilled";

//     execute();
//   }

//   function reject(reason) {
//     // 状态一旦改变便不再改变
//     if (state !== "pending") return;
//     state = "rejected";
//     value = reason;

//     execute();
//   }

//   function execute() {
//     // 使用setTimeOut保证resolve一定在then事件注册后执行
//     setTimeout(() => {
//       callbacks.forEach(function(callback) {
//         handle(callback);
//       });
//     }, 0);
//   }

//   fn(resolve, reject);
// };

var promise1 = new Promise((resolve, reject) => {
  resolve("111");
});

promise1
  .then(function(value) {
    // console.log(value + "then1");
    // return new Promise((resolve, reject) => {
    //   resolve('222');
    // });
    console.log(value + "then1");
    return "then1";
  })
  .then(function(value) {
    console.log(value + "then2");
  })
  .catch(function(value) {
    console.error("catch" + value);
  });
