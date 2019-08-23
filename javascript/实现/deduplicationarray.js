// 数组去重

const array = ["1", 1, 1, 2, "2",[1,2],[1,2], 2, "2", { name: 1 }, { name: 1 }, NaN, NaN];

// 双循环
function unique1(array) {
  var newArr = [];
  var len = array.length;
  var isRepeat;

  for (let i = 0; i < len; i++) {
    isRepeat = false;
    for (var j = i + 1; j < len; j++) {
      if (array[i] === array[j]) {
        isRepeat = true;
        break;
      }
    }
    if (!isRepeat) {
      newArr.push(array[i]);
    }
  }
  return newArr;
}
// console.log(unique1(array));

// Array.prototype.indexOf()
function unique2(array) {
  return array.filter((item, index) => {
    return array.indexOf(item) === index;
  });
}

// console.log(unique2(array))

// sort 行不通
function unique3(array) {
  var newArr = [];
  array.sort();
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== array[i + 1]) {
      newArr.push(array[i]);
    }
  }
  return newArr;
}

// console.log(unique3(array))

function unique4(array) {
  var tep = new Map();
  return array.filter(item => {
    return !tep.has(item) && tep.set(item, 1);
  });
}

// console.log(unique4(array))

// set

function unique5(array) {
  return Array.from(new Set(array));
}

// Object 键值对

function unique5(array) {
  var obj = {};

  return array.filter((item, index) => {
    var key = typeof item + JSON.stringify(item);
    return obj.hasOwnProperty(key) ? false : (obj[key] = true);
  });
}

console.log(unique5(array))