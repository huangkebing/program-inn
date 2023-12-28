---
title: 剑指Offer_Part.4
date: 2023-07-17 09:45:19
categories: [算法, 剑指offer]
excerpt: 剑指offer系列算法题，第四部分——61至68题
---

## <font color="green">61、扑克牌中的顺子</font>

从**若干副扑克牌**中随机抽 `5` 张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

```
示例 1:
输入: [1,2,3,4,5]
输出: True

示例 2:
输入: [0,0,1,2,5]
输出: True

限制：
数组长度为 5
数组的数取值为 [0, 13]
```

{% notel green 题解思路 %}

首先需要进行排序，然后遍历数组

有两种情况出现，可以判定非顺子

- 有两个非0值相同
- 两个值之间有差距且0的数量不足。如2和5，中间少了3和4，需要用0来补，如果0不够补则不是顺子

{% endnotel %}

```java
class Solution {
    public boolean isStraight(int[] nums) {
        Arrays.sort(nums);
        int jokerCount = 0;
        for (int i = 1; i < nums.length; i++) {
            if(nums[i - 1] == 0){
                jokerCount++;
            } else if(nums[i] == nums[i - 1]) {
                return false;
            } else {
                int sub = nums[i] - nums[i - 1] - 1;
                if(sub != 0){
                    if(jokerCount < sub){
                        return false;
                    } else {
                        jokerCount -= Math.abs(sub);
                    }
                }
            }
        }
        return true;
    }
}
```

## <font color="green">62、圆圈中最后剩下的数字</font>

0,1,···,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。求出这个圆圈里剩下的最后一个数字。

例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。

```
示例 1：
输入: n = 5, m = 3
输出: 3

示例 2：
输入: n = 10, m = 17
输出: 2

限制：
- 1 <= n <= 10^5
- 1 <= m <= 10^6
```

{% note success %}

### 备注1、约瑟夫环

约瑟夫环问题，有推导公式

f(N,M)=(f(N−1,M)+M)%N

{% endnote %}

```java
class Solution {
    public int lastRemaining(int n, int m) {
        int k = 0;
        for (int i = 2; i <= n; i++) {
            k = (k + m) % i;
        }
        return k;
    }
}
```

## <font color="orange">63、股票的最大利润</font>

假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

```
示例 1:
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5。注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。

示例 2:
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0

限制：
0 <= 数组长度 <= 10^5
```

**注意：**本题与主站 121 题相同：https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/

{% notel orange 题解思路 %}

可以用贪心算法，遍历数据

- 出现价格低于买入价，替换买入价并将卖出价置0
- 出现价格高于卖出价，替换卖出价并更新当前盈亏和最大盈亏

最终的最大盈亏就是所求值

{% endnotel %}

```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length <= 1) {
            return 0;
        }
        int buy = prices[0];
        int sell = 0;
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            int price = prices[i];
            // 遍历到比买入价更低的价格，直接替换买入价
            if (price < buy) {
                buy = price;
                sell = 0;
            }
            // 出现更高的卖出价，更新最大盈亏
            if (price > sell) {
                sell = price;
                profit = Math.max(profit, sell - buy);
            }
        }
        return profit;
    }
}
```

## <font color="orange">64、求1+2+...+n</font>

求 `1+2+...+n` ，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。

```
示例 1：
输入: n = 3
输出: 6

示例 2：
输入: n = 9
输出: 45

限制：
1 <= n <= 10000
```

{% notel orange 题解思路 %}

不能乘除也就是不能用公式计算，不能循环也就是不能正常从1加到n

因此只剩下递归，因为递归可以替换循环，但不能用if，也就是递归的终止条件受到限制，需要利用逻辑运算符的短路特性(&& ||)

{% endnotel %}

```java
class Solution {
    int res = 0;
    public int sumNums(int n) {
        boolean x = n > 1 && sumNums(n - 1) > 0;
        res += n;
        return res;
    }
}
```

