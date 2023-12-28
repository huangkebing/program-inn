---
title: LCR_Part.1
date: 2023-08-02 10:21:32
categories: [算法, 剑指offerⅡ]
excerpt: LCR(又名剑指offer2)系列算法题，第一部分——1至20题
---

## <font color="green">1、整数除法</font>

给定两个整数 `a` 和 `b` ，求它们的除法的商 `a/b` ，要求不得使用乘号 `'*'`、除号 `'/'` 以及求余符号 `'%'` 。

**注意：**

- 整数除法的结果应当截去（`truncate`）其小数部分，例如：`truncate(8.345) = 8` 以及 `truncate(-2.7335) = -2`
- 假设我们的环境只能存储 32 位有符号整数，其数值范围是 `[−2^31, 2^31−1]`。本题中，如果除法结果溢出，则返回 `2^31 − 1`

```
示例 1：
输入：a = 15, b = 2
输出：7
解释：15/2 = truncate(7.5) = 7

示例 2：
输入：a = 7, b = -3
输出：-2
解释：7/-3 = truncate(-2.33333..) = -2

示例 3：
输入：a = 0, b = 1
输出：0

示例 4：
输入：a = 1, b = 1
输出：1

提示:
- -2^31 <= a, b <= 2^31 - 1
- b != 0
```

注意：本题与主站 29 题相同：https://leetcode-cn.com/problems/divide-two-integers/

{% notel green 题解思路 %}

因不能使用乘除，想到的解法就是循环减，但仔细不想感觉不对劲。如2^30^ / 1，那就要循环2^30^次，这其实就算是暴力解法是不能接受的

学习了别人的解法，是基于循环减的优化版，利用2的幂次减少循环次数：

```
如果满足n+n<m，n=n+n，商=商+商,如m=20,n=3：
- n=3,商=1，3+3<20成立
- n=3+3=6,商=1+1=2，6+6<20成立
- n=6+6=12，商=2+2=4，12+12<20不成立
执行m=m-n，n=3,并重复上述逻辑，直到m<n:
- m=20-12=8,n=3,商=1，3+3<8成立
- n=3+3=6，商=1+1=2，6+6<8不成立
- m=8-6=2,此时m<n,结束循环并累加商：
最终商=4+2=6
```

此外还需要注意越界问题，-2^31^/-1会越界

而且正负数对应执行减加法，我们需要先将两个数都转化为同符号，因为正数转负数不会越界因此统一转化为负数来计算

{% endnotel %}

```java
class Solution {
    public int divide(int dividend, int divisor) {
        //-2^31/ -1 = 2^31 溢出
        if(dividend == 0x80000000 && divisor == -1){
            return 0x7FFFFFFF;
        }

        int negative = 2;//用于记录正数个数
        //由于负数转为正数 -2^31 -> 2^31 越界，所以采用正数转为负数
        if(dividend > 0){
            negative --;
            dividend = -dividend;
        }

        if(divisor > 0){
            negative --;
            divisor = -divisor;
        }

        //计算两个负数相除
        int result = 0;
        while(dividend <= divisor){
            int value = divisor;//统计减数
            int quotient = 1;//统计商
            while(value > 0xc0000000 && value + value >= dividend){//value > 0xc0000000 防止value*2溢出
                quotient += quotient;//如果可以用乘法 quotient*=2
                value += value;//如果可以用乘法 value*=2
            }

            result += quotient;
            dividend -= value;
        }
        return negative == 1 ? -result : result;
    }
}
```

## <font color="green">2、二进制加法</font>

给定两个 01 字符串 `a` 和 `b` ，请计算它们的和，并以二进制字符串的形式输出。

输入为 **非空** 字符串且只包含数字 `1` 和 `0`。

```
示例 1:
输入: a = "11", b = "10"
输出: "101"

示例 2:
输入: a = "1010", b = "1011"
输出: "10101"

提示：
- 每个字符串仅由字符 `'0'` 或 `'1'` 组成。
- `1 <= a.length, b.length <= 10^4`
- 字符串如果不是 `"0"` ，就都不含前导零。
```

注意：本题与主站 67 题相同：https://leetcode-cn.com/problems/add-binary/

{% note success %}

### Java关于进制的API

其实Java中是提供了其他进制字符串转数值，或者数值转其他进制字符串的API的，以Integer为例子，本题也可以这样写：

```java
class Solution {
    public String addBinary(String a, String b) {
        int ai = Integer.parseInt(a, 2);
        int bi = Integer.parseInt(b, 2);
        int result = ai + bi;
        return Integer.toBinaryString(result);
    }
}
```

其中parseInt中的第二个参数就是进制，而toBinaryString方法就是将数值转化为二进制

{% endnote %}

{% notel green 题解思路 %}

但在本题中，这样做行不通，因为ab的长度最大是10000，1w位的二进制数，早早就超过了int甚至long的范围，所以我们只能老老实实的自己来实现。逻辑比较多，但是都很容易想到，着重注意进位的问题即可

{% endnotel %}

