---
title: 剑指Offer_Part.2
date: 2023-05-30 09:51:40
categories: [算法, 剑指offer]
excerpt: 剑指offer系列算法题，第二部分——21至40题
---

## 21、调整数组顺序使奇数位于偶数前面

## <font color="green">21、调整数组顺序使奇数位于偶数前面</font>

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

```
示例：
输入：nums = [1,2,3,4]
输出：[1,3,2,4] 
注：[3,1,2,4] 也是正确的答案之一

提示：
1. 0 <= nums.length <= 50000
2. 0 <= nums[i] <= 10000
```

{% notel green 题解思路 %}

有两种思路

1. 基于双指针

快指针用于遍历数组，慢指针记录奇数位置，当快指针遍历到奇数时快慢指针交换值

2. 直接思路

将奇偶数分成两个数组，再将偶数添加到奇数尾部

当前双指针效率更高一些，只涉及一次遍历，且无额外的数组空间消耗

{% endnotel %}

```java
class Solution {
    public int[] exchange(int[] nums) {
        int slow = 0;
        int fast = 0;
        int tmp = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[fast] % 2 == 1) {
                tmp = nums[fast];
                nums[fast] = nums[slow];
                nums[slow] = tmp;
                slow++;
            }
            fast++;
        }
        return nums;
    }
}
```

## <font color="green">22、链表中倒数第k个节点</font>

输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。

例如，一个链表有 `6` 个节点，从头节点开始，它们的值依次是 `1、2、3、4、5、6`。这个链表的倒数第 `3` 个节点是值为 `4` 的节点。

```
示例：
给定一个链表: 1->2->3->4->5, 和 k = 2.
返回链表 4->5.
```

{% notel green 题解思路 %}

使用快慢指针，用差值的思想。跟据题意：

- 快慢指针的下标相差k-1(如123456，取倒数第3个，那么快指针应当在3，慢指针在1)
- 随后将快慢指针同步平移，直至快指针到达链表尾部
- 此时慢指针即是解

{% endnotel %}

```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode fast = head, slow = head;
        for (int i = 0; i < k - 1; i++) {
            fast = fast.next;
        }
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
}
```

## <font color="green">23、反转链表</font>

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

```
示例:
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL

限制：
0 <= 节点个数 <= 5000
```

**注意**：本题与主站 206 题相同：https://leetcode-cn.com/problems/reverse-linked-list/

{% notel green 题解思路 %}

将当前节点的next指针指向前置节点，头节点next置为null

但此处链表是单链表，所以需要定义变量来缓存前置节点

{% endnotel %}

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if(head == null || head.next == null){
            return head;
        }
        ListNode p1 = head,p2 = p1.next;
        p1.next = null;
        ListNode curr = p2.next;
        while(curr != null){
            p2.next = p1;
            p1 = p2;
            p2 = curr;
            curr = curr.next;
        }
        p2.next = p1;
        return p2;
    }
}
```

## <font color="green">25、合并两个排序的链表</font>

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

```
示例1：
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4

限制：
0 <= 链表长度 <= 1000
```

注意：本题与主站 21 题相同：https://leetcode-cn.com/problems/merge-two-sorted-lists/

{% notel green 题解思路 %}

因为链表是排序的，所以只需要比较两个链表的当前首节点即可

但要注意null(即链表比完)的情况：

- 有空链表，则直接返回另一条
- 某一条链表用完，需要将另一条加到生成链表的尾部

两个链表均有值时，取小值添加到生成链表的尾部，具体可以结合代码注释

{% endnotel %}

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // 先判断是否有空链
        if (l1 == null) {
            return l2;
        }
        if (l2 == null) {
            return l1;
        }
        // 排除空链后，取两个链表中的小值作为头节点
        ListNode head;
        if(l1.val >= l2.val){
            head = l2;
            l2 = l2.next;
        } else {
            head = l1;
            l1 = l1.next;
        }
        // 两个链表均有节点时，获取小值，直到有一个链表用完
        ListNode p = head;
        while(l1 != null && l2 != null){
            if(l1.val >= l2.val){
                p.next = l2;
                l2 = l2.next;
            } else {
                p.next = l1;
                l1 = l1.next;
            }
            p = p.next;
        }
        // 将剩余链表接到新链表中
        while(l1 != null){
            p.next = l1;
            l1 = l1.next;
            p = p.next;
        }
        while(l2 != null){
            p.next = l2;
            l2 = l2.next;
            p = p.next;
        }
        return head;
    }
}
```

