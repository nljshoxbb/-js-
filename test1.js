function Promise(executor) {
  var self = this;
  this.status = "pending";
  this.onResolvedCallback = [];
  this.onRejectedCallback = [];

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }

    setTimeout(function() {
      if (self.status === "pending") {
        self.status = "resolved";
        self.data = value;
        for (var i = 0; i < self.onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value);
        }
      }
    });
  }

  function reject(reason) {
    setTimeout(function() {
      if (self.status === "pending") {
        self.status = "rejected";
        self.data = reason;
        for (var i = 0; i < self.onRejectedCallback.length; i++) {
          self.onRejectedCallback[i](reason);
        }
      }
    });
  }

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

Promise.prototype.then = function(onResolved, onRejected) {
  var self = this;
  var promise2;

  onResolved =
    typeof onResolved === "function"
      ? onResolved
      : function(v) {
          return v;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function(r) {
          throw r;
        };

  if (self.status === "resolved") {
    return (promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        try {
          var x = onResolved(self.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          resolve(x);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.status === "rejected") {
    return (promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        try {
          var x = onRejected(self.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.status === "pending") {
    return (promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          var x = onResolved(value);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
          resolve(x); // 否则，以它的返回值做为promise2的结果
        } catch (r) {
          reject(r);
        }
      });

      self.onRejectedCallback.push(function(reason) {
        try {
          // var x = onRejected(reason);
          // resolvePromise(promise2, x, resolve, reject);
          var x = onRejected(self.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};
