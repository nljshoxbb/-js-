function swap(array, i, k) {
  var temp = array[i];
  array[i] = array[k];
  array[k] = temp;
}

function bubbleSort(array) {
  var length = array.length;
  var isSwap;

  for (let i = 1; i < length; i++) {
    isSwap = false;
    for (let j = 0; j < length - i; j++) {
      if (array[j] > array[j + 1]) {
        isSwap = true;
        swap(array, j, j + 1);
      }
    }
    if (!isSwap) {
      break;
    }
  }
  return array;
}

const array = [2, 4, 1, 10, 0, 7];

console.log(bubbleSort(array));