## <font color="orange">26、树的子结构</font>

输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

```
例如:
给定的树 A:
    3
   / \
  4   5
 / \ 
1	2
给定的树 B:
  4
 /
1
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

示例 1：
输入：A = [1,2,3], B = [3,1]
输出：false
示例 2：
输入：A = [3,4,5,1,2], B = [4,1]
输出：true

限制：
0 <= 节点个数 <= 10000
```

{% notel orange 题解思路 %}

凡是二叉树的题，基本是用递归没跑

但这里首先在A中找到B的根节点，然后再依次比对子节点，如果比对不上还需要继续查找根节点

然后就纳闷了这递归要怎么写，最后找到用双递归

看来这一类题还是不到火候，只直到用递归但要写出代码还少点感觉，还需要继续刷题思考总结

{% endnotel %}

```java
class Solution {
    //函数的作用就是判断B 是否是 A 的子结构树
    public boolean isSubStructure(TreeNode A, TreeNode B) {
        //约定空树不是任意一个树的子结构
        if (B == null || A == null) {
            return false;
        }
        return dp(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
    }

    //dp的作用是判断从A 的根节点出发，是否存在跟B 结构相同的树。
    boolean dp(TreeNode A, TreeNode B) {
        if (B == null) {
            return true;
        }
        if (A == null || B.val != A.val) {
            return false;
        }
        return dp(A.left, B.left) && dp(A.right, B.right);
    }
}
```

## <font color="green">27、二叉树的镜像</font>

请完成一个函数，输入一个二叉树，该函数输出它的镜像。

```
例如输入：
     4    
   /   \   
  2      7  
 /  \	 /  \ 
1   3  6   9
镜像输出：
	  4    
   /   \   
  7      2  
 /  \	 /  \ 
9   6  3   1
示例 1：
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
限制：
0 <= 节点个数 <= 1000
```

{% notel green 题解思路 %}

前面说了二叉树基本就是递归，这里所谓的镜像只需要把左右子树互换位置即可

递归结束条件更简单就是当前节点为null

{% endnotel %}

```java
class Solution {
    public TreeNode mirrorTree(TreeNode root) {
        if(root == null){
            return null;
        }
        TreeNode temp;
        temp = root.left;
        root.left = root.right;
        root.right = temp;
        mirrorTree(root.left);
        mirrorTree(root.right);
        return root;
    }
}
```

## <font color="green">28、对称的二叉树</font>

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

```
例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
	  1    
   /   \   
  2      2  
 /  \	 /  \ 
3   4  4   3
但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:
	  1    
   /   \   
  2      2  
   \	   \ 
    3      3

示例 1：
输入：root = [1,2,2,3,4,4,3]
输出：true

示例 2：
输入：root = [1,2,2,null,3,null,3]
输出：false

限制：
0 <= 节点个数 <= 1000
```

注意：本题与主站 101 题相同：https://leetcode-cn.com/problems/symmetric-tree/

{% notel green 题解思路 %}

同样是递归，但是绕了个圈子

如果直接拿二叉树就开始递归，那没办法做到判断是否对称

需要先将二叉树划分为左右树，然后在递归中同步遍历两个树，主要递归遍历时左右树的方向要相反(即左树的左子树和右树的右子树比较)

{% endnotel %}

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }
        return checkTree(root.left, root.right);
    }

    private boolean checkTree(TreeNode leftTree, TreeNode rightTree) {
        // 两边子树均遍历到叶子，true
        if (leftTree == null && rightTree == null) {
            return true;
        }
        // 只有一边到叶子，不说不是对称的
        if (leftTree == null || rightTree == null) {
            return false;
        }
        // 值不相等，不是对称
        if (leftTree.val != rightTree.val) {
            return false;
        }
        // 值相等，继续比较子树，注意要左树的左子树和右树的右子树比较
        return checkTree(leftTree.left, rightTree.right) && checkTree(leftTree.right, rightTree.left);
    }
}
```

## <font color="green">29、顺时针打印矩阵</font>

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

```
示例 1：
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]

示例 2：
输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]