```java
class Solution {
    public String addBinary(String a, String b) {
        // 考虑进位需要预留一位
        int length = Math.max(a.length(), b.length()) + 1;
        char[] chars = new char[length];
        int ai = a.length() - 1;
        int bi = b.length() - 1;
        int ci = chars.length - 1;
        boolean carry = false;
        // 从尾至头遍历，直到一个数用完
        while (ai >= 0 && bi >= 0) {
            char ac = a.charAt(ai);
            char bc = b.charAt(bi);
            if (ac == bc) {
                if (carry) {
                    chars[ci--] = '1';
                } else {
                    chars[ci--] = '0';
                }
                carry = ac != '0';
            } else {
                if (carry) {
                    chars[ci--] = '0';
                } else {
                    chars[ci--] = '1';
                }
            }
            ai--;
            bi--;
        }
        if (ai < 0) {
            ai = bi;
            a = b;
        }
        // 处理剩下的数
        while (ai >= 0) {
            char ac = a.charAt(ai);
            if (ac == '0') {
                if (carry) {
                    chars[ci--] = '1';
                } else {
                    chars[ci--] = '0';
                }
                carry = false;
            } else {
                if (carry) {
                    chars[ci--] = '0';
                } else {
                    chars[ci--] = '1';
                }
            }
            ai--;
        }
        // 判断最后是否进位，如果不用进阶需要切割数组
        int offset;
        int count;
        if (carry) {
            chars[ci] = '1';
            offset = 0;
            count = length;
        } else {
            chars[ci] = '0';
            offset = 1;
            count = length - 1;
        }
        return String.valueOf(chars, offset, count);
    }
}
```

## <font color="green">3、比特位计数</font>

给定一个非负整数 `n` ，请计算 `0` 到 `n` 之间的每个数字的二进制表示中 1 的个数，并输出一个数组。

```
示例 1:
输入: n = 2
输出: [0,1,1]
解释: 
0 --> 0
1 --> 1
2 --> 10

示例 2:
输入: n = 5
输出: [0,1,1,2,1,2]
解释:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101

说明 :
0 <= n <= 105
```

**进阶:**

- 给出时间复杂度为 `O(n*sizeof(integer))` 的解答非常容易。但你可以在线性时间 `O(n)` 内用一趟扫描做到吗？
- 要求算法的空间复杂度为 `O(n)` 。
- 你能进一步完善解法吗？要求在C++或任何其他语言中不使用任何内置函数（如 C++ 中的 `__builtin_popcount` ）来执行此操作

注意：本题与主站 338 题相同：https://leetcode-cn.com/problems/counting-bits/

{% notel green 题解思路 %}

如果时间复杂度是O(n)，那么遍历每个数字的每一位就不符合要求了，只能跟据f(n-1)来推算f(n)，这样一来就成了动态规划，问题就变成了如何推算

之前提到过动态规划的难点在于如果找到推算公式，需要多刷题积累

{% endnotel %}

{% note success %}

### 数字比特位1数量的特点

奇数n比n-1多1

偶数n=n/2

{% endnote %}

```java
class Solution {
    public int[] countBits(int n) {
        int[] process = new int[n + 1];
        process[0] = 0;
        for (int i = 1; i <= n; i++) {
            if (i % 2 != 0) {
                process[i] = process[i - 1] + 1;
            } else {
                process[i] = process[i / 2];
            }
        }
        return process;
    }
}
```

## <font color="orange">4、只出现一次的数字Ⅱ</font>

给你一个整数数组 `nums` ，除某个元素仅出现 **一次** 外，其余每个元素都恰出现 **三次 。**请你找出并返回那个只出现了一次的元素。

```
示例 1：
输入：nums = [2,2,3,2]
输出：3

示例 2：
输入：nums = [0,1,0,1,0,1,100]
输出：100
```

**提示：**

- `1 <= nums.length <= 3 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `nums` 中，除某个元素仅出现 **一次** 外，其余每个元素都恰出现 **三次**

**进阶：**你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

注意：本题与主站 137 题相同：https://leetcode-cn.com/problems/single-number-ii/

{% notel orange 题解思路 %}

此题和Offer56-2一样。思路是用位运算接口3的特征

将元素的二进制每一位累加(每一位用十进制保存)，最终将每一位取余3，得到的二进制数即为目标数的二进制，再转化为十进制即可

{% endnotel %}

[剑指Offer_Part.3 - technology-inn](https://www.huangkebing.com/2023/06/25/algorithm/offer/剑指Offer_Part3/#56-2、数组中数字出现的次数Ⅱ)

## <font color="orange">5、最大单词长度乘积</font>

给定一个字符串数组 `words`，请计算当两个字符串 `words[i]` 和 `words[j]` 不包含相同字符时，它们长度的乘积的最大值。假设字符串中只包含英语的小写字母。如果没有不包含相同字符的一对字符串，返回 0。

```
示例 1:
输入: words = ["abcw","baz","foo","bar","fxyz","abcdef"]
输出: 16 
解释: 这两个单词为 "abcw", "fxyz"。它们不包含相同字符，且长度的乘积最大。

示例 2:
输入: words = ["a","ab","abc","d","cd","bcd","abcd"]
输出: 4 
解释: 这两个单词为 "ab", "cd"。