## <font color="green">65、不用加减乘除做加法</font>

写一个函数，求两个整数之和，要求在函数体内不得使用 “+”、“-”、“*”、“/” 四则运算符号。

```
示例:
输入: a = 1, b = 1
输出: 2

提示：
- `a`, `b` 均可能是负数或 0
- 结果不会溢出 32 位整数
```

{% notel green 题解思路 %}

基于位运算来实现

{% endnotel %}

```java
class Solution {
    public int add(int a, int b) {
        if (a == 0 || b == 0)
            return a ^ b;
        return add(a ^ b, (a & b) << 1);
    }
}
```

## <font color="orange">66、构建乘积数组</font>

给定一个数组 `A[0,1,…,n-1]`，请构建一个数组 `B[0,1,…,n-1]`，其中 `B[i]` 的值是数组 `A` 中除了下标 `i` 以外的元素的积, 即 `B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]`。不能使用除法。

```
示例:
输入: [1,2,3,4,5]
输出: [120,60,40,30,24]

提示：
- 所有元素乘积之和不会溢出 32 位整数
- `a.length <= 100000`
```

{% notel orange 题解思路 %}

最简单的方法是把所有的元素乘起来，然后遍历依次除当前元素，但不能用除法

所以只能遍历两遍，分别乘元素左边和元素右边的元素

{% endnotel %}

```java
class Solution {
    public int[] constructArr(int[] a) {
        //边界条件的判断
        if (a == null || a.length == 0)
            return a;
        int length = a.length;
        int[] res = new int[length];
        res[0] = 1;
        //当前元素左边的所有元素乘积（不包含当前元素）
        for (int i = 1; i < length; i++) {
            res[i] = res[i - 1] * a[i - 1];
        }
        int right = 1;
        //right表示当前元素右边所有元素的乘积（不包含当前元素）,
        //res[i]表示的是左边的乘积，他俩相乘就是
        //除了自己以外数组的乘积
        for (int i = length - 1; i >= 0; i--) {
            res[i] *= right;
            right *= a[i];
        }
        return res;
    }
}
```

## <font color="orange">67、把字符串转换成整数</font>

写一个函数 StrToInt，实现把字符串转换成整数这个功能。不能使用 atoi 或者其他类似的库函数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

```
说明：
假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231, 231 − 1]。如果数值超过这个范围，请返回 INT_MAX (231 − 1) 或 INT_MIN (−231) 。

示例 1:
输入: "42"
输出: 42

示例 2:
输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。

示例 3:
输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。

示例 4:
输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。因此无法执行有效的转换。

示例 5:
输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。 因此返回 INT_MIN (−231) 。
```

注意：本题与主站 8 题相同：https://leetcode-cn.com/problems/string-to-integer-atoi/

{% notel orange 题解思路 %}

跟据各类情况来分类讨论，实现起来很繁琐

主要的坑有+/-号，空格的不同情况(如  42是42，1 123是1)，0的不同情况(+0是0，000123是123)，int范围

{% endnotel %}

```java
class Solution {
    public int strToInt(String str) {
        if(str.length() == 0)
            return 0;
        int i = 0;
        //1跳过空格
        while(i < str.length() && str.charAt(i) == ' ')
            i++;
        if(i == str.length())
            return 0;
        //2判断正负
        int x = 1;
        if(str.charAt(i) == '+'){
            i++;
        }else if(str.charAt(i) == '-'){
            x = -1;
            i++;
        }
        //3第一个数字字符位置
        int j = i;
        //4 i继续遍历，找最后一个数字字符（也即第一个非数字字符）
        while(i < str.length() && str.charAt(i) <= '9' && str.charAt(i) >= '0')
            i++;
        if(i == j)
            return 0;
        //跳过开头连续的多个0
        while(j < i && str.charAt(j) == '0'){
            j++;
        }

        //5边界判断
        int len = i-j;
        if(len > 10 && x == -1 || len == 10 && x == -1 && str.substring(j, i).compareTo("2147483648") >= 0)
            return Integer.MIN_VALUE;
        if(len > 10 && x == 1 || len == 10 && x == 1 && str.substring(j, i).compareTo("2147483647") >= 0)
            return Integer.MAX_VALUE;

        //6计算并返回结果
        int result = 0;
        while(j < i){
            result = result * 10 + (str.charAt(j) - '0');
            j++;
        }
        return x * result;
    }
}
```