限制：
- 0 <= matrix.length <= 100
- 0 <= matrix[i].length <= 100
```

注意：本题与主站 54 题相同：https://leetcode-cn.com/problems/spiral-matrix/

{% notel green 题解思路 %}

按照题目意思来编写循环即可，需要4个变量来存储上下左右4个边界

{% endnotel %}

```java
class Solution {
    public int[] spiralOrder(int[][] matrix) {
        // 空数组校验
        int row = matrix.length;
        if (row == 0) {
            return new int[0];
        }
        int column = matrix[0].length;
        if (column == 0) {
            return new int[0];
        }
        // 结果以四个方向的限制设置
        int[] result = new int[row * column];
        int top = 0, bottom = row - 1, left = 0, right = column - 1;
        int res = 0;
        // 按4个方向依次遍历，并移动方向限制
        while (true) {
            for (int i = left; i <= right; i++) {
                result[res++] = matrix[top][i];
            }
            if (++top > bottom) {
                break;
            }
            for (int i = top; i <= bottom; i++) {
                result[res++] = matrix[i][right];
            }
            if (--right < left) {
                break;
            }
            for (int i = right; i >= left; i--) {
                result[res++] = matrix[bottom][i];
            }
            if (--bottom < top) {
                break;
            }
            for (int i = bottom; i >= top; i--) {
                result[res++] = matrix[i][left];
            }
            if (++left > right) {
                break;
            }
        }
        return result;
    }
}
```

## <font color="green">30、包含min函数的栈</font>

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

```
示例:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.min();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.min();   --> 返回 -2.

提示：
1. 各函数的调用总次数不超过 20000 次
```

注意：本题与主站 155 题相同：https://leetcode-cn.com/problems/min-stack/

{% notel green 题解思路 %}

采用ArrayList来实现栈，入栈出栈非常容易

最小值，最初版是直接调用Collections.min()来做，但耗时400ms以上，非常慢

原因是每次调用min都需要查找一遍，于是做了个优化：用一个变量来保存min，每次入栈出栈时判断是否要更新最小值

{% endnotel %}

```java
class MinStack {
    List<Integer> stack;
    int min;

    /**
     * initialize your data structure here.
     */
    public MinStack() {
        stack = new ArrayList<>();
        min = Integer.MAX_VALUE;
    }

    public void push(int x) {
        stack.add(x);
        min = Math.min(min, x);
    }

    public void pop() {
        Integer remove = stack.remove(stack.size() - 1);
        if (min == remove) {
            if (stack.size() == 0) {
                min = Integer.MAX_VALUE;
            } else {
                min = Collections.min(stack);
            }
        }
    }

    public int top() {
        return stack.get(stack.size() - 1);
    }

    public int min() {
        return min;
    }
}
```

## <font color="orange">31、栈的压入、弹出序列</font>

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。

```
示例 1：
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1

示例 2：
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。

提示：
1. 0 <= pushed.length == popped.length <= 1000
2. 0 <= pushed[i], popped[i] < 1000
3. pushed 是 popped 的排列。
```

注意：本题与主站 946 题相同：https://leetcode-cn.com/problems/validate-stack-sequences/

{% notel orange 题解思路 %}

将入栈序列依次入栈，每次入栈判断栈首和弹出序列是否相等，若相等则出栈并继续判断直到不相等为止

最后入栈完毕，若栈中还有元素，那么结果为false反之为true

{% endnotel %}

```java
class Solution {
    // 思路 ：即，使用辅助栈temp来模拟入栈出栈，若是按照pushed数组所入栈的元素，都能够按照popped数组出栈的话，则代表符合条件
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        int len = pushed.length;
        // 双指针分别指向当前正在遍历的pushed数组中元素 && popped数组中元素;
        int p1 = 0;
        int p2 = 0;
        Stack<Integer> stack = new Stack<>();
        // while循环结束条件 ：指向pushed数组的指针p1 >= len；
        // 需要注意的是，p1 >= p2是永远满足的;
        while(p1 < len){
            // 即，pushed数组中当前所指向的元素压入栈中;
            stack.push(pushed[p1++]);
            // 当前栈不为空 && 当前栈顶元素与popped数组中当前所指向的元素一样
            while(!stack.isEmpty() && stack.peek() == popped[p2]){
                // 弹出栈顶元素
                stack.pop();
                p2++;
            }
        }
        return stack.isEmpty();
    }
}
```

## <font color="orange">32-1、从上到下打印二叉树</font>

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

```
例如:
给定二叉树: [3,9,20,null,null,15,7],
	 3
   / \
  9   20
     /  \
    15   7

返回：
[3,9,20,15,7]