示例 3:
输入: words = ["a","aa","aaa","aaaa"]
输出: 0 
解释: 不存在这样的两个单词。
```

**提示：**

- `2 <= words.length <= 1000`
- `1 <= words[i].length <= 1000`
- `words[i]` 仅包含小写字母

注意：本题与主站 318 题相同：https://leetcode-cn.com/problems/maximum-product-of-word-lengths/

{% notel orange 题解思路 %}

这道题可以分成两部分：

- 获取最大长度
- 判断两个字符串是否包含相同字符

先来看获取最大长度，因为字符数组没有任何规律，因此两循环获得最大长度是没有优化空间的

那么问题就是如果判断两个字符串是否包含相同字符了，按照日常的业务思路，有这些思路：

- 双循环判断
- 使用set

但这两个方法，都存在重复遍历的问题，因为一个字符串肯定是要比较多次的，这里就可以用位运算的思路

如abc转化为111，def转化为111000，即a为第一位，b第二位，...

判断abc和def是否包含相同字符时，只需要将两个数执行&操作，如果结果为0就代表没有相同字符

这个方法解决了重复遍历的问题，而且程序执行位运算是非常快的，进一步优化了耗时

{% endnotel %}

```java
class Solution {
    public int maxProduct(String[] words) {
        int[] numbers = new int[words.length];
        int res = 0;
        for (int i = 0; i < words.length; i++) {
            int num = 0;
            String word = words[i];
            for (int j = 0; j < word.length(); j++) {
                num = num | (1 << word.charAt(j) - 'a');
            }
            numbers[i] = num;
        }
        for (int i = 0; i < numbers.length; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                if((numbers[i] & numbers[j]) == 0){
                    res = Math.max(res, words[i].length() * words[j].length());
                }
            }
        }
        return res;
    }
}
```

## <font color="green">6、两数之和Ⅱ-输入有序数组</font>

给定一个已按照 **升序排列** 的整数数组 `numbers` ，请你从数组中找出两个数满足相加之和等于目标数 `target` 。

函数应该以长度为 `2` 的整数数组的形式返回这两个数的下标值*。*`numbers` 的下标 **从 0 开始计数** ，所以答案数组应当满足 `0 <= answer[0] < answer[1] < numbers.length` 。

假设数组中存在且只存在一对符合条件的数字，同时一个数字不能使用两次。

```
示例 1：
输入：numbers = [1,2,4,6,10], target = 8
输出：[1,3]
解释：2 与 6 之和等于目标数 8 。因此 index1 = 1, index2 = 3 。

示例 2：
输入：numbers = [2,3,4], target = 6
输出：[0,2]

示例 3：
输入：numbers = [-1,0], target = -1
输出：[0,1]
```

**提示：**

- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `numbers` 按 **非递减顺序** 排列
- `-1000 <= target <= 1000`
- 仅存在一个有效答案

注意：本题与主站 167 题相似（下标起点不同）：https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/

{% notel green 题解思路 %}

本来想到用二分查找，可以算出需要的数值，然后去有序数组里查找，但是结果耗时1ms，击败30%多，有点不能接受

然后考虑双指针，发现不太对，不管指针怎么移动，和都在变大。这里要注意，**双指针的条件，必须是A指针移动结果变大，B指针移动结果变小(或者相反)**

这里双指针，可以从首尾开始，若和大于目标，尾指针前移，反之首指针后移

{% endnotel %}

```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int small = 0,big = numbers.length - 1;
        while(small < big){
            int add = numbers[small] + numbers[big];
            if(add > target){
                big--;
            } else if(add < target){
                small++;
            } else {
                return new int[]{small, big};
            }
        }
        return new int[0];
    }
}
```

## <font color="orange">7、三数之和</font>

给定一个包含 `n` 个整数的数组 `nums`，判断 `nums` 中是否存在三个元素 `a` ，`b` ，`c` *，*使得 `a + b + c = 0` ？请找出所有和为 `0` 且 **不重复** 的三元组。

```
示例 1：
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]

示例 2：
输入：nums = []
输出：[]

示例 3：
输入：nums = [0]
输出：[]

提示：
- `0 <= nums.length <= 3000`
- `-10^5 <= nums[i] <= 10^5`
```

注意：本题与主站 15 题相同：https://leetcode-cn.com/problems/3sum/

{% notel orange 题解思路 %}

如果3个数都需要遍历，那就只能三循环，即O(n^3)，肯定是行不通的

因此，我们先将数组排序，再固定一位遍历，那么剩下两位就转化为了两数之和且数组有序，没错就是上面那题

但这里要注意的是需要去重

{% endnotel %}

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> list = new ArrayList<>();
        if (nums.length < 3) {
            return list;
        }
        Arrays.sort(nums);
        for (int i = 0; i < nums.length - 2; i++) {
            int fix = nums[i];
            int b = i + 1;
            int c = nums.length - 1;
            while (b < c) {
                int sum = fix + nums[b] + nums[c];
                if (sum < 0) {
                    b++;
                } else if (sum > 0) {
                    c--;
                } else {
                    ArrayList<Integer> list1 = new ArrayList<>();
                    list1.add(fix);
                    list1.add(nums[b]);
                    list1.add(nums[c]);
                    list.add(list1);
                    //较难理解
                    while (b<nums.length - 1 && nums[b] == nums[++b] && nums[c] == nums[--c]) {
                    }
                }
            }
            while (i < nums.length - 2 && nums[i] == nums[i + 1]) {
                i += 1;
            }
        }
        return list;
    }
}
```

## <font color="orange">8、长度最小的子数组</font>

给定一个含有 `n` 个正整数的数组和一个正整数 `target` 。

找出该数组中满足其和 `≥ target` 的长度最小的 **连续子数组** `[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度**。**如果不存在符合条件的子数组，返回 `0` 。

```
示例 1：
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。

