---
title: LCR_Part.3
date: 2023-10-25 09:56:59
categories: [算法, 剑指offerⅡ]
excerpt: LCR(又名剑指offer2)系列算法题，第三部分——41至60题
---

## <font color="green">41、数据流中的移动平均值</font>

给定一个窗口大小和一个整数数据流，根据该滑动窗口的大小，计算滑动窗口里所有数字的平均值。

实现 `MovingAverage` 类：

- `MovingAverage(int size)` 用窗口大小 `size` 初始化对象。
- `double next(int val)` 成员函数 `next` 每次调用的时候都会往滑动窗口增加一个整数，请计算并返回数据流中最后 `size` 个值的移动平均值，即滑动窗口里所有数字的平均值。

```
示例：
输入：
inputs = ["MovingAverage", "next", "next", "next", "next"]
inputs = [[3], [1], [10], [3], [5]]
输出：
[null, 1.0, 5.5, 4.66667, 6.0]

解释：
MovingAverage movingAverage = new MovingAverage(3);
movingAverage.next(1); // 返回 1.0 = 1 / 1
movingAverage.next(10); // 返回 5.5 = (1 + 10) / 2
movingAverage.next(3); // 返回 4.66667 = (1 + 10 + 3) / 3
movingAverage.next(5); // 返回 6.0 = (10 + 3 + 5) / 3
```

**提示：**

- `1 <= size <= 1000`
- `-10^5 <= val <= 10^5`
- 最多调用 `next` 方法 `10^4` 次

注意：本题与主站 346 题相同： https://leetcode-cn.com/problems/moving-average-from-data-stream/

{% notel green 题解思路 %}

数据流的特征是先进先出，因此可以确定保存窗口内的元素需要使用队列。此外为了避免每次都要计算队列内元素的和，可以维护一个变量sum，减少重复求和

{% endnotel %}

```java
class MovingAverage {
    private double sum = 0;
    private final Deque<Integer> deque;
    private final int size;

    /** Initialize your data structure here. */
    public MovingAverage(int size) {
        this.size = size;
        this.deque = new ArrayDeque<>(size);
    }

    public double next(int val) {
        if (deque.size() >= size) {
            Integer remove = deque.removeFirst();
            sum -= remove;
        }
        deque.add(val);
        sum += val;
        return sum / deque.size();
    }
}
```

## <font color="green">42、最近的请求次数</font>

写一个 `RecentCounter` 类来计算特定时间范围内最近的请求。

请实现 `RecentCounter` 类：

- `RecentCounter()` 初始化计数器，请求数为 0 。
- `int ping(int t)` 在时间 `t` 添加一个新请求，其中 `t` 表示以毫秒为单位的某个时间，并返回过去 `3000` 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 `[t-3000, t]` 内发生的请求数。

**保证** 每次对 `ping` 的调用都使用比之前更大的 `t` 值。

```
示例：
输入：
inputs = ["RecentCounter", "ping", "ping", "ping", "ping"]
inputs = [[], [1], [100], [3001], [3002]]
输出：
[null, 1, 2, 3, 3]

解释：
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1]，范围是 [-2999,1]，返回 1
recentCounter.ping(100);   // requests = [1, 100]，范围是 [-2900,100]，返回 2
recentCounter.ping(3001);  // requests = [1, 100, 3001]，范围是 [1,3001]，返回 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002]，范围是 [2,3002]，返回 3
```

**提示：**

- `1 <= t <= 10^9`
- 保证每次对 `ping` 调用所使用的 `t` 值都 **严格递增**
- 至多调用 `ping` 方法 `10^4` 次

注意：本题与主站 933 题相同： https://leetcode-cn.com/problems/number-of-recent-calls/

{% notel green 题解思路 %}

因为每次给的t都是递增的，可以将t插入到队列尾部，并从队列首部开始移除小于t-3000的元素

那么请求次数就是队列中元素的个数

{% endnotel %}

```java
class RecentCounter {
    private final Deque<Integer> deque;

    public RecentCounter() {
        deque = new ArrayDeque<>();
    }
    
    public int ping(int t) {
        deque.offer(t);
        while(deque.peek() < t - 3000){
            deque.poll();
        }
        return deque.size();
    }
}
```

## <font color="orange">43、完全二叉树插入器</font>

完全二叉树是每一层（除最后一层外）都是完全填充（即，节点数达到最大，第 `n` 层有 `2n-1` 个节点）的，并且所有的节点都尽可能地集中在左侧。

设计一个用完全二叉树初始化的数据结构 `CBTInserter`，它支持以下几种操作：

- `CBTInserter(TreeNode root)` 使用根节点为 `root` 的给定树初始化该数据结构；
- `CBTInserter.insert(int v)` 向树中插入一个新节点，节点类型为 `TreeNode`，值为 `v` 。使树保持完全二叉树的状态，**并返回插入的新节点的父节点的值**；
- `CBTInserter.get_root()` 将返回树的根节点。

```
示例 1：
输入：inputs = ["CBTInserter","insert","get_root"], inputs = [[[1]],[2],[]]
输出：[null,1,[1,2]]

示例 2：
输入：inputs = ["CBTInserter","insert","insert","get_root"], inputs = [[[1,2,3,4,5,6]],[7],[8],[]]
输出：[null,3,4,[1,2,3,4,5,6,7,8]]
```

**提示：**

- 最初给定的树是完全二叉树，且包含 `1` 到 `1000` 个节点。
- 每个测试用例最多调用 `CBTInserter.insert` 操作 `10000` 次。
- 给定节点或插入节点的每个值都在 `0` 到 `5000` 之间。

注意：本题与主站 919 题相同： https://leetcode-cn.com/problems/complete-binary-tree-inserter/

{% notel orange 题解思路 %}

构建完全二叉树其实就是二叉树的广度遍历，那就要使用到队列：将子树不完全的结点放入队列，每次将新元素作为队首结点的左或右结点，并插入队列

但是这里有个点是，初始化给的root结点，可以也有子结点，所以还需要将队列先做处理才能使用

{% endnotel %}

```java
class CBTInserter {

    Deque<TreeNode> deque = new ArrayDeque<>();

    TreeNode root;

    public CBTInserter(TreeNode root) {
        this.root = root;
        deque.offer(root);
        while(true){
            TreeNode node = deque.peek();
            if(node.left != null && node.right != null){
                // 左右子树都有的结点，将左右结点入队列，并移除该结点
                deque.pop();
                deque.offer(node.left);
                deque.offer(node.right);
            } else if(node.left != null){
                // 只有左子树，说明遍历到目标结点了，左结点入队列，并结束
                deque.offer(node.left);
                break;
            } else {
                // 都没有，也是一种目标结点
                break;
            }
        }
    }
    
    public int insert(int v) {
        TreeNode node = deque.peek();
        TreeNode insert = new TreeNode(v);
        if(node.left == null){
            node.left = insert;
            deque.offer(insert);
        } else {
            node.right = insert;
            deque.offer(insert);
            deque.pop();
        }
        return node.val;
    }
    
    public TreeNode get_root() {
        return root;
    }
}
```