提示：
1. 节点总数 <= 1000
```

{% notel orange 题解思路 %}

前面提到二叉树基本都是递归，但这里就不能用递归了！因为这里是广度优先遍历，而递归是深度优先遍历

广度优先的二叉树遍历，必定越遍历节点越多，所以需要存储节点，按照题意使用队列即可

消费队列头的节点将值保存到结果数组，并将左右子节点存到队列尾(null不存)

{% endnotel %}

{% note success %}

### 知识点1、基本数据类型尽量不用集合

基本数据类型使用集合会有装箱拆箱操作

如此题，因为不确定二叉树节点的数量，开始使用ArrayList来保存结果，再转化成int数组，耗时4ms

指定初始容量避免扩容操作后，耗时也在3ms

虽然在3ms在业务代码中可以忽略不计，但在算法题里打败用户数还是挺明显的

而用数组代替ArrayList，避免装箱拆箱后，直接到了0ms

{% endnote %}

```java
class Solution {
    public int[] levelOrder(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<TreeNode>();
        if(root == null){
            return new int[0];
        }
        queue.add(root);
        int index=0; int [] ans=new int[1010];
        while(!queue.isEmpty()){
            TreeNode node = queue.poll();
            ans[index++] = node.val;
            if(node.left != null){
                queue.add(node.left);
            }
            if(node.right != null){
                queue.add(node.right);
            }
        }
        return Arrays.copyOfRange(ans,0,index);
    }
}
```

## <font color="green">32-2、从上到下打印二叉树Ⅱ</font>

从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

```
例如:
给定二叉树: [3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7
   
返回其层次遍历结果：
[
  [3],
  [9,20],
  [15,7]
]

提示：
1. 节点总数 <= 1000
```

注意：本题与主站 102 题相同：https://leetcode-cn.com/problems/binary-tree-level-order-traversal/

{% notel green 题解思路 %}

在32-1的基础上，添加了每行打印单独一行的要求，那么如果区分一行已经结束就是唯一的设计点

用了两个队列，队列1用于遍历，队列2存放子节点

1. 遍历队列1
2. 队列1遍历完毕后，检查队列2是否为空，若为空则结束循环
3. 队列1完毕后交换两个队列指针，并创建新的一行

{% endnotel %}

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        Queue<TreeNode> queue1 = new LinkedList<TreeNode>();
        Queue<TreeNode> queue2 = new LinkedList<TreeNode>();
        if(root == null){
            return new ArrayList<>();
        }
        queue1.add(root);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> line = new ArrayList<>();
        result.add(line);
        while(true){
            while(!queue1.isEmpty()){
                TreeNode node = queue1.poll();
                line.add(node.val);
                if(node.left != null){
                    queue2.add(node.left);
                }
                if(node.right != null){
                    queue2.add(node.right);
                }
            }
            if(queue2.isEmpty()){
                break;
            }
            Queue<TreeNode> temp = queue1;
            queue1 = queue2;
            queue2 = temp;
            line = new ArrayList<>();
            result.add(line);
        }
        return result;
    }
}
```

## <font color="orange">32-3、从上到下打印二叉树Ⅲ</font>

请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

```
例如:
给定二叉树: [3,9,20,null,null,15,7],
    3
   / \
  9  20
    /  \
   15   7

返回其层次遍历结果：
[
  [3],
  [20,9],
  [15,7]
]

提示：
1. 节点总数 <= 1000
```

{% notel orange 题解思路 %}

在32-2的基础上，又新增了偶数行右到左展示，这里有两个思路

1. 保持32-2逻辑不变，遍历完成后再遍历一次，将偶数行List倒序
2. 使用双端队列，跟据行数使用对应的遍历方向

为了快捷我直接使用了第一个方法，然后找了个别人写的方法二

{% endnotel %}

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>>lists=new ArrayList<>();
        if(root==null) return lists;
        Deque<TreeNode>deque=new LinkedList<>();
        deque.offerLast(root);
        boolean flag=true;
        while(!deque.isEmpty()){
            int size=deque.size();
            List<Integer>list=new ArrayList<>();
            if(flag){// 奇数层正序
                for(int i=0;i<size;i++){
                    TreeNode node=deque.pollFirst();
                    list.add(node.val);
                    if(node.left!=null) deque.offerLast(node.left);
                    if(node.right!=null) deque.offerLast(node.right);
                }
            }else{// 偶数层逆序
                for(int i=0;i<size;i++){
                    TreeNode node=deque.pollLast();
                    list.add(node.val);
                    if(node.right!=null) deque.offerFirst(node.right);
                    if(node.left!=null) deque.offerFirst(node.left);
                }
            }
            lists.add(list);
            flag=!flag;// 通过将flag每次取反改变状态
        }
        return lists;
    }
}
```

## <font color="orange">33、二叉树的后序遍历序列</font>

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 `true`，否则返回 `false`。假设输入的数组的任意两个数字都互不相同。

```
参考以下这颗二叉搜索树：
     5
    / \
   2   6
  / \
 1   3