示例 2：
输入：target = 4, nums = [1,4,4]
输出：1

示例 3：
输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
```

提示：

- 1 <= target <= 10^9
- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^5

进阶：

- 如果你已经实现 `O(n)` 时间复杂度的解法, 请尝试设计一个 `O(n log(n))` 时间复杂度的解法。

注意：本题与主站 209 题相同：https://leetcode-cn.com/problems/minimum-size-subarray-sum/

{% notel orange 题解思路 %}

基本就是双指针的变式，就是坑有点多，和简单的滑动窗口不同，此题如果不做限制，小指针可能会超过大指针，而且有各种数组越界的意外情况。

{% endnotel %}

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        if (nums.length == 1) {
            return nums[0] == target ? 1 : 0;
        }
			// 可能第一个值就比目标值大
        int small = 0,big = 0;
        int result = Integer.MAX_VALUE;
        int add = nums[0];
        while(big < nums.length - 1){
            if(add >= target){
                result = Math.min(result, big - small + 1);
                // 小大指针重合，避免小指针大于大指针，需要从下一个元素开始遍历
                if(small == big){
                    big++;
                    small++;
                    add = nums[small];
                } else {
                    add -= nums[small++];
                }
            } else {
                add += nums[++big];
            }
        }
        // 避免越界报错，当大指针到最后一个时，依次缩小滑动窗口的大小，直到和小于目标值或者小指针也到最后一个元素
        while(add >= target && small <= nums.length - 1){
            result = Math.min(result, big - small + 1);
            add -= nums[small++];
        }

        return result == Integer.MAX_VALUE ? 0 : result;
    }
}
```

## <font color="orange">9、乘积小于K的子数组</font>

给定一个正整数数组 `nums`和整数 `k` ，请找出该数组内乘积小于 `k` 的连续的子数组的个数。

```
示例 1:
输入: nums = [10,5,2,6], k = 100
输出: 8
解释: 8 个乘积小于 100 的子数组分别为: [10], [5], [2], [6], [10,5], [5,2], [2,6], [5,2,6]。
需要注意的是 [10,5,2] 并不是乘积小于100的子数组。

示例 2：
输入: nums = [1,2,3], k = 0
输出: 0
```

**提示:**

- 1 <= nums.length <= 3 * 10^4
- 1 <= nums[i] <= 1000
- 0 <= k <= 10^6^

注意：本题与主站 713 题相同：https://leetcode-cn.com/problems/subarray-product-less-than-k/

{% notel orange 题解思路 %}

这类题肯定是双指针做，但这里最大的问题是重复，没有太好的思路。

看了别人的解法，算是归纳出了一个公式？。。

{% endnotel %}

```java
class Solution {
    public int numSubarrayProductLessThanK(int[] nums, int k) {
        if(k==0 ||k==1) return 0;
        int left = 0;
        int ret = 0;
        int total = 1;
        for (int right = 0; right < nums.length; right++) {
            total *= nums[right];
            while (left <= right && total >= k) {
                total /= nums[left++];
            }
            if (left <= right) {
                ret += right - left + 1;
            }
        }
        return ret;
    }
}
```

## <font color="orange">10、和为K的子数组</font>

给定一个整数数组和一个整数 `k` **，**请找到该数组中和为 `k` 的连续子数组的个数。

```
示例 1：
输入:nums = [1,1,1], k = 2
输出: 2
解释: 此题 [1,1] 与 [1,1] 为两种不同的情况

示例 2：
输入:nums = [1,2,3], k = 3
输出: 2
```

**提示:**

- 1 <= nums.length <= 2 * 10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7

注意：本题与主站 560 题相同： https://leetcode-cn.com/problems/subarray-sum-equals-k/

{% note success %}

### 滑动窗口适用场景

如求和为k的数组，如果要使用滑动窗口，那么必须满足这个条件：

当大指针移动后，和必须永远变大/变小，小指针移动后，和必须永远变小/变大

{% endnote %}

{% note success %}

### 前缀和

设数组nums=[1，5，2，-3]

那么数组的前缀和S=[1，6，8，5]，即S[0] = nums[0]，S[1] = nums[0] + nums[1]，...

求前缀和很简单，那这玩意有什么用？怎么用？

如果我们要求num[2] + nums[3]，那么就是S[3] - S[1]

假设需要找和为4的子数组，就可以跟据前缀和来找：

1. 第一位1，S=1，找之前的前缀和中有没有等于-3的，没有。<font color="#1e9fff">为什么是-3？S1(为1) - S2 = 4，所以S2 = -3</font>
2. 第二位5，S=6，找之前的前缀和中有没有等于2的，没有
3. 第三位2，S=8，找之前的前缀和中有没有等于4的，没有
4. 第四位-3，S=5，找之前的前缀和中有没有等于1的，有

{% endnote %}

{% notel orange 题解思路 %}

连续6道类似的题了，第一想法就是双指针形成滑动窗口，但后来发现不行！

而在这里，因为数组是无序的，自然没办法满足滑动窗口的适用场景

这里引入一个之前没接触过的思路，前缀和

有了前缀和后，本题就基于前缀和来做，不过因为需要获得所有的子数组数，还需要记录每个前缀和出现的次数

