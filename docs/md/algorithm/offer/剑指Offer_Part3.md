---
title: 剑指Offer_Part.3
date: 2023-06-25
categories: [算法, 剑指offer]
excerpt: 剑指offer系列算法题，第三部分——41至60题
---

## <font color="red">41、数据流中的中位数</font>

如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。

例如，[2,3,4] 的中位数是 3，[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

```
示例 1：
输入：
["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
输出：[null,null,null,1.50000,null,2.00000]

示例 2：
输入：
["MedianFinder","addNum","findMedian","addNum","findMedian"]
[[],[2],[],[3],[]]
输出：[null,null,2.00000,null,2.50000]

限制：
最多会对 `addNum、findMedian` 进行 `50000` 次调用。
```

注意：本题与主站 295 题相同：https://leetcode-cn.com/problems/find-median-from-data-stream/

{% notel red 题解思路 %}

核心有两个点：

1. 怎么维持有序
2. 支持快速定位到中位数

最先想到的解法：二分查找+数组

但这里有个问题——数组选型，如果选用ArrayList那么每次插入大概率会引起数组位移，如果用LinkedList那么二分查找的性能会下降(因为无法随机访问)

于是借鉴了别人的思路，用大顶堆+小顶堆

这个思路需要保证两点

- 保证两个堆的堆大小不超过1
- 保证小顶堆中的元素都大于大顶堆

{% endnotel %}

```java
class MedianFinder {
    // 大顶堆存储较小一半的值
    PriorityQueue<Integer> maxHeap;
    // 小顶堆存储较大一般的值
    PriorityQueue<Integer> minHeap;
    /** initialize your data structure here. */
    public MedianFinder() {
        maxHeap = new PriorityQueue<>((x, y) -> (y - x));
        minHeap = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        // 跟据奇偶数不同，入不同的堆，保证堆大小差不超过1
        if(maxHeap.size() != minHeap.size()){
            // 保证小顶堆中的元素均大于大顶堆
            maxHeap.add(num);
            minHeap.add(maxHeap.poll());
        } else {
            minHeap.add(num);
            maxHeap.add(minHeap.poll());
        }
    }
    
    public double findMedian() {
        if(maxHeap.size() != minHeap.size()){
            return maxHeap.peek();
        } else {
            return (maxHeap.peek() + minHeap.peek()) / 2.0;
        }
    }
}
```

## <font color="green">42、连续子数组的最大和</font>

输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为O(n)

```
示例1:
输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

提示：
- 1 <= arr.length <= 10^5
- -100 <= arr[i] <= 100
```

注意：本题与主站 53 题相同：https://leetcode-cn.com/problems/maximum-subarray/

{% notel green 题解思路 %}

动态规划，利用最大和的特性：负数+最大和<最大和

也就是说遍历到某个元素时，和已经为负数了，那么就抛弃前面的和，从该元素重新开始计算和，并记录历史最大值

{% endnotel %}

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0];
        // 这里不需要保存每一个和，只需要保存当前和即可
        int currSum = nums[0];
        // 从第2个元素开始
        for (int i = 1; i < nums.length; i++) {
            // 如果之前的和已经小于0，抛弃前面的累赘重新开始
            if (currSum < 0) {
                currSum = nums[i];
            } else {
                currSum += nums[i];
            }
            // 记录历史最大值
            if (currSum > max) {
                max = currSum;
            }
        }
        return max;
    }
}
```

## <font color="red">43、1~n 整数中1出现的次数</font>

输入一个整数 `n` ，求1～n这n个整数的十进制表示中1出现的次数。

例如，输入12，1～12这些整数中包含1 的数字有1、10、11和12，1一共出现了5次。

```
示例 1：
输入：n = 12
输出：5

示例 2：
输入：n = 13
输出：6