示例 1：
输入: [1,6,3,2,5]
输出: false

示例 2：
输入: [1,3,2,6,5]
输出: true

提示：
1. 数组长度 <= 1000
```

{% notel orange 题解思路 %}

先需要知晓几个点：

- 后序序列的最后一个元素即为根节点
- 二叉搜索树，左子树的所有节点都比根节点小，右子树的所有节点都比跟节点大

跟据规则编写判断逻辑

1. 取最后一个元素root
2. 从root-1往前遍历序列，找到第一个小于root的元素，那就找到了左右子树的分界点
3. 遍历一下左子树，看有没有比root大的，如果有那么不符合二叉搜索树规则，返回false
4. 如果左子树均小于root，那么利用递归再分别检查左子树和右子树是不是符合二叉搜索树

递归可以通过数组下标来做，编码时注意很容易数组越界

{% endnotel %}

```java
class Solution {
    public boolean verifyPostorder(int[] postorder) {
        if (postorder.length == 0) {
            return true;
        }
        return checkPostorder(postorder, 0, postorder.length - 1);
    }

    private boolean checkPostorder(int[] postorder, int begin, int end) {
        if (begin == end) {
            return true;
        }
        int root = postorder[end];
        int rightIndex = 0;
        for (int i = end - 1; i >= 0; i--) {
            if (postorder[i] < root) {
                rightIndex = i + 1;
                break;
            }
        }
        for (int i = begin; i < rightIndex; i++) {
            if (postorder[i] > root) {
                return false;
            }
        }
        if (begin == rightIndex) {
            return checkPostorder(postorder, rightIndex, end - 1);
        } else if (end == rightIndex) {
            return checkPostorder(postorder, begin, rightIndex - 1);
        }
        return checkPostorder(postorder, begin, rightIndex - 1) && checkPostorder(postorder, rightIndex, end - 1);
    }
}
```

## <font color="orange">34、二叉树中和为某一值的路径</font>

给你二叉树的根节点 `root` 和一个整数目标和 `targetSum` ，找出所有 **从根节点到叶子节点** 路径总和等于给定目标和的路径。

叶子节点 是指没有子节点的节点

```
示例 1：
      5
     / \
    4   8
   /   / \
  11   13  4
 / \     / \
7  2     5  1
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22 
输出：[[5,4,11,2],[5,8,4,5]]

示例 2：
  1
 / \
2 	3
输入：root = [1,2,3], targetSum = 5
输出：[]

示例 3：
输入：root = [1,2], targetSum = 0
输出：[]

提示：

- 树中节点总数在范围 [0, 5000] 内
- -1000 <= Node.val <= 1000
- -1000 <= targetSum <= 1000
```

注意：本题与主站 113 题相同：https://leetcode-cn.com/problems/path-sum-ii/

{% notel orange 题解思路 %}

依旧用递归来解，但这里有一点，没办法做剪枝

- 节点有负值，不到最后的叶子节点你是不知道是否符合要求的
- 需要找出所有的路径

还有一点，因为要保存路径，所以使用了List(数组也一样因为是引用对象)，所以在递归中add之后必须要手动remove

{% endnotel %}

```java
class Solution {
    private final List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> pathSum(TreeNode root, int target) {
        if (root == null) {
            return result;
        }
        List<Integer> currLine = new ArrayList<>();
        findPath(root, target, currLine, 0);
        return result;
    }

    private void findPath(TreeNode node, int target, List<Integer> currLine, int currNum) {
        if (node == null) {
            return;
        }
        int value = node.val + currNum;
        if (value == target && node.left == null && node.right == null) {
            currLine.add(node.val);
            List<Integer> newLine = new ArrayList<>(currLine);
            result.add(newLine);
            currLine.remove(currLine.size() - 1);
            return;
        }
        currNum = value;
        currLine.add(node.val);
        findPath(node.left, target, currLine, currNum);
        findPath(node.right, target, currLine, currNum);
        currLine.remove(currLine.size() -1);
    }
}
```

## <font color="orange">35、复杂链表的复制</font>

请实现 `copyRandomList` 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 `next` 指针指向下一个节点，还有一个 `random` 指针指向链表中的任意节点或者 `null`。

```
示例 1：
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
示例 2：
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
示例 3：
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
示例 4：
输入：head = []
输出：[]
解释：给定的链表为空（空指针），因此返回 null。