{% endnotel %}

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer,Integer> map = new HashMap<>();
        // 存入0，即从头到该节点这种情况
        map.put(0, 1);
        int sum = 0;
        int count = 0;
        for (int num : nums) {
            // 求前缀和
            sum += num;
            count += map.getOrDefault(sum - k, 0);
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}
```

## <font color="orange">11、连续数组</font>

给定一个二进制数组 `nums` , 找到含有相同数量的 `0` 和 `1` 的最长连续子数组，并返回该子数组的长度。

```
示例 1：
输入: nums = [0,1]
输出: 2
说明: [0, 1] 是具有相同数量 0 和 1 的最长连续子数组。

示例 2：
输入: nums = [0,1,0]
输出: 2
说明: [0, 1] (或 [1, 0]) 是具有相同数量 0 和 1 的最长连续子数组。
```

**提示：**

- 1 <= nums.length <= 10^5
- `nums[i]` 不是 `0` 就是 `1`

注意：本题与主站 525 题相同： https://leetcode-cn.com/problems/contiguous-array/

{% notel orange 题解思路 %}

不满足滑动窗口的条件

将0赋为-1，问题就转化成了最长连续子数组且和为0，利用前缀和求解

{% endnotel %}

```java
class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        // key为前缀和，value为下标
        map.put(0, -1);
        int sum = 0;
        int max = 0;
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            if(num == 0){
                num = -1;
            }
            sum += num;
            if(map.containsKey(sum)){
                max = Math.max(max, i - map.get(sum));
            } else {
                map.put(sum, i);
            }
        }
        return max;
    }
}
```

## <font color="green">12、寻找数组的中心下标</font>

给你一个整数数组 `nums` ，请计算数组的 **中心下标** 。

数组 **中心下标** 是数组的一个下标，其左侧所有元素相加的和等于右侧所有元素相加的和。

如果中心下标位于数组最左端，那么左侧数之和视为 `0` ，因为在下标的左侧不存在元素。这一点对于中心下标位于数组最右端同样适用。

如果数组有多个中心下标，应该返回 **最靠近左边** 的那一个。如果数组不存在中心下标，返回 `-1` 。

```
示例 1：
输入：nums = [1,7,3,6,5,6]
输出：3
解释：
中心下标是 3 。
左侧数之和 sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11 ，
右侧数之和 sum = nums[4] + nums[5] = 5 + 6 = 11 ，二者相等。

示例 2：
输入：nums = [1, 2, 3]
输出：-1
解释：
数组中不存在满足此条件的中心下标。

示例 3：
输入：nums = [2, 1, -1]
输出：0
解释：
中心下标是 0 。
左侧数之和 sum = 0 ，（下标 0 左侧不存在元素），
右侧数之和 sum = nums[1] + nums[2] = 1 + -1 = 0 。
```

**提示：**

- 1 <= nums.length <= 10^4
- -1000 <= nums[i] <= 1000

注意：本题与主站 724 题相同： https://leetcode-cn.com/problems/find-pivot-index/

{% notel green 题解思路 %}

使用前缀和来解，但有两种特殊情况：

- 第一位就是中心数，此时最后一位的前缀和-第一位前缀和=0
- 最后一位是中心数，此时倒数第二位的前缀和 = 0

排除特殊情况后，第i位前缀和 + 第i+1位前缀和=最后一位前缀和时，第i+1位就是中心数

另外题目要求最左边的中心数，也就是先判断特殊情况1，再正常遍历，最后判断特殊情况2

{% endnotel %}

```java
class Solution {
    public int pivotIndex(int[] nums) {
        int[] sum = new int[nums.length];
        sum[0] = nums[0];
        // 计算前缀和
        for (int i = 1; i < nums.length; i++) {
            sum[i] = sum[i - 1] + nums[i];
        }
        // 先检查第一个元素是否就是中心数
        int rightSum = sum[sum.length - 1];
        if (rightSum - sum[0] == 0) {
            return 0;
        }
        // 依次检查每个前缀和
        for (int j = 0; j < sum.length - 1; j++) {
            if (sum[j] + sum[j + 1] == rightSum) {
                return j + 1;
            }
        }
        // 检查最后一个数是否是中心数
        if (sum[sum.length - 2] == 0) {
            return sum.length - 1;
        } else {
            return -1;
        }
    }
}
```

## <font color="orange">13、二维区域和检索-矩阵不可变</font>

给定一个二维矩阵 `matrix`，以下类型的多个请求：

- 计算其子矩形范围内元素的总和，该子矩阵的左上角为 `(row1, col1)` ，右下角为 `(row2, col2)` 。

实现 `NumMatrix` 类：

- `NumMatrix(int[][] matrix)` 给定整数矩阵 `matrix` 进行初始化
- `int sumRegion(int row1, int col1, int row2, int col2)` 返回左上角 `(row1, col1)` 、右下角 `(row2, col2)` 的子矩阵的元素总和。

<img src="../../../images/algorithm/leetcode/LCR13.png" alt="img" style="zoom:50%;" />

```
示例 1：
输入: 
["NumMatrix","sumRegion","sumRegion","sumRegion"]
[[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]],[2,1,4,3],[1,1,2,2],[1,2,2,4]]
输出: 
[null, 8, 11, 12]
解释:
NumMatrix numMatrix = new NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]]);
numMatrix.sumRegion(2, 1, 4, 3); // return 8 (红色矩形框的元素总和)
numMatrix.sumRegion(1, 1, 2, 2); // return 11 (绿色矩形框的元素总和)
numMatrix.sumRegion(1, 2, 2, 4); // return 12 (蓝色矩形框的元素总和)
```

**提示：**

- m == matrix.length
- n == matrix[i].length
- 1 <= m, n <= 200
- -10^5 <= matrix[i] [j] <= 10^5
- 0 <= row1 <= row2 < m
- 0 <= col1 <= col2 < n
- 最多调用 10^4 次 `sumRegion` 方法

注意：本题与主站 304 题相同： https://leetcode-cn.com/problems/range-sum-query-2d-immutable/

{% notel orange 题解思路 %}

二维数组版的前缀和

前缀和计算公式：S(2,3) = N(2,3) + S(1,3) + S(2,2) - S(1,2)

前缀和使用公式，如计算(1,1)、(2,3)之间的和，SUM = S(2,3) - S(1,3) - S(2,2) + S(1,2)

另外前缀和使用时，注意边界点时，越界的情况即可

{% endnotel %}

```java
class NumMatrix {