限制：
1 <= n < 2^31
```

注意：本题与主站 233 题相同：https://leetcode-cn.com/problems/number-of-digit-one/

{% notel red 题解思路 %}

本来思路是逐个逐位遍历，但超时了，也没有啥其他办法

看了别人的题解，属于是这道题的一种专属解法：

[剑指 Offer 43. 1～n 整数中 1 出现的次数 - 力扣（Leetcode）](https://leetcode.cn/problems/1nzheng-shu-zhong-1chu-xian-de-ci-shu-lcof/solutions/757536/dong-hua-mo-ni-wo-tai-xi-huan-zhe-ge-ti-vxzwc/)

算法题其实最怕遇到的就是这类题，因为刷题可以练的是通用解法和题感，但这种题还需要活跃的思维

{% endnotel %}

```java
class Solution {
    public int countDigitOne(int n) {
        //高位
        int high = n;
        //低位
        int low = 0;
        //当前位
        int cur = 0;
        int count = 0;
        int num = 1;
        while (high != 0 || cur != 0) {
            cur = high % 10;
            high /= 10;
            //这里我们可以提出 high * num 因为我们发现无论为几，都含有它
            if (cur == 0) count += high * num;
            else if (cur == 1) count += high * num + 1 + low;
            else count += (high + 1) * num;
            //低位
            low = cur * num + low;
            num *= 10;
        }
        return count;
    }
}
```

## <font color="orange">44、数字序列中某一位的数字</font>

数字以0123456789101112131415…的格式序列化到一个字符序列中。在这个序列中，第5位（从下标0开始计数）是5，第13位是1，第19位是4，等等。

请写一个函数，求任意第n位对应的数字。

```
示例 1：
输入：n = 3
输出：3

示例 2：
输入：n = 11
输出：0

限制：
0 <= n < 2^31
```

注意：本题与主站 400 题相同：https://leetcode-cn.com/problems/nth-digit/

{% notel orange 题解思路 %}

又是找规律的题，暴力解法肯定不用想，必超时(哪怕不超时，也尽量不要用，因为没意义，总不能面试的时候你写个暴力解法，那肯定就挂了)

思路是按位数来，0-9、10-99、100-999每一段有多少位都是可以通过计算得到的，然后再跟据给定n和位数的商和余数定位

{% endnotel %}

```java
class Solution {
    public int findNthDigit(int n) {
        if (n < 10) {
            return n;
        }
        long length = 10;
        int bit = 2;
        // 找到小于n且最接近n的一档
        while (length + (long) (9 * Math.pow(10, bit - 1) * bit) < n) {
            length += (long) (9 * Math.pow(10, bit - 1) * bit);
            bit++;
        }
        // 计算出解所在的数字和该数字的第几位
        long num = (long) Math.pow(10, bit - 1) + (n - length) / bit;
        return String.valueOf(num).charAt((int)(n - length) % bit) - (int) ('0');
    }
}
```

## <font color="orange">45、把数组排成最小的数</font>

输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

```
示例 1:
输入: [10,2]
输出: "102"

示例 2:
输入: [3,30,34,5,9]
输出: "3033459"

提示:
 0 < nums.length <= 100
```

**说明:**

- 输出结果可能非常大，所以你需要返回一个字符串而不是整数
- 拼接起来的数字可能会有前导 0，最后结果不需要去掉前导 0

{% notel orange 题解思路 %}

这题有点像数学的应用题，需要先跟据题目找到用什么方法来解

这里其实就是排序的变式，只不过排序的方式变了：

- 两个字符串 xy > yx , 那么 x > y

{% endnotel %}

```java
class Solution {
    public String minNumber(int[] nums) {
        String[] array = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            array[i] = String.valueOf(nums[i]);
        }
        // 这里直接用Java提供的排序了，因为日常开发中不会自己来实现排序
        Arrays.sort(array, (s1,s2) -> (s1+s2).compareTo(s2+s1));
        StringBuilder builder = new StringBuilder();
        for (String s : array) {
            builder.append(s);
        }
        return builder.toString();
    }
}
```

## <font color="orange">46、把数字翻译成字符串</font>

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

```
示例 1:
输入: 12258
输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"

提示：
0 <= num < 2^31
```

{% notel orange 题解思路 %}

就是数字在[10,25]之间的两个数可以合并

然后最后的找到的规律:

- 第n位和第n-1位能合并：f(n) = f(n-1) + f(n-2)
- 第n位和第n-1位不能合并：f(n) = f(n-1)

{% endnotel %}

```java
class Solution {
    public int translateNum(int num) {
        String s = String.valueOf(num);
        int f1 = 1, f2 = 1;
        for (int i = 2; i <= s.length(); i++) {
            String str = s.substring(i - 2, i);
            int count = str.compareTo("10") >= 0 && str.compareTo("25") <= 0 ? f1 + f2 : f2;
            f1 = f2;
            f2 = count;
        }
        return f2;
    }
}
```

## <font color="orange">47、礼物的最大价值</font>

在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

```
示例 1:
输入: 
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
输出: 12
解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物