提示：
- -10000 <= Node.val <= 10000
- Node.random 为空（null）或指向链表中的节点
- 节点数目不超过 1000
```

**注意：**本题与主站 138 题相同：https://leetcode-cn.com/problems/copy-list-with-random-pointer/

{% notel orange 题解思路 %}

这里难点在于链表节点的值可能会重复，因此在复制节点时还需要保留顺序，否则没办法区分重复值的节点

最后学到了这样的方法，利用原链表的顺序来保存复制链表的顺序：

1. 将节点复制后，直接插到原节点后
2. 这样设置random时需要要原节点.random.next
3. 然后将链表分成两个，返回复制链表

{% endnotel %}

```java
class Solution {
    public Node copyRandomList(Node head) {
        // 1) 将1->2->3  ==>  1->1'->2->2'-3->3'
        if (head == null) return head;
        Node cur = head;
        while (cur != null) {
            Node newNode = new Node(cur.val);
            newNode.next = cur.next;
            cur.next = newNode;
            cur = newNode.next;
        }
        // 2）将 1，2，3的random 的给 1',2'.3' 例如：1 random 3 则 1' random 3'
        cur = head;
        while (cur != null) {
            if (cur.random == null) {
                cur.next.random = null;
            } else {
                cur.next.random = cur.random.next;
            }
            cur = cur.next.next;
        }
        // 3） 将2）得到的链表拆分成两个，一个是 1，2，3 另一个是 1',2',3'
        Node head2 = head.next;
        cur = head;
        while (cur.next != null) {
            Node temp = cur.next;
            cur.next = cur.next.next;
            cur = temp;
        }
        // 4）输出 1',2',3'
        return head2;
    }
}
```

## <font color="orange">36、二叉搜索树与双向链表</font>

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向

```
为了让您更好地理解问题，以下面的二叉搜索树为例：
      4
     / \
    2   5
   / \
  1   3
我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。
下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。
1-2-3-4-5
特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。
```

**注意：**本题与主站 426 题相同：https://leetcode-cn.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/

{% notel orange 题解思路 %}

观察链表的值，可以发现就是二叉树的中序遍历

因此我们只需要设置一个prev指针用于保存上一个节点

1. 执行中序遍历递归先遍历左子树，直到叶子节点
2. 叶子节点node.left = prev，prev.right = node， prev = node
3. 左子树遍历后，执行本节点
4. 右子树遍历
5. 从root向左向右找到首尾节点，按题目要求连接首尾节点，并返回首节点

{% endnotel %}

```java
class Solution {
    // 保存上一个节点
    private Node prev = null;

    public Node treeToDoublyList(Node root) {
        if(root == null){
            return null;
        }
        toList(root);
        // 寻找首尾节点，并连接
        Node left = root;
        while(left.left != null){
            left = left.left;
        }
        Node right = root;
        while(right.right != null){
            right = right.right;
        }
        left.left = right;
        right.right = left;
        return left;
    }

    public void toList(Node node){
        // 叶子节点直接连接
        if (node.left == null && node.right == null) {
            node.left = prev;
            if(prev != null){
                prev.right = node;
            }
            prev = node;
            return;
        }
        // 遍历左子树
        if(node.left != null){
            toList(node.left);
        }
        // 节点左子树完成后，连接本节点
        node.left = prev;
        if(prev != null){
            prev.right = node;
        }
        prev = node;
        // 遍历右子树
        if(node.right != null){
            toList(node.right);
        }
    }
}
```

## <font color="red">37、序列化二叉树</font>

请实现两个函数，分别用来序列化和反序列化二叉树。

你需要设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

**提示：**输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅 [LeetCode 序列化二叉树的格式](https://support.leetcode-cn.com/hc/kb/article/1567641/)。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。

```
输入：root = [1,2,3,null,null,4,5]
输出：[1,2,3,null,null,4,5]
```

注意：本题与主站 297 题相同：https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/

{% notel red 题解思路 %}

主要就是怎么样序列化在反序列化的时候方便，一般来说有前中后序中的两个就可以复原一个二叉树但很麻烦

另一个就是层序列，但要记录叶子节点信息

相比前中后序，层序列更便捷一些

{% endnotel %}

```java
public class Codec {
    int INF = -2000;
    TreeNode emptyNode = new TreeNode(INF);
    public String serialize(TreeNode root) {
        if (root == null) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        Deque<TreeNode> d = new ArrayDeque<>();
        d.addLast(root);
        while (!d.isEmpty()) {
            TreeNode poll = d.pollFirst();
            sb.append(poll.val + "_");
            if (!poll.equals(emptyNode)) {
                d.addLast(poll.left != null ? poll.left : emptyNode);
                d.addLast(poll.right != null ? poll.right : emptyNode);
            }
        }
        return sb.toString();
    }

