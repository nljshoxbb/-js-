(function(window) {
  "use strict";

  var _global;

  function extend(option, newOption, override) {
    for (var key in newOption) {
      if (
        newOption.hasOwnProperty(key) &&
        (!option.hasOwnProperty(key) || override)
      ) {
        option[key] = newOption[key];
      }
    }
    return option;
  }

  var Banner = function Banner(option) {
    this._initial(option);
  };

  Banner.prototype = {
    constructor: this,
    _initial: function(option) {
      var defaultOption = {
        id: "banner"
      };

      this.def = extend(defaultOption, option);
      this.banner = document.getElementById(this.def.id);
      this.room = this.banner.getElementsByTagName("div")[0];
      this.img = this.room.getElementsByTagName("img");
      this.bannerWidth = parseInt(getComputedStyle(this.banner).width);
      this.bannerHeght = parseInt(getComputedStyle(this.banner).height);

      this.upButton = null;
      this.downButton = null;
      this.navButton = null;

      this.timer = null;
      this.imgIndex = 1;
      this.speed = -(this.bannerWidth / 10); //动画速度

      this.resetAllButton();
      this.banner.onmouseenter = this.onmouseenter.bind(this);
      this.banner.onmouseleave = this.onmouseleave.bind(this);
      this.downButton.onclick=this.nextStart.bind(this);

    },
    resetAllButton: function() {
      var buttonPosition = this.bannerHeght / 2 - 14;
      this.banner.setAttribute("class", "banner");
      this.room.style.left = 0 + "px";
      this.room.style.width = this.bannerWidth * this.img.length + "px";
      this.room.setAttribute("class", "room");

      //prev
      var prevButton = document.createElement("div");
      prevButton.innerHTML = "<";
      prevButton.setAttribute("class", "buttonCss prev");
      prevButton.style.left = 0 + "px";
      prevButton.style.top = buttonPosition + "px";
      this.banner.appendChild(prevButton);
      this.upButton = this.banner.querySelector(".prev");

      //next
      var nextButton = document.createElement("div");
      nextButton.innerHTML = ">";
      nextButton.setAttribute("class","buttonCss next");
      nextButton.style.right = 0 +'px';
      nextButton.style.top = buttonPosition +  'px';
      this.banner.appendChild(nextButton);
      this.downButton = this.banner.querySelector(".next");

      //创建导航圆点定位
      var nav = document.createElement('ul');
      nav.setAttribute("id","nav");
      nav.setAttribute("class","nav");
      this.banner.appendChild(nav);

      //生成导航原点定位框
      var navButtonLiArr = [];
      for(var i=0;i<this.img.length;i++){
        var navButtonLi = document.createElement("li");
        navButtonLi.setAttribute("class","navButton");
        navButtonLi.setAttribute("index",i+1);
        nav.appendChild(navButtonLi);
      }
      this.navButton = this.banner.getElementsByTagName('li');
      this.navButton[0].style.background = '#333';
    },
    onmouseenter:function(){
      this.downButton.style.display="block";
      this.upButton.style.display = "block";
      clearInterval(this.autoStart);
      this.autoStart = null;
    },
    onmouseleave:function () {
      this.downButton.style.display="none";
      this.upButton.style.display = "none";
      clearInterval(this.autoStart);
      this.autoStart = null;
    },
    nextStart:function(){
      clearInterval(this.timer);
     
      var fn = function(){
     
        var left = parseInt(this.room.style.left);
        if(this.imgIndex<this.img.length){
          console.log(this.bannerWidth)
          if(left > -this.bannerWidth * this.imgIndex){
            this.room.style.left = parseInt(this.room.style.left)+this.speed + 'px';
          }else{
            
          }
        }else{
          clearInterval(this.timer);
          this.room.style.left = 0+'px';
          var lastButtonStyle = this.navButton[this.imgIndex-1].style.background
          lastButtonStyle = '#fff'; 
          this.imgIndex = 1;
          lastButtonStyle = '#333';
        }
      }

      this.timer = setInterval(fn.bind(this),16.7);
    }
  };

  //   this.Banner = Banner;
  _global = (function() {
    return this || window;
  })();

  if (typeof module != "undefined" && module.exports) {
    module.exports = Banner;
  } else if (typeof define === "function" && define.amd) {
    define(function() {
      return Banner;
    });
  } else {
    !("Banner" in _global) && (_global.Banner = Banner);
  }
})(window);