提示：
- `0 < grid.length <= 200`
- `0 < grid[0].length <= 200`
```

{% notel orange 题解思路 %}

很典型的动态规划，当前位置的最大价值取决于上或左位置的最大价值

因此，创建一个二维数组，当前位置的最大价值 = Max(上位置的最大价值，左位置的最大价值) + 当前位置价值

将数组填满后，取右下角的值即为题解

{% endnotel %}

```java
class Solution {
    public int maxValue(int[][] grid) {
        int row = grid.length;
        int column = grid[0].length;
        // 创建过程记录数组
        int[][] value = new int[row][column];
        // 初始化上边界和左边界的值
        value[0][0] = grid[0][0];
        for (int i = 1; i < row; i++) {
            value[i][0] = value[i - 1][0] + grid[i][0];
        }
        for (int i = 1; i < column; i++) {
            value[0][i] = value[0][i - 1] + grid[0][i];
        }
        // 推算每个节点的最大值，值为Max(上元素礼物累计值，左元素礼物累计值) + 当前节点礼物值
        for (int i = 1; i < row; i++) {
            for (int j = 1; j < column; j++) {
                value[i][j] = Math.max(value[i-1][j], value[i][j - 1]) + grid[i][j];
            }
        }
        return value[value.length - 1][value[0].length - 1];
    }
}
```

## <font color="orange">48、最长不含重复字符的子字符串</font>

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

```
示例 1:
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

示例 2:
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

示例 3:
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
     
提示：
s.length <= 40000
```

注意：本题与主站 3 题相同：https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/

{% notel orange 题解思路 %}

用map记录每个字符和出现的下标，记录长度，当出现重复时，从该重复元素后重新开始计数

这样做是可以解的，但是耗时比较大

最后参考了其他人的解法

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

## <font color="orange">49、丑数</font>

我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

```
示例:
输入: n = 10
输出: 12
解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。

说明:
1. 1 是丑数
2. n 不超过1690
```

注意：本题与主站 264 题相同：https://leetcode-cn.com/problems/ugly-number-ii/

{% notel orange 题解思路 %}

新丑数=原丑数*2/3/5

但问题是怎么保证顺序，起始数1乘2/3/5分别得到2/3/5，但中间其实还有一个4

这里需要使用多指针，分别记录2/3/5因子的乘数位置，每次取3个积中的小值

{% endnotel %}

```java
class Solution {
    public int nthUglyNumber(int n) {
        int[] dp = new int[n + 1];
        //表示可能被选择的三个元素的值，初始值为1
        int x = 1, y = 1, z = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            //dp[i]的值是三个元素分别乘2乘3乘5后，其中的最小值
            //最小值一定在这三个元素中，其他元素被排除，从而减少了重复查找
            int num2 = dp[x] * 2, num3 = dp[y] * 3, num5 = dp[z] * 5;
            dp[i] = Math.min(num2, Math.min(num3, num5));
            //已经被选择过的元素，应该被排除，后续只会选择更大的值
            if (dp[i] == num2) x++;
            if (dp[i] == num3) y++;
            if (dp[i] == num5) z++;
        }
        return dp[n];
    }
}
```

## <font color="green">50、第一个只出现一次的字符</font>

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

```
示例 1:
输入：s = "abaccdeff"
输出：'b'

示例 2:
输入：s = "" 
输出：' '

限制：
0 <= s 的长度 <= 50000
```

{% notel green 题解思路 %}

首先只出现一次，因此需要记录每个字符的状态(未重复/已重复)

其次需要第一个，还需要记录字符的顺序

因此使用LinkedHashMap即可，当然也可以HashMap+List，两者耗时接近

{% endnotel %}

```java
class Solution {
    public char firstUniqChar(String s) {
        LinkedHashMap<Character, Boolean> map = new LinkedHashMap<>();
        if (s.length() == 0) {
            return ' ';
        }
        char[] chars = s.toCharArray();
        for (char aChar : chars) {
            Boolean value = map.getOrDefault(aChar, null);
            if (value == null) {
                map.put(aChar, Boolean.TRUE);
            } else if (value) {
                map.put(aChar, Boolean.FALSE);
            }
        }
        for (Map.Entry<Character, Boolean> entry : map.entrySet()) {
            if (entry.getValue()) {
                return entry.getKey();
            }
        }
        return ' ';
    }
}
```

## <font color="red">51、数组中的逆序对</font>

在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

```
示例 1:
输入: [7,5,6,4]
输出: 5

