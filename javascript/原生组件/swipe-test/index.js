// 如果模块没有依赖，如果模块没有依赖关系，上面的模式可以简化为
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    //AMD,注册一个匿名模块
    define([], function() {
      root.Swipe = factory();
      return root.Swipe;
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Swipe = factory();
  }
})(this, function() {
  var root =
    (typeof self == "object" && self.self === self && self) ||
    (typeof global == "object" && global.global === global) ||
    this;

  var _document = root.document;

  function Swipe(container, options) {
    "use strict";

    options = options || {};

    //设置初始化变量
    var start = {};
    var delta = {};
    var isScrolling;

    //设置自动滑动
    var delay = options.auto || 0;
    var interval;

    var disabled = false;

    //工具集
    //没有操作的方法
    var noop = function() {};
    //卸载功能执行
    var offloadFn = function(fn) {
      setTimeout(fn || noop, 0);
    };
    //返回一个函数，只要它继续被调用，就不会被触发
    var throttle = function(fn, threshhold) {
      threshhold = threshhold || 100;
      var timeout = null;

      function cancel() {
        if (timeout) clearTimeout(timeout);
      }

      function throttleFn() {
        var context = this;
        var args = arguments;
        timeout = setTimeout(function() {
          timeout = null;
          fn.apply(context, args);
        }, threshhold);
      }

      //允许删除限制超时
      throttledFn.cancel = cancel;

      return throttledFn;
    };

    //检查是否具有浏览器功能
    var browser = {
      addEventListener: !!root.addEventListener,
      touch:
        "ontouchstart" in root ||
        (root.DocumentTouch && _document instanceof DocumentTouch),
      transitions: (function(temp) {
        var props = [
          "transitionProperty",
          "WebkitTransition",
          "MozTransition",
          "OTransition",
          "msTransition"
        ];
        for (var i in props) {
          if (temp.style[props[i]] !== undefined) {
            return true;
          }
        }
        return false;
      })(_document.createElement("swipe"))
    };

    //如果没有根元素，则退出
    if (!container) return;

    var element = container.children[0];
    var slides, slidePos, width, length;
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed || 300;
    options.continuous =
      options.continuous !== undefined ? options.continuous : true;
    options.autoRestart =
      options.autoRestart !== undefined ? options.autoRestart : false;

    // 节流设置
    // var throttledSetup = throttle(setup);

    //设置事件捕获
    var events = {
      handleEvent: function(event) {
        if (disabled) return;

        switch (event.type) {
          case "mousedown":
          case "touchstart":
            break;
        }
      },
      start: function(event) {
        var touches;

        if (isMouseEvent(event)) {
          touches = event;
          event.preventDefault();
        } else {
          touches = event.touches[0];
        }
        //获取初始坐标
        start = {
          x: touches.pageX,
          y: touches.pageY,
          //保存时间，为触摸时间
          time: +new Date()
        };

        // 用于测试第一次移动事件
        isScrolling = undefined;

        // 重置增量和结束测量
        delta = {};

        //附加touchmove和touchend监听器
        if (isMouseEvent(event)) {
          element.addEventListener("mousemove", this, false);
          element.addEventListener("mouseup", this, false);
          element.addEventListener("mouseleave", this, false);
        } else {
          element.addEventListener("touchmove", this, false);
          element.addEventListener("touchend", this, false);
        }
      },
      move: function(event) {
        var touches;
        if (isMouseEvent(event)) {
          touches = event;
        } else {
          // 移动端
          // 确保是滑动手势而不是放大手势
          if (event.touches.length > 1 || (event.scale && event.scale !== 1)) {
            return;
          }

          if (options.disableScroll) {
            event.preventDefault();
          }
          touches = event.touches[0];
        }

        //衡量x和y的变化
        delta = {
          x: touches.pageX - start.x,
          y: touches.pageY - start.y
        };

        //确定滚动测试是否已经运行 - 一次性测试
        if (typeof isScrolling === "undefined") {
          isScrolling = !!(
            isScrolling || Math.abs(delta.x) < Math.abs(delta.y)
          );
        }

        //如果用户不试图垂直滚动
        if (!isScrolling) {
          // 阻止本地滚动
          event.preventDefault();

          //停止幻灯片放映
          stop();

          // 如果是第一次或最后一次滑动则增加阻力
          if (options.continuous) {
            //我们不会在最后加上阻力
            translate(
              circle(index - 1),
              delta.x + slidePos[circle(index - 1)],
              0
            );
            translate(index, delta.x + slidePos[index], 0);
            translate(
              circle(index + 1),
              delta.x + slidePos[circle(index + 1)],
              0
            );
          } else {
            delta.x =
              delta.x /
              ((!index && delta.x > 0) || //第一个幻灯片向左滑动
              (index === slides.length - 1 && // 或者最后一个幻灯片向右滑动
                delta.x < 0) //如果滑动的话
                ? Math.abs(delta.x) / width + 1 // 确定阻力水平
                : 1); //如果没设置阻力

            // translate 1:1
            translate(index - 1, delta.x + slidePos[index - 1], 0);
            translate(index, delta.x + slidePos[index], 0);
            translate(index + 1, delta.x + slidePos[index + 1], 0);
          }
        }
      },
      end: function(event) {
        //触摸时间间隔
        var duration = +new Date() - start.time;

        // 计算 是否触发滑动按钮动作
        var isValidSlide =
          (Number(duration) < 250 && Math.abs(delta.x) > 20) ||
          Math.abs(delta.x) > width / 2;

        //确定幻灯片尝试是否过去开始和结束
        var isPastBounds = !index && delta.x > 0 || index===slides.length-1 && delta.x<0;

        if(options.continuous){
            isPastBounds = false;
        }
      }
    };

    function translate(index, dist, speed) {
      var slide = slides[index];
      var style = slide && slides.style;

      if (!style) return;

      style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration =
        speed + "ms";

      style.webkitTransform = "translate(" + dist + "px,0)" + "translateZ(0)";
      style.msTransform = style.MozTransform = style.OTransform =
        "translateX(" + dist + "px)";
    }

    function circle(index) {
      // 使用幻灯片长度的简单正模
      return (slides.length + index % slides.length) % slides.length;
    }

    function stop() {
      delay = 0;
      clearInterval(interval);
    }

    function isMouseEvent(e) {
      return /^mouse/.test(e.type);
    }
  }

  if (root.jQuery) {
  }

  return Swipe;
});