    public TreeNode deserialize(String data) {
        if (data.equals("")) return null;

        String[] ss = data.split("_");
        int n = ss.length;
        TreeNode root = new TreeNode(Integer.parseInt(ss[0]));
        Deque<TreeNode> d = new ArrayDeque<>();
        d.addLast(root);
        for (int i = 1; i < n - 1; i += 2) {
            TreeNode poll = d.pollFirst();
            int a = Integer.parseInt(ss[i]), b = Integer.parseInt(ss[i + 1]);
            if (a != INF) {
                poll.left = new TreeNode(a);
                d.addLast(poll.left);
            }
            if (b != INF) {
                poll.right = new TreeNode(b);
                d.addLast(poll.right);
            }
        }
        return root;
    }
}
```

## <font color="orange">38、字符串的排列</font>

输入一个字符串，打印出该字符串中字符的所有排列。

你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。

```
示例:
输入：s = "abc"
输出：["abc","acb","bac","bca","cab","cba"]

限制：
1 <= s 的长度 <= 8
```

{% notel orange 题解思路 %}

刷了近40题，第一次遇到回溯法

{% endnotel %}

{% note success %}

### 知识点2、回溯法

回溯法，又叫试探法，是一种寻找**最优解**的**暴力搜寻法**。由于暴力，回溯法的**时间复杂度较高**，因此在比较一些数字较大的问题时，比如上次我们提到的最短路径问题等，运行时间一般比较长。

在回溯法中，深度优先搜索是一种很重要的工具——说到这是不是想起来上次的最短路径问题的DFS解法了？了解了DFS，就比较容易理解回溯法。

简单地介绍一下DFS，用一句话概括，就是“不撞南墙不回头”。（这句话也适用于回溯法）

它的基本思想是：

1. 某一种可能情况向前探索，并生成一个子节点。
2. 过程中，一旦发现原来的选择不符合要求，就**回溯**至父亲结点，然后重新选择另一方向，再次生成子结点，继续向前探索。
3. 如此反复进行，直至求得最优解。 

回溯法基本思想是：

1. 针对具体问题，定义问题的**解空间**；
2. 确定易于搜索的解空间结构（数据结构的选择）。
3. 一般以**DFS**的方式搜索解空间。
4. 在搜索过程中，可以使用**剪枝函数**等来优化算法。

{% endnote %}

```java
class Solution {
    List<String> rec;
    boolean[] vis;

    public String[] permutation(String s) {
        int n = s.length();
        rec = new ArrayList<>();
        vis = new boolean[n];
        char[] arr = s.toCharArray();
        Arrays.sort(arr);
        StringBuffer perm = new StringBuffer();
        backtrack(arr, 0, n, perm);
        int size = rec.size();
        String[] recArr = new String[size];
        for (int i = 0; i < size; i++) {
            recArr[i] = rec.get(i);
        }
        return recArr;
    }

    public void backtrack(char[] arr, int i, int n, StringBuffer perm) {
        if (i == n) {
            rec.add(perm.toString());
            return;
        }
        for (int j = 0; j < n; j++) {
            if (vis[j] || (j > 0 && !vis[j - 1] && arr[j - 1] == arr[j])) {
                continue;
            }
            vis[j] = true;
            perm.append(arr[j]);
            backtrack(arr, i + 1, n, perm);
            perm.deleteCharAt(perm.length() - 1);
            vis[j] = false;
        }
    }
}
```

## <font color="green">39、数组中出现次数超过一半的数字</font>

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

```
示例 1:
输入: [1, 2, 3, 2, 2, 2, 5, 4, 2]
输出: 2