限制：
0 <= 数组长度 <= 50000
```

{% notel red 题解思路 %}

归并排序的变形

需要知晓该元素后的每个元素的大小关系，且肯定不能是O(n^2^)的算法，只有归并排序符合要求

{% endnotel %}

```java
class Solution {
    public int reversePairs(int[] nums) {
        int n = nums.length;
        if (n < 2) {
            return 0;
        }
        int[] temp = new int[n];
        return mergeSort(nums, 0, n - 1, temp);
    }

    /**
     * 采用归并排序
     *
     * @param nums  待排序的数组
     * @param left  左边界
     * @param right 右边界
     * @param temp  临时存放数组
     * @return
     */
    private int mergeSort(int[] nums, int left, int right, int[] temp) {
        //只有一个元素 没有逆序对
        if (left == right) {
            return 0;
        }
        int mid = left + (right - left) / 2;
        //求出左边数组的逆序对
        int leftPairs = mergeSort(nums, left, mid, temp);
        //求出右边数组的逆序对
        int rightParis = mergeSort(nums, mid + 1, right, temp);
        //由于左右两个数组均有序，若左数组的最后一个节点 <= 右数组的最后一个节点
        //则整个【left，right】有序，这些元素不会贡献逆序对
        if (nums[mid] <= nums[mid + 1]) {
            return leftPairs + rightParis;
        }
        //计算两个数组的元素 贡献的逆序对
        int crossPairs = mergeAndCount(nums, left, mid, right, temp);
        return leftPairs + rightParis + crossPairs;
    }

    private int mergeAndCount(int[] nums, int left, int mid, int right, int[] temp) {
        //临时存放元素
        if (right + 1 - left >= 0) System.arraycopy(nums, left, temp, left, right + 1 - left);
        int i = left;
        int j = mid + 1;
        int count = 0;
        for (int k = left; k <= right; k++) {
            if (i == mid + 1) {
                //左数组已经全部遍历完毕
                nums[k] = temp[j];
                j++;
            } else if (j == right + 1) {
                //右数组已经全部遍历完毕
                nums[k] = temp[i];
                i++;
            } else if (temp[i] <= temp[j]) {
                //左节点小于等于右节点
                nums[k] = temp[i];
                i++;
            } else {
                //左节点大于右节点 会贡献逆序对
                nums[k] = temp[j];
                j++;
                count += (mid - i + 1);
            }
        }
        return count;
    }
}
```

## <font color="green">52、两个链表的第一个公共节点</font>

输入两个链表，找出它们的第一个公共节点。

```
示例1：
   a1->a2
         c1->c2->c3
b1->b2->b3
则返回c1

示例2
2->6->4
1->5
则返回null
```

**注意：**

- 如果两个链表没有交点，返回 `null`.
- 在返回结果后，两个链表仍须保持原有的结构。
- 可假定整个链表结构中没有循环。
- 程序尽量满足 O(*n*) 时间复杂度，且仅用 O(*1*) 内存。
- 本题与主站 160 题相同：https://leetcode-cn.com/problems/intersection-of-two-linked-lists/

{% notel green 题解思路 %}

最直观的想法是把两个链表的元素都存到Set中，边遍历边存边校验是否存在，但耗时比较大

看到一个方法，设置两个指针A和B分别遍历链表1和链表2，当A遍历完1和从2开始遍历，B类似。这样最多在第二轮遍历时，A和B就会同时到第一个相同的节点(或者同时遍历到链表末尾，即null)

{% endnotel %}

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode p1 = headA, p2 = headB;
        while(p1 != p2){
            p1 = p1 == null ? headB : p1.next;
            p2 = p2 == null ? headA : p2.next;
        }
        return p1;
    }
}
```

## <font color="green">53-1、在排序数组中查找数字Ⅰ</font>

统计一个数字在排序数组中出现的次数。

```
示例 1:
输入: nums = [5,7,7,8,8,10], target = 8
输出: 2

示例 2:
输入: nums = [5,7,7,8,8,10], target = 6
输出: 0

提示：
- 0 <= nums.length <= 105
- -109 <= nums[i] <= 109
- nums 是一个非递减数组
- -109 <= target <= 109
```

**注意：**本题与主站 34 题相同（仅返回值不同）：https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/

{% notel green 题解思路 %}

可以分为两步来做，先是定位到任意一个目标值，再往前往后统计目标值数量

因为是有序数组，第一步，可以使用二分查找

