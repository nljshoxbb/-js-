function swap(i, j, array) {
  var temp = array[j];
  array[j] = array[i];
  array[i] = temp;
}

function selectSort(array) {
  var length = array.length;
  var min;

  for (var i = 0; i < length -1 ; i++) {
    min = i;
    for (var j = i + 1; j < length; j++) {
      if (array[j] < array[min]) {
        min = j;
      }
    }
    console.log(min,i)
    if (min != i) {
      swap(i, min, array);
    }
  }
  return array;
}

const array = [2, 4, 1, 10, 0, 7];

console.log(selectSort(array));
