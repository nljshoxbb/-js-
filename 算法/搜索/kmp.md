```
  // 计算部分匹配表的方法，接收一个字符串，以数组的形式返回部分匹配表
    function getPartialMatchTable(str) {
        // 定义结果变量 result ，因为第一位的部分匹配值一定为0，所以先写好
        let result = [0];
        // 计算字符串的长度
        let len = str.length;

        //如果字符串的长度只有1，那就直接返回结果就好，
        if (len === 1) {
            return result;
        }

        /*
            整体思想是：每次取出字符串的一种组合，然后把这个组合的匹配值计算好后加入数组
        */

        // 开始循环，之所以从1开始，是因为我们一开始就在result数组里写好了第一位
        for (let i = 1; i < len; i++) {
            // 把字符串切分，得到一种组合
            let curStr = str.substring(0, i + 1);
            // 计算当前组合的长度
            let curLen = curStr.length;

            // 围绕当前被划分出来的字符串，开始了一个循环，计算匹配值
            // 注意，这个循环我把他倒着来，也就是从大到小，原因继续往下看
            for (let j = curLen; j > 1; j--) {
                /*
                    每一轮循环，获取一个头尾部的组合，比如当前字符串是 [ABAAB]
                    head 和 tail 会把这个字符串拆分成：
                    ABA 和 AAB 比较
                    AB 和 AB 比较
                    A 和 B 比较
                    因为我们要获取的是最长的那个重复值的长度作为匹配值，从位数多的开始比较
                    一旦匹配了，就可以结束比较了，如果从位数小的开始，那么即使当前匹配成功了，也许再多一位还有重复的呢？还需要继续匹配，这就是循环从大到小的原因
                */
                let head = curStr.slice(0, j - 1);
                let tail = curStr.slice(-j + 1);

                // 一旦得到前后相等的情况，说明匹配的字符串找到了，计算好匹配值后存入结果数组就好
                if (head === tail) {
                    result[i] = head.length
                    break;
                }
            }
            //
            return result;
        }
    }
    /*
        KMP 算法，整体思想就是重复之前总结的 KMP 步骤：
        1. 已暴力匹配的思想开始两个字符串的一一匹配
        2. 当匹配失败时，检查之前的位数是否有匹配成功过
        3. 若没有，继续暴力匹配（就是往前移一位继续比较）
        4. 若有，计算前面匹配成功的字符串组合的「部分匹配表」
        5. 用 `用已匹配的组合的长度 - 这个组合的部分匹配值` 得出下一步需要移动的位数
        6. 将目标字符串移动相应步数，继续比较（重复以上步骤）
    */

    function KMP(target, source) {
        // 获取目标字符串的长度
        const targetLen = target.length;
        // 获取源字符串的长度
        const sourceLen = source.length;

        let i;
        let j;

        // 得到目标字符串的部分匹配表
        let partialMatchTable = getPartialMatchTable(target);
        // 预先定义结果为 false
        let result = false;

        // 开始循环，外层循环的是源字符串
        for (i = 0; i < sourceLen; i++) {
            // 内部嵌套循环，循环目标字符串
            for (j = 0; j < targetLen; j++) {
                // 逐一比较目标字符串和源字符串的每一个字母，如果当前字母
                // 匹配的话，j 的值递增，比较下一个，
                // 如果不匹配，说明要开始移动了，进入 if 语句...
                // 这里的 source.chartAt(i+j) 目的是移位比较，假如 i 多了
                // 1，说明就是把目标字符串的当前字母和源字符串的下一个字母比较
                // 相当于把目标字符串向右移了一位，所以 i 的偏移量就代表目标字符串
                // 的移动位数
                if (target.charAt(j) != source.charAt(i + j)) {
                    // 进入循环，判断
                    // 1. 之前有没有匹配成功的组合（j是否大于0），
                    // 2. 如果有，其「部分匹配值」是否大于 0
                    // 这里判断部分匹配值是否大于 0，目的在于决定要不要跳着移，
                    // 如果部分匹配值是 0，说明当前匹配成功的组合中没有头尾重复的值
                    // 这时候只能接着暴力循环，一位一位移，直到找到下一个匹配的值
                    if (j > 0 && partialMatchTable[j - 1] > 0) {
                        // 套公式：下次要移动的位数 = 用已匹配的组合的长度 - 这个组合的部分匹// 配值 算出要跳移的位数，那么在下一轮循环中目标字符串就会移动到相应位// 置了
                        i += j - partialMatchTable[j - 1] - 1;
                    }
                    break;
                }
            }
            // 每一轮小循环后，都判断一下当前匹配的位数是否等于目标字符串的长度
            // 如果相等，说明匹配完全成功了，将结果改为 true
            if (j == targetLen) {
                result = true
                break
            }
        }
        return result
    }

    var a = KMP('abc','abdbcnabc');
    console.log(a)
```