第二步直接用下标遍历即可，因为相等的值就在附近

{% endnotel %}

```java
class Solution {
    public int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;

        int count = 0;
        while (low <= high) {
            int mid = (low + high) >>> 1;
            int midVal = nums[mid];

            if (midVal < target)
                low = mid + 1;
            else if (midVal > target)
                high = mid - 1;
            else {
                // 找到任意一个目标值，往前往后遍历，统计目标值数量即可
                return count(nums, mid, target);
            }
        }
        return count;
    }

    private int count(int[] nums, int index, int target){
        int count = 0;
        int temp = index;
        while(temp < nums.length && target == nums[temp]){
            count++;
            temp++;
        }
        temp = index - 1;
        while(temp >= 0 && target == nums[temp]){
            count++;
            temp--;
        }
        return count;
    }
}
```

## <font color="green">53-2、0~n-1中缺失的数字</font>

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

```
示例 1:
输入: [0,1,3]
输出: 2

示例 2:
输入: [0,1,2,3,4,5,6,7,9]
输出: 8

限制：
1 <= 数组长度 <= 10000
```

{% notel green 题解思路 %}

如数组[0,1,3]，其长度为3即数字为0，1，2，3

因为数组是递增的，且只缺一个数，那么只需要拿元素和其下标比对即可，第一个不同的下标就是缺少的数字

如果遍历完没有匹配到，那只可能是[0,1,2]这种情况，那么返回数组的长度即3

{% endnotel %}

```java
class Solution {
    public int missingNumber(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            if(i != nums[i]){
                return i;
            }
        }
        return nums.length;
    }
}
```

## <font color="green">54、二叉搜索树的第k大节点</font>

给定一棵二叉搜索树，请找出其中第 `k` 大的节点的值。

```
示例 1:
输入: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
输出: 4

示例 2:
输入: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
输出: 4

限制：
1 ≤ k ≤ 二叉搜索树元素个数
```

{% notel green 题解思路 %}

二叉搜索树的特性，右子树>根节点>左子树

因此，只需要递归遍历，先右子树再根节点再左子树(即可保证从大到小遍历)，每遍历一个节点就计数，当到达第k大时，返回该值即可

{% endnotel %}

```java
class Solution {
    private int count = 0;
    private int val = 0;
    public int kthLargest(TreeNode root, int k) {
        if (count >= k) {
            return val;
        }
        if (root.right != null) {
            kthLargest(root.right, k);
        }
        count++;
        if (count == k) {
            val = root.val;
        }
        if (root.left != null) {
            kthLargest(root.left, k);
        }
        return val;
    }
}
```

## <font color="green">55-1、二叉树的深度</font>

输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树的深度。

```
例如：
给定二叉树 `[3,9,20,null,null,15,7]`，
   3
   / \
  9  20
    /  \
   15   7
返回它的最大深度 3

提示：
1. `节点总数 <= 10000`
```

注意：本题与主站 104 题相同：https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/

{% notel green 题解思路 %}

直接递归即可

有一个点是：要求深度最大值，最好是设一个成员变量在递归体之外，用于记录最大值，这样实现起来会轻松很多

{% endnotel %}

```java
class Solution {
    private int max = 0;

    public int maxDepth(TreeNode root) {
        findMaxDepth(root, 0);
        return max;
    }

    private void findMaxDepth(TreeNode node, int depth){
        if(node == null){
            max = Math.max(max, depth);
            return;
        }
        depth++;
        findMaxDepth(node.left, depth);
        findMaxDepth(node.right, depth);
    }
}
```

## <font color="green">55-2、平衡二叉树</font>

输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。

```
示例 1:
给定二叉树 `[3,9,20,null,null,15,7]`
    3
   / \
  9  20
    /  \
   15   7
返回 `true`

示例 2:
给定二叉树 `[1,2,2,3,3,null,null,4,4]`
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
 返回 `false`
 
限制：
- `0 <= 树的结点个数 <= 10000`
```

注意：本题与主站 110 题相同：https://leetcode-cn.com/problems/balanced-binary-tree/

{% notel green 题解思路 %}

求深度的变式，每次求完左右子树的深度后，需要判断一下两者差值是否大于1，如果大于1了则无需再遍历了

{% endnotel %}