    int[][] prefixSum;

    public NumMatrix(int[][] matrix) {
        int row = matrix.length;
        int col = matrix[0].length;
        prefixSum = new int[row][col];
        prefixSum[0][0] = matrix[0][0];
        for (int i = 1; i < row; i++) {
            prefixSum[i][0] = matrix[i][0] + prefixSum[i - 1][0];
        }
        for (int i = 1; i < col; i++) {
            prefixSum[0][i] = matrix[0][i] + prefixSum[0][i - 1];
        }
        for (int i = 1; i < row; i++) {
            for (int j = 1; j < col; j++) {
                prefixSum[i][j] = matrix[i][j] + prefixSum[i - 1][j] + prefixSum[i][j - 1] - prefixSum[i - 1][j - 1];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        if (row1 == 0 && col1 == 0) {
            return prefixSum[row2][col2];
        } else if (row1 == 0) {
            return prefixSum[row2][col2] - prefixSum[row2][col1 - 1];
        } else if (col1 == 0) {
            return prefixSum[row2][col2] - prefixSum[row1 - 1][col2];
        } else {
            return prefixSum[row2][col2] - prefixSum[row1 - 1][col2] - prefixSum[row2][col1 - 1] + prefixSum[row1 - 1][col1 - 1];
        }
    }
}
```

## <font color="orange">14、字符串的排列</font>

给定两个字符串 `s1` 和 `s2`，写一个函数来判断 `s2` 是否包含 `s1` 的某个变位词。

换句话说，第一个字符串的排列之一是第二个字符串的 **子串** 。

```
示例 1：
输入: s1 = "ab" s2 = "eidbaooo"
输出: True
解释: s2 包含 s1 的排列之一 ("ba").

示例 2：
输入: s1= "ab" s2 = "eidboaoo"
输出: False
```

**提示：**

- 1 <= s1.length, s2.length <= 10^4
- `s1` 和 `s2` 仅包含小写字母

注意：本题与主站 567 题相同： https://leetcode-cn.com/problems/permutation-in-string/

{% notel orange 题解思路 %}

做一个长度为s1的滑动窗口，统计两个字符串的每个字符出现的次数，当出现两个数组完全一致时，即出现变位词

{% endnotel %}

```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();
        if(m > n)
            return false;
        int[] cnt1 = new int[26];
        int[] cnt2 = new int[26];
        for(int i = 0; i < m; i ++)
        {
            cnt1[s1.charAt(i) - 'a'] ++;
            cnt2[s2.charAt(i) - 'a'] ++;
        }
        if(Arrays.equals(cnt1, cnt2))
            return true;
        for(int i = m; i < n; i ++)
        {
            cnt2[s2.charAt(i - m) - 'a'] --;
            cnt2[s2.charAt(i) - 'a'] ++;
            if(Arrays.equals(cnt1, cnt2))
                return true;
        }
        return false;
    }
}
```

## <font color="orange">15、找到字符串中所有的异位词</font>

给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 **变位词** 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

**变位词** 指字母相同，但排列不同的字符串。

```
示例 1：
输入: s = "cbaebabacd", p = "abc"
输出: [0,6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的变位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的变位词。

示例 2：
输入: s = "abab", p = "ab"
输出: [0,1,2]
解释:
起始索引等于 0 的子串是 "ab", 它是 "ab" 的变位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的变位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的变位词。
```

**提示:**

- 1 <= s.length, p.length <= 3 * 10^4
- `s` 和 `p` 仅包含小写字母

注意：本题与主站 438 题相同： https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/

{% notel orange 题解思路 %}

和上题类似，判断变位词的方式可以直接沿用，区别是需要执行完循环，并返回变位词的开始下标

{% endnotel %}

```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        int small = p.length();
        int big = s.length();
        List<Integer> list = new ArrayList<>();
        if (small > big) {
            return list;
        }
        int[] cnt1 = new int[26];
        int[] cnt2 = new int[26];
        for (int i = 0; i < small; i++) {
            cnt1[s.charAt(i) - 'a']++;
            cnt2[p.charAt(i) - 'a']++;
        }
        if(Arrays.equals(cnt1, cnt2)){
            list.add(0);
        }
        for(int i = small; i < big; i ++)
        {
            cnt1[s.charAt(i - small) - 'a'] --;
            cnt1[s.charAt(i) - 'a'] ++;
            if(Arrays.equals(cnt1, cnt2)){
                list.add(i - small + 1);
            }
        }
        return list;
    }
}
```

## <font color="orange">16、无重复字符的最长字串</font>

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长连续子字符串** 的长度。

```
示例 1:
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子字符串是 "abc"，所以其长度为 3。