限制：1 <= 数组长度 <= 50000
```

注意：本题与主站 169 题相同：https://leetcode-cn.com/problems/majority-element/

{% notel green 题解思路 %}

其实就是找众数，通常没刷过算法题的人，能想到的办法

- 用hashmap来统计数量，当有元素数量超过阈值(即数组长度一半)，即找到该元素

但Java的集合，基本数据类型需要使用包装类，每次执行数量加1都需要重建对象，会比较耗性能

随后跟据题意还可以这样解：

- 将数组排序，取数组中间的元素

如果用快排则复杂度为O(nlogn)

最后还有一种求众数的算法：摩尔投票

{% endnotel %}

{% note success %}

### 知识点3、Boyer-Moore 摩尔投票算法

**限定一定存在众数的情况**
把众数记为 +1，把其他数记为 -1，将它们全部加起来，显然和大于 0，从结果本身可以看出众数比其他数多。

1. 维护一个候选众数 candidate 和它出现的次数 count。初始时 candidate 可以为任意值，count 为 0；
2. 遍历数组 nums 中的所有元素，对于每个元素 x，在判断 x 之前，如果 count 的值为 0，我们先将 x 的值赋予candidate，随后我们判断 x：
   （1）如果 x 与 candidate 相等，那么计数器 count 的值增加 1；
   （2）如果 x 与 candidate 不等，那么计数器 count 的值减少 1。
3. 在遍历完成后，candidate 即为整个数组的众数。

```java
[7, 7, 5, 7, 5, 1 | 5, 7 | 5, 5, 7, 7 | 7, 7, 7, 7]
每一步遍历时 candidate 和 count 的值：

nums    :[7, 7, 5, 7, 5, 1 | 5, 7 | 5, 5, 7, 7 | 7, 7, 7, 7]
candidate:[7, 7, 7, 7, 7, 7 | 5, 5 | 5, 5, 5, 5 | 7, 7, 7, 7]
count:   [1, 2, 1, 2, 1, 0 | 1, 0 | 1, 2, 1, 0 | 1, 2, 3, 4]
```

{% endnote %}

```java
class Solution {
    public int majorityElement(int[] nums) {
        int count = 1;
        int candidate = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (candidate == nums[i]){
                count++;
            }else {
                count--;
                if (count == 0) {  //若count为0，更换候选人
                    candidate = nums[i];
                    count++;
                }
            }
        }
        return candidate;
    }
}
```

## <font color="green">40、最小的k个数</font>

输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

```
示例 1：
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]

示例 2：
输入：arr = [0,1,2,1], k = 1
输出：[0]

限制：
- 0 <= k <= arr.length <= 10000
- 0 <= arr[i] <= 10000
```

{% notel green 题解思路 %}

最简单的就是直接排序，然后取前k个数，但这样一来效率注定不高

因为题目并不要求我们返回的结果集要是有序的，也就是说我们白做了一部分活

有一个算法基于快排实现——快速选择，专门解决最大/小的k个数

{% endnotel %}

```java
class Solution {
    public int[] getLeastNumbers(int[] arr, int k) {
        if (k == 0 || arr.length == 0) {
            return new int[0];
        }
        // 最后一个参数表示我们要找的是下标为k-1的数
        return quickSearch(arr, 0, arr.length - 1, k - 1);
    }

    private int[] quickSearch(int[] nums, int lo, int hi, int k) {
        // 每快排切分1次，找到排序后下标为j的元素，如果j恰好等于k就返回j以及j左边所有的数；
        int j = partition(nums, lo, hi);
        if (j == k) {
            return Arrays.copyOf(nums, j + 1);
        }
        // 否则根据下标j与k的大小关系来决定继续切分左段还是右段。
        return j > k? quickSearch(nums, lo, j - 1, k): quickSearch(nums, j + 1, hi, k);
    }

    // 快排切分，返回下标j，使得比nums[j]小的数都在j的左边，比nums[j]大的数都在j的右边。
    private int partition(int[] nums, int lo, int hi) {
        int v = nums[lo];
        int i = lo, j = hi + 1;
        while (true) {
            while (++i <= hi && nums[i] < v);
            while (--j >= lo && nums[j] > v);
            if (i >= j) {
                break;
            }
            int t = nums[j];
            nums[j] = nums[i];
            nums[i] = t;
        }
        nums[lo] = nums[j];
        nums[j] = v;
        return j;
    }
}
```