## <font color="green">68-1、二叉搜索树的最近公共祖先</font>

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。

```
示例 1:
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
输出: 6 
解释: 节点 2 和节点 8 的最近公共祖先是 6。

示例 2:
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
输出: 2
解释: 节点 2 和节点 4 的最近公共祖先是 2, 因为根据定义最近公共祖先节点可以为节点本身。

说明:
- 所有节点的值都是唯一的。
- p、q 为不同节点且均存在于给定的二叉搜索树中。
```

注意：本题与主站 235 题相同：https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

{% notel green 题解思路 %}

利用二叉搜索树左子树节点<根节点<右子树节点的特点，如果pq两个节点满足`p≤root≤q`或者`q≤root≤p`，则root就是最近的公共组件

而如果pq均小于root，那么root往左子树遍历，反之往右子树遍历，直到出现root符合上面的条件

{% endnotel %}

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while(true){
            if(p.val < root.val && q.val < root.val){
                root = root.left;
            } else if(p.val > root.val && q.val > root.val){
                root = root.right;
            } else {
                return root;
            }
        }
    }
}
```

## <font color="green">68-2、二叉树的最近公共祖先</font>

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。

```
示例 1:
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3
解释: 节点 5 和节点 1 的最近公共祖先是节点 3。

示例 2:
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出: 5
解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。

说明:
- 所有节点的值都是唯一的。
- p、q 为不同节点且均存在于给定的二叉树中。
```

注意：本题与主站 236 题相同：https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/

{% notel orange 题解思路 %}

跟68-1相比，去掉了二叉搜索树条件，也就不能跟据节点值的大小关系判断节点的位置。

因此只能遍历二叉树，需要以下任一条件，即为最近公共祖先

- 左子树和右子树中各有一个目标节点
- 当前节点就是目标节点，且左子树或右子树中有一个目标节点

{% endnotel %}

```java
class Solution {
    private TreeNode node;
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        find(root, p, q);
        return node;
    }

    public boolean find(TreeNode root, TreeNode p, TreeNode q){
        if(root == null){
            return false;
        }
        // 获取到当前节点以及左右子树中是否存在pq
        boolean curr = root.val == p.val || root.val == q.val;
        boolean left = find(root.left, p, q);
        boolean right = find(root.right, p, q);
        // 已经找到公共祖先了，不做后续处理
        if(node != null){
            return false;
        }
        // 左右子树中均有目标节点pq，则当前节点为最近公共祖先
        if(left && right){
            node = root;
        } else if(curr && (left || right)){
            // 当前节点为pq中的一个，且左右子树中存在另一个目标节点，当前节点为最近公共祖先
            node = root;
        }
        // 如果没有找到祖先，将本节点和左右子树节点情况往上传递，本节点左右子树中有一个为true即传true
        return curr || left || right;
    }
}
```

## 阶段总结

这一系列刷完了，目前来说：

- 二叉树的题已经掌握，主要就是递归实现深度遍历，队列实现广度遍历以及二叉搜索树和前中后序遍历
- 动态规划类，主要的难点在于如果跟据n-1推出n，还需要多做题来练感觉，以及部分题可以用贪心来解
- 位运算这块目前看是最薄弱的，因为日常开发中也不会接触位操作，对于一些规律还没有理解
- 剩下一类算是笼统的积累题，就是一些公式或者规律的应用，就是见招拆招。这类没有太好的办法，目前只能多做题