示例 2:
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子字符串是 "b"，所以其长度为 1。

示例 3:
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
     
示例 4:
输入: s = ""
输出: 0
```

**提示：**

- 0 <= s.length <= 5 * 10^4
- `s` 由英文字母、数字、符号和空格组成

注意：本题与主站 3 题相同： https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/

{% notel orange 题解思路 %}

记录每个元素出现的下标，如果出现重复则记录后者

起点指针记录离当前指针最近的重复元素：如dacbdefg，那么当遍历到第二个d时，起点指针指向第一个d

那么长度就是当前指针-起点指针，最终取最大值返回

{% endnotel %}

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        //把当前 字符与其下标存入map
        Map<Character,Integer> map = new HashMap<>();
        // 定义一个指针 每次都指向与遍历右指针最近的那个重复元素
        int choose_right = -1;
        int res = 0;

        for(int right = 0; right < s.length(); right++){
            char c = s.charAt(right);
            if(map.containsKey(c)){
                //如果存在重复元素 获取该元素下标 获取与right距离最近的重复元素
                choose_right = Math.max(choose_right,map.get(c));
            }
            //把重复元素存进当前位置
            map.put(c,right);
            //当前重复元素位置减掉最近的重复元素位置 得到该段距离长度
            res = Math.max(res,right - choose_right);
        }
        return res;
    }
}
```

## <font color="red">17、最小覆盖子串</font>

给定两个字符串 `s` 和 `t` 。返回 `s` 中包含 `t` 的所有字符的最短子字符串。如果 `s` 中不存在符合条件的子字符串，则返回空字符串 `""` 。

如果 `s` 中存在多个符合条件的子字符串，返回任意一个。

**注意：** 对于 `t` 中重复字符，我们寻找的子字符串中该字符数量必须不少于 `t` 中该字符数量。

```
示例 1：
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC" 
解释：最短子字符串 "BANC" 包含了字符串 t 的所有字符 'A'、'B'、'C'

示例 2：
输入：s = "a", t = "a"
输出："a"

示例 3：
输入：s = "a", t = "aa"
输出：""
解释：t 中两个字符 'a' 均应包含在 s 的子串中，因此没有符合条件的子字符串，返回空字符串。
```

**提示：**

- 1 <= s.length, t.length <= 10^5
- `s` 和 `t` 由英文字母组成

**进阶：**你能设计一个在 `o(n)` 时间内解决此问题的算法吗？

注意：本题与主站 76 题相似（本题答案不唯一）：https://leetcode-cn.com/problems/minimum-window-substring/

{% notel red 题解思路 %}

尝试使用滑动窗口解决，即当前窗口内的目标元素数量小于目标字符串则扩大窗口，反之则缩小窗口，并记录最短的子串

元素数量使用map来记录

实现之后发现效率不高，只击败了13%的用户，看到有人写出了仅1ms的答案，看了一下暂时没理解，等后续再遇到这道题再看吧

{% endnotel %}

```java
class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> tMap = new HashMap<>();
        for (int i = 0; i < t.length(); i++) {
            char tc = t.charAt(i);
            Integer count = tMap.getOrDefault(tc, 0);
            tMap.put(tc, ++count);
        }
        int small = 0,big = 0;
        int minLength = Integer.MAX_VALUE;
        String result = "";
        Map<Character, Integer> sMap = new HashMap<>();
        sMap.put(s.charAt(big), 1);
        while(big < s.length()){
            if(check(tMap, sMap)){
                int newLength = big - small + 1;
                if(newLength < minLength){
                    if(big == small){
                        return s.substring(small, big + 1);
                    } else {
                        minLength = newLength;
                        result = s.substring(small, big + 1);
                    }
                }
                Integer integer = sMap.get(s.charAt(small));
                sMap.put(s.charAt(small), --integer);
                small++;
            } else {
                big++;
                if(big == s.length()){
                    continue;
                }
                char sc = s.charAt(big);
                Integer integer = sMap.getOrDefault(sc, 0);
                sMap.put(sc, ++integer);
            }
        }
        return result;
    }

    private boolean check(Map<Character, Integer> tMap, Map<Character, Integer> sMap){
        for (Map.Entry<Character, Integer> entry : tMap.entrySet()) {
            Integer sCount = sMap.getOrDefault(entry.getKey(), 0);
            if(sCount < entry.getValue()){
                return false;
            }
        }
        return true;
    }
}
```

## <font color="green">18、验证回文串</font>

给定一个字符串 `s` ，验证 `s` 是否是 **回文串** ，只考虑字母和数字字符，可以忽略字母的大小写。

本题中，将空字符串定义为有效的 **回文串** 。

```
示例 1:
输入: s = "A man, a plan, a canal: Panama"
输出: true
解释："amanaplanacanalpanama" 是回文串

示例 2:
输入: s = "race a car"
输出: false
解释："raceacar" 不是回文串
```

**提示：**

