function swap(i, j, array) {
  var temp = array[j];
  array[j] = array[i];
  array[i] = temp;
}

function bubbleSort(array) {
  var length = array.length;
  var isSwap;

  for (var i = 1; i < length; i++) {
    isSwap = false;
    for (var j = 0; j < length - i; j++) {
      //   array[j] > array[j + 1] && (isSwap = true) && swap(j, j + 1, array);
      if (array[j] > array[j + 1]) {
        isSwap = true;
        swap(j, j + 1, array);
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