```java
class Solution {
    private boolean balance = true;

    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return balance;
        }
        check(root);
        return balance;
    }

    private int check(TreeNode node) {
        if (!balance) {
            return -1;
        }
        int leftDepth = 0;
        if (node.left != null) {
            leftDepth = check(node.left);
        }
        int rightDepth = 0;
        if (node.right != null) {
            rightDepth = check(node.right);
        }
        if (Math.abs(leftDepth - rightDepth) > 1) {
            balance = false;
        }
        return Math.max(leftDepth, rightDepth) + 1;
    }
}
```

## <font color="orange">56-1、数组中数字出现的次数</font>

一个整型数组 `nums` 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

```
示例 1：
输入：nums = [4,1,4,6]
输出：[1,6] 或 [6,1]

示例 2：
输入：nums = [1,2,10,4,1,4,3,3]
输出：[2,10] 或 [10,2]

限制：
- `2 <= nums.length <= 10000`
```

{% notel orange 题解思路 %}

第一想法是用set，但是不符合空间复杂度O(1)的要求

然后看到相关词条有位运算，想到用一个二进制数值，若2则左移两位执行异或操作，最后两个1就是所求的值。但数组长度最大为10000，也就是说最大值也在5000左右，这个方法也不合理

然后看到别人的解法，也是异或，但还是不太理解，对位运算还是接触太少

{% endnotel %}

```java
class Solution {
    public int[] singleNumbers(int[] nums) {
        int xorNumber = nums[0];
        for(int k=1; k<nums.length; k++){
            xorNumber ^=nums[k];
        }
        int onePosition = xorNumber&(-xorNumber);
        int ans1 = 0, ans2 = 0;
        for (int num : nums) {
            if ((num & onePosition) == onePosition) {
                ans1 ^= num;
            } else {
                ans2 ^= num;
            }
        }
        return new int[] {ans1, ans2};
    }
}
```

## <font color="orange">56-2、数组中数字出现的次数Ⅱ</font>

在一个数组 `nums` 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

```
示例 1：
输入：nums = [3,4,3,3]
输出：4

示例 2：
输入：nums = [9,1,7,9,7,9,7]
输出：1

限制：
- `1 <= nums.length <= 10000`
- `1 <= nums[i] < 2^31`
```

{% notel orange 题解思路 %}

如果要位运算实现的话没啥思路，能想到的也就是排序或者set

目前位运算这块是最薄弱的一类了，后续考虑挑点这块的题做个专项提升

{% endnotel %}

```java
public class Solution {
    public int singleNumber(int[] nums) {//本算法同样适用于数组nums中存在负数的情况
        if (nums.length == 0) return -1;//输入数组长度不符合要求，返回-1;
        int[] bitSum = new int[32];//java int类型有32位，其中首位为符号位
        int res = 0;
        for (int num : nums) {
            int bitMask = 1;//需要在这里初始化，不能和res一起初始化
            for (int i = 31; i >= 0; i--) {//bitSum[0]为符号位
                //这里同样可以通过num的无符号右移>>>来实现，否则带符号右移(>>)左侧会补符号位，对于负数会出错。
                //但是不推荐这样做，最好不要修改原数组nums的数据
                if ((num & bitMask) != 0) bitSum[i]++;//这里判断条件也可以写为(num&bitMask)==bitMask,而不是==1
                bitMask = bitMask << 1;//左移没有无符号、带符号的区别，都是在右侧补0
            }
        }
        for (int i = 0; i < 32; i++) {//这种做法使得本算法同样适用于负数的情况
            res = res << 1;
            res += bitSum[i] % 3;//这两步顺序不能变，否则最后一步会多左移一次
        }
        return res;
    }
}
```

## <font color="green">57-1、和为s的两个数字</font>

输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

```
示例 1：
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]

示例 2：
输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]

限制：

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^6`
```

{% notel green 题解思路 %}

设置两个指针，A指针从头向尾遍历，B指针从尾向头遍历

两个指针的元素和大于目标值则B指针前移，小于目标值则A指针后移

{% endnotel %}

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int small = 0;
        int big = nums.length - 1;
        while(small <= big){
            int value = nums[small] + nums[big];
            if(value > target){
                big--;
            } else if(value < target){
                small++;
            } else {
                return new int[]{nums[small], nums[big]};
            }
        }
        return new int[2];
    }
}
```

## <font color="green">57-2、和为s的连续正数序列</font>

输入一个正整数 `target` ，输出所有和为 `target` 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

```
示例 1：
输入：target = 9
输出：[[2,3,4],[4,5]]

示例 2：
输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]

限制：
1 <= target <= 10^5
```