- 1 <= s.length <= 2 * 10^5
- 字符串 `s` 由 ASCII 字符组成

注意：本题与主站 125 题相同： https://leetcode-cn.com/problems/valid-palindrome/

{% notel green 题解思路 %}

回文串的判断很简单，两个指针分别从首尾相向遍历，如果出现不一样的就可以认定不是回文串

但这里还在此基础上增加了两点

1. 需要排除掉除数字大小写字母之外的字符，这个跟据ASCII码来判断
2. 需要忽略大小写，根据ASCII码值的差是否等于32，但是这里有特例如0P，其差值也是32，需要排除数字的情况

{% endnotel %}

```java
class Solution {
    public boolean isPalindrome(String s) {
        // 空字符串默认回文串
        if ("".equals(s)) {
            return true;
        }
        // 指针分别指向首尾
        int small = 0, big = s.length() - 1;
        while (small < big) {
            char cSmall = s.charAt(small);
            char cBig = s.charAt(big);
            // 先判断元素是否需要跳过，只有字母和数字保留
            if (isIgnoreChar(cSmall)) {
                small++;
                continue;
            }
            if (isIgnoreChar(cBig)) {
                big--;
                continue;
            }
            // 检查是否符合回文要求
            if (checkEquals(cSmall, cBig)) {
                small++;
                big--;
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * 只有数字大小写字母保留
     */
    private boolean isIgnoreChar(char c) {
        if (c >= '0' && c <= '9') {
            return false;
        } else if (c >= 'a' && c <= 'z') {
            return false;
        } else if (c >= 'A' && c <= 'Z') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 如果相等直接返回
     * 如果不相等且其中有一个数字，则必定不相等
     * 如果均为字母且ascii码相差32则会同个字母的大小写，返回相等
     */
    private boolean checkEquals(char c1, char c2) {
        if (c1 == c2) {
            return true;
        }
        if ((c1 >= '0' && c1 <= '9') || (c2 >= '0' && c2 <= '9')) {
            return false;
        }
        return Math.abs(c1 - c2) == 32;
    }
}
```

## <font color="green">19、验证回文串Ⅱ</font>

给定一个非空字符串 `s`，请判断如果 **最多** 从字符串中删除一个字符能否得到一个回文字符串。

```
示例 1:
输入: s = "aba"
输出: true

示例 2:
输入: s = "abca"
输出: true
解释: 可以删除 "c" 字符 或者 "b" 字符

示例 3:
输入: s = "abc"
输出: false
```

**提示:**

- 1 <= s.length <= 10^5
- `s` 由小写英文字母组成

注意：本题与主站 680 题相同： https://leetcode-cn.com/problems/valid-palindrome-ii/

{% notel green 题解思路 %}

最直接的想法，当遇到不一样的元素时，小指针往后，如果还不一样，就大指针往前。但还是发生了最怕的问题：

就是两个指针移动都暂时满足回文，取了一种处理后，发现不是回文了！但其实另一种处理是回文

于是想到了类似递归的手法：先遍历直到出现不一致元素，然后再利用方法的局部变量分别检查小指针后移、大指针前移两种是否是回文串。这样子处理可以避免回滚指针的问题

{% endnotel %}

```java
class Solution {
    public boolean validPalindrome(String s) {
        int small = 0,big = s.length() - 1;
        while(small < big){
            char cSmall = s.charAt(small);
            char cBig = s.charAt(big);
            if(cSmall == cBig){
                --big;
                ++small;
            } else {
                return check(s, small + 1, big) || check(s, small, big - 1);
            }
        }
        return true;
    }

    private boolean check(String s, int small ,int big){
        while(small < big){
            char cSmall = s.charAt(small);
            char cBig = s.charAt(big);
            if(cSmall != cBig) {
                return false;
            } else {
                --big;
                ++small;
            }
        }
        return true;
    }
}
```

## <font color="orange">20、回文子串</font>

给定一个字符串 `s` ，请计算这个字符串中有多少个回文子字符串。

具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

```
示例 1：
输入：s = "abc"
输出：3
解释：三个回文子串: "a", "b", "c"

示例 2：
输入：s = "aaa"
输出：6
解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
```

**提示：**

- `1 <= s.length <= 1000`
- `s` 由小写英文字母组成

注意：本题与主站 70 题相同：https://leetcode-cn.com/problems/palindromic-substrings/

{% notel orange 题解思路 %}

第一感觉是没有思路，这个反应问题很大，代表我们刷的题型还不够，或者还没有融汇贯通

然后看到相关词条里有动态规划，立刻想到了一种方法：

- 每加入一个元素，就从该元素开始往前遍历所有元素，找到加入该元素后新出现的回文子串
- 但这个方案，时间复杂度很不理想，为O(n^3^)

看别人的思路，了解到一种中心遍历法，依次遍历每个元素并以该元素为回文中心，往两边遍历，需要注意奇回文串和偶回文串的情况，时间复杂度为O(n^2^)

但今天状态很差，实在不想去深入理解了，先记在这，后续遇到类似题了再自己来实现

{% endnotel %}

```java
class Solution {
    public int countSubstrings(String s) {
        int n = s.length(), ans = 0;
        for (int i = 0; i < 2 * n - 1; ++i) {
            int l = i / 2, r = i / 2 + i % 2;
            while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
                --l;
                ++r;
                ++ans;
            }
        }
        return ans;
    }
}
```