{% notel green 题解思路 %}

双指针圈出一个范围，范围内的数值和大于目标值，移动小值，反之移动大值

注意这里有一个可以剪枝的点，如15，最大就是7和8，如果大值到了9，那么15-9=6，已经不符合连续的要求了。因此利用这一点可以只循环[1,n/2+1]，节约近一半的时间

{% endnotel %}

```java
class Solution {
    public int[][] findContinuousSequence(int target) {
        if(target <= 2){
            return new int[0][0];
        }
        List<int[]> result = new ArrayList<>();
        int small = 1,big = 2;
        int biggest = target / 2 + 1;
        int sum = 3;
        while(big <= biggest){
            if(sum < target){
                big++;
                sum += big;
            } else if(sum > target){
                sum -= small;
                small++;
            } else {
                int[] res = new int[big - small + 1];
                int index = 0;
                for (int i = small; i <= big; i++) {
                    res[index++] = i;
                }
                result.add(res);
                big++;
                sum += big;
            }
        }
        return result.toArray(new int[0][]);
    }
}
```

## <font color="green">58-1、翻转单词顺序</font>

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

```
示例 1：
输入: "the sky is blue"
输出: "blue is sky the"

示例 2：
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。

示例 3：
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

说明：
- 无空格字符构成一个单词。
- 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
- 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```

**注意：**本题与主站 151 题相同：https://leetcode-cn.com/problems/reverse-words-in-a-string/

**注意：**此题对比原题有改动

{% notel green 题解思路 %}

依旧使用双指针来做即可，跟据遍历到字符的不同做不同的事情来划分出每个单词：

- 遍历到空格，两个指针指在同一个元素。代表首尾空格或者单词间的冗余空格，忽略即可
- 遍历到空格，两个指针不在同一个元素，代表单词前的第一个空格，执行划分单词的逻辑
- 遍历到非空格，小指针前移，大指针不动

另外提一下，Java中提供了split方法，按照空格划分可以实现，但split方法基于正则实现效率非常差(8ms)，除非真的要使用正则，否则不推荐使用

{% endnotel %}

```java
class Solution {
    public String reverseWords(String s) {
        if(s.length() == 0) {
            return s;
        }
        int small = s.length() - 1;
        int big = s.length() - 1;
        StringBuilder builder = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) {
            if(s.charAt(i) == ' '){
                if(small == big){
                    small--;
                    big--;
                } else {
                    builder.append(s, small + 1, big + 1).append(" ");
                    small--;
                    big = small;
                }
            } else {
                small--;
            }
        }
        if(small != big){
            builder.append(s, small + 1, big + 1).append(" ");
        }
        if(builder.length() != 0){
            builder.deleteCharAt(builder.length() - 1);
        }
        return builder.toString();
    }
}
```

## <font color="green">58-2、左旋转字符串</font>

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。

```
示例 1：
输入: s = "abcdefg", k = 2
输出: "cdefgab"

示例 2：
输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"

限制：
1 <= k < s.length <= 10000
```

{% notel green 题解思路 %}

按照给定的n执行substring，切出两段字符串再拼接

当然也可以用双指针来切割，但是有契合且效率很好的现成方法，就没必要自己造轮子

{% endnotel %}

```java
class Solution {
    public String reverseLeftWords(String s, int n) {
        String s1 = s.substring(0, n);
        String s2 = s.substring(n);
        return s2 + s1;
    }
}
```

## <font color="red">59-1、滑动窗口的最大值</font>

给定一个数组 `nums` 和滑动窗口的大小 `k`，请找出所有滑动窗口里的最大值。

```
示例:
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 
  滑动窗口的位置              最大值
---------------              -----
[1  3  -1] -3  5  3  6  7        3
 1 [3  -1  -3] 5  3  6  7        3
 1  3 [-1  -3  5] 3  6  7        5
 1  3  -1 [-3  5  3] 6  7        5
 1  3  -1  -3 [5  3  6] 7        6
 1  3  -1  -3  5 [3  6  7]       7
 
提示：
你可以假设 *k* 总是有效的，在输入数组 不为空 的情况下，1 ≤ k ≤ nums.length
```

注意：本题与主站 239 题相同：https://leetcode-cn.com/problems/sliding-window-maximum/

{% notel red 题解思路 %}

初步想法是用优先队列，始终保持优先队列中的元素是滑动窗口的元素，这样最大值可以很便捷的获得，但超时了(主要是维护堆的耗时，)

后来看了别人的手法，队列中存的是元素下标，且在存入时比较大小关系

队列中的下标，从队首到队尾依次递增；下标对应的元素从队首到队尾依次递减；通过下标的大小关系来判断是否移除队首

算是完美契合的题目的要求，Hard难度的题感觉很需要题感，光会一个通用解法还是不够

{% endnotel %}

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // 窗口个数
        int[] res = new int[nums.length - k + 1];
        LinkedList<Integer> queue = new LinkedList<>();
        // 遍历数组中元素，right表示滑动窗口右边界
        for(int right = 0; right < nums.length; right++) {
            // 如果队列不为空且当前考察元素大于等于队尾元素，则将队尾元素移除。
            // 直到，队列为空或当前考察元素小于新的队尾元素
            while (!queue.isEmpty() && nums[right] >= nums[queue.peekLast()]) {
                queue.removeLast();
            }
            // 存储元素下标
            queue.addLast(right);
            // 计算窗口左侧边界
            int left = right - k +1;
            // 当队首元素的下标小于滑动窗口左侧边界left时
            // 表示队首元素已经不再滑动窗口内，因此将其从队首移除
            if (queue.peekFirst() < left) {
                queue.removeFirst();
            }
            // 由于数组下标从0开始，因此当窗口右边界right+1大于等于窗口大小k时
            // 意味着窗口形成。此时，队首元素就是该窗口内的最大值
            if (right +1 >= k) {
                res[left] = nums[queue.peekFirst()];
            }
        }
        return res;
    }
}
```

## <font color="orange">59-2、队列的最大值</font>

请定义一个队列并实现函数 `max_value` 得到队列里的最大值，要求函数`max_value`、`push_back` 和 `pop_front` 的**均摊**时间复杂度都是O(1)。

若队列为空，`pop_front` 和 `max_value` 需要返回 -1

```
示例 1：
输入: 
["MaxQueue","push_back","push_back","max_value","pop_front","max_value"]
[[],[1],[2],[],[],[]]
输出: [null,null,null,2,1,2]

示例 2：
输入: 
["MaxQueue","pop_front","max_value"]
[[],[],[]]
输出: [null,-1,-1]

限制：
- `1 <= push_back,pop_front,max_value的总操作数 <= 10000`
- `1 <= value <= 10^5`
```

{% notel orange 题解思路 %}

即要保证先进先出，还需要有堆的特性。维护单调队列

{% endnotel %}

```java
class MaxQueue {

    private Queue<Integer> queue;
    private Deque<Integer> deque;
    public MaxQueue() {
        queue = new LinkedList<>();
        deque = new LinkedList<>();
    }

    public int max_value() {
        return deque.isEmpty() ? -1 :deque.peekFirst();
    }

    public void push_back(int value) {
        queue.offer(value);
        while(!deque.isEmpty() && deque.peekLast()< value)
            deque.pollLast();
        deque.offerLast(value);
    }

    public int pop_front() {
        if(queue.isEmpty()) return -1;
        if(queue.peek().equals(deque.peekFirst()))
            deque.pollFirst();
        return queue.poll();
    }
}
```

## <font color="orange">60、n个骰子的点数</font>

把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s的所有可能的值出现的概率。

你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

```
示例 1:
输入: 1
输出: [0.16667,0.16667,0.16667,0.16667,0.16667,0.16667]

示例 2:
输入: 2
输出: [0.02778,0.05556,0.08333,0.11111,0.13889,0.16667,0.13889,0.11111,0.08333,0.05556,0.02778]

限制：
1 <= n <= 11
```

{% notel orange 题解思路 %}

动态规划题，重点就是如果使用n-1的解推出n，以及中间过程的存储方式

这里如2个骰子，可以看出1个骰子的基础上再来一个骰子

{% endnotel %}

```java
class Solution {
    public double[] dicesProbability(int n) {
        double[] pre = {1 / 6d, 1 / 6d, 1 / 6d, 1 / 6d, 1 / 6d, 1 / 6d};
        for (int i = 2; i <= n; i++) {
            double[] tmp = new double[5 * i + 1];
            for (int j = 0; j < pre.length; j++) {
                // 在原来的基础上，分别再加上一个骰子的1~6情况
                for (int x = 0; x < 6; x++) {
                    tmp[j + x] += pre[j] / 6;
                }
            }
            pre = tmp;
        }
        return pre;
    }
}
```