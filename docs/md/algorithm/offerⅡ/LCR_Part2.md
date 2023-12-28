---
title: LCR_Part.2
date: 2023-09-05 09:58:32
categories: [算法, 剑指offerⅡ]
excerpt: LCR(又名剑指offer2)系列算法题，第二部分——21至40题
---

## <font color="orange">21、删除链表的倒数第N个结点</font>

给定一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

```
示例 1：
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]

示例 2：
输入：head = [1], n = 1
输出：[]

示例 3：
输入：head = [1,2], n = 1
输出：[1]
```

**提示：**

- 链表中结点的数目为 `sz`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

**进阶：**能尝试使用一趟扫描实现吗？

注意：本题与主站 19 题相同： https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/

{% notel orange 题解思路 %}
因为是倒数第N的，而链表的长度是未知的，那么想要一次遍历就得使用双指针：

1. 大小指针初始化均指向head
2. 大指针先移动n次
3. 大小指针一直移动，直到大指针到最后一个结点(next为null)
4. 此时小指针就是要删除结点的前置结点，修改next指针即可

但是提交后遇到了问题，head=[1,2], n=2，这组用例，我们执行第3步是就会空指针(因为要判断大指针的next，而大指针此时已经为null了)

但我们能发现，如果出现这种情况，那么就是删除首结点，因此额外增加一个判断即可
{% endnotel %}
```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode p1 = head, p2 = head;
        for (int i = 0; i < n; i++) {
            p2 = p2.next;
        }
        // p2为空，说明已经最后一个节点了，但此时还要往后，说明要移除首节点
        if(p2 == null){
            return head.next;
        }
        while(p2.next != null){
            p1 = p1.next;
            p2 = p2.next;
        }
        p1.next = p1.next.next;
        return head;
    }
}
```

## <font color="orange">22、环形链表Ⅱ</font>

给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 `next` 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 `null`。

为了表示给定链表中的环，我们使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 `pos` 是 `-1`，则在该链表中没有环。**注意，`pos` 仅仅是用于标识环的情况，并不会作为参数传递到函数中。**

**说明：**不允许修改给定的链表。

```text
示例 1：
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。

示例 2：
输入：head = [1,2], pos = 0 
输出：返回索引为 0 的链表节点 
解释：链表中有一个环，其尾部连接到第一个节点。

示例 3：
输入：head = [1], pos = -1 
输出：返回 null 
解释：链表中没有环。
```



![img](../../../images/algorithm/leetcode/LCR22.png)

**提示：**

- 链表中节点的数目范围在范围 [0, 10^4] 内
- -10^5 <= Node.val <= 10^5
- `pos` 的值为 `-1` 或者链表中的一个有效索引

**进阶：**是否可以使用 `O(1)` 空间解决此题？

注意：本题与主站 142 题相同： https://leetcode-cn.com/problems/linked-list-cycle-ii/

{% notel orange 题解思路 %}

第一想法：遍历链表并用哈希表保存，直到出现重复元素(找到环的头结点)或者遍历到null(没有环)，但是这不符合进阶的要求，因此需要找别的方案

这类题很容易联想到双指针，这里想到了快慢指针，如果有环，那么快慢指针必定能相遇，反之则没有环。到这一步还没有结束，我们只能知道有没有环确不知道环头在哪！因此快慢指针这个方案一度被我否了

最后没想法看了别人的思路，通过推导可以得出快慢指针到环头的距离和首结点到环头的距离一样。。。

<font color="red">针对这类有隐藏规则的题，要么有大量题的积累，要么就得有推导的意识和思路，后续需要多加练习</font>

{% endnotel %}

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null) {
            return null;
        }
        ListNode p1 = head, fast = head, slow = head;
        do {
            if (fast.next == null) {
                return null;
            }
            fast = fast.next;
            if (fast.next == null) {
                return null;
            }
            fast = fast.next;
            slow = slow.next;
        } while (fast != slow);
        while (fast != p1) {
            fast = fast.next;
            p1 = p1.next;
        }
        return p1;
    }
}
```

## <font color="green">23、相交链表</font>

给定两个单链表的头节点 `headA` 和 `headB` ，请找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 `null` 。

题目数据 **保证** 整个链式结构中不存在环。

**注意**，函数返回结果后，链表必须 **保持其原始结构** 。

```
示例 1：
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'
解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。

示例 2：
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2 
输出：null 
解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。 
由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。 
这两个链表不相交，因此返回 null 。
```

**提示：**

- `listA` 中节点数目为 `m`
- `listB` 中节点数目为 `n`
- 0 <= m, n <= 3 * 10^4
- 1 <= Node.val <= 10^5
- `0 <= skipA <= m`
- `0 <= skipB <= n`
- 如果 `listA` 和 `listB` 没有交点，`intersectVal` 为 `0`
- 如果 `listA` 和 `listB` 有交点，`intersectVal == listA[skipA + 1] == listB[skipB + 1]`

**进阶：**能否设计一个时间复杂度 `O(n)` 、仅用 `O(1)` 内存的解决方案？

注意：本题与主站 160 题相同：https://leetcode-cn.com/problems/intersection-of-two-linked-lists/

{% notel green 题解思路 %}

遇到过的题，双指针遍历两遍，指针A遍历链表A再遍历链表B，指针B相反

不论是否链表存在相交，最终两个指针都会在同一个结点相遇(如果不相交就都为null)

{% endnotel %}

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode p1 = headA, p2 = headB;
        while(p1 != p2){
            if(p1 == null){
                p1 = headB;
            } else {
                p1 = p1.next;
            }
            if(p2 == null){
                p2 = headA;
            } else {
                p2 = p2.next;
            }
        }
        return p1;
    }
}
```

## <font color="green">24、倒转链表</font>

给定单链表的头节点 `head` ，请反转链表，并返回反转后的链表的头节点。

```
示例 1：
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]

示例 2：
输入：head = [1,2] 
输出：[2,1]

示例 3：
输入：head = []
输出：[]
```

**提示：**

- 链表中节点的数目范围是 `[0, 5000]`
- `-5000 <= Node.val <= 5000`

**进阶：**链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？

注意：本题与主站 206 题相同： https://leetcode-cn.com/problems/reverse-linked-list/

{% notel green 题解思路 %}

很基本的链表题，题目要求用迭代或者递归，这里就用递归来做：

1. 先借助递归逐个调用到尾结点，记录为新的头指针
2. 在归的过程中设置next指针即可
{% endnotel %}

```java
class Solution {
    ListNode newHead;
    public ListNode reverseList(ListNode head) {
        if(head == null){
            return head;
        }
        reverse(head);
        return newHead;
    }

    private ListNode reverse(ListNode node){
        if(node.next == null){
            newHead = node;
            return node;
        }
        ListNode reverse = reverse(node.next);
        reverse.next = node;
        node.next = null;
        return node;
    }
}
```

## <font color="orange">25、两数相加Ⅱ</font>

给定两个 **非空链表** `l1`和 `l2` 来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。

可以假设除了数字 0 之外，这两个数字都不会以零开头。

```
示例1：
输入：l1 = [7,2,4,3], l2 = [5,6,4]
输出：[7,8,0,7]

示例2：
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[8,0,7]

示例3：
输入：l1 = [0], l2 = [0]
输出：[0]
```

**提示：**

- 链表的长度范围为` [1, 100]`
- `0 <= node.val <= 9`
- 输入数据保证链表代表的数字无前导 0

**进阶：**如果输入链表不能修改该如何处理？换句话说，不能对列表中的节点进行翻转。

注意：本题与主站 445 题相同：https://leetcode-cn.com/problems/add-two-numbers-ii/

{% notel orange 题解思路 %}

不允许对原链表做操作，也就是不能翻转链表，就只能借助栈来做。需要特别注意进位问题

{% endnotel %}

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Deque<Integer> stack1 = new ArrayDeque<Integer>();
        Deque<Integer> stack2 = new ArrayDeque<Integer>();
        while (l1 != null) {
            stack1.push(l1.val);
            l1 = l1.next;
        }
        while (l2 != null) {
            stack2.push(l2.val);
            l2 = l2.next;
        }
        int carry = 0;
        ListNode ans = null;
        while (!stack1.isEmpty() || !stack2.isEmpty() || carry != 0) {
            int a = stack1.isEmpty() ? 0 : stack1.pop();
            int b = stack2.isEmpty() ? 0 : stack2.pop();
            int cur = a + b + carry;
            carry = cur / 10;
            cur %= 10;
            ListNode curnode = new ListNode(cur);
            curnode.next = ans;
            ans = curnode;
        }
        return ans;
    }
}
```

## <font color="orange">26、重排链表</font>

给定一个单链表 `L` 的头节点 `head` ，单链表 `L` 表示为：

` L0 → L1 → … → Ln-1 → Ln `
请将其重新排列后变为：</font>

`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`

不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

```
示例 1:
输入: head = [1,2,3,4]
输出: [1,4,2,3]

示例 2:
输入: head = [1,2,3,4,5]
输出: [1,5,2,4,3]
```

提示：
- 链表的长度范围为 `[1, 5 * 10^4]`
- `1 <= node.val <= 1000`

注意：本题与主站 143 题相同：https://leetcode-cn.com/problems/reorder-list/

{% notel orange 题解思路 %}

一种思路是用栈保存所有元素，然后再次从head遍历，取栈中的一半元素插入到目标位置。这个想法的问题在于需要使用到JDK提供的容器，往往会涉及自动扩容等问题导致算法耗时偏高。

看到一种很巧妙的解法，就按照题目的思路走：

- 先找到链表中点
- 再将后半段反转
- 再将链表合并

虽然题目的要求看上去非常难，但是拆分为3步之后，每一步都是链表的基本操作了

{% endnotel %}

```java
class Solution {
    public void reorderList(ListNode head) {
        if (head.next == null || head.next.next == null) {
            return;
        }
        ListNode mid = getMiddle(head);
        ListNode cur1 = mid.next;
        mid.next = null;
        cur1 = reverse(cur1);
        ListNode cur = head;
        merge(cur, cur1);
    }
    
    /**
     * 获取中间元素，使用快慢指针，慢指针每次移动一个，快指针每次移动两个
     */
    private ListNode getMiddle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null) {
            fast = fast.next;
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
    
    /**
     * 翻转链表
     */
    private ListNode reverse(ListNode head) {
        ListNode pre = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode temp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = temp;
        }
        return pre;
    }

    /**
     * 合并链表
     */
    private void merge(ListNode cur, ListNode cur1) {
        ListNode l1;
        ListNode l2;
        while (cur != null && cur1 != null) {
            l1 = cur.next;
            l2 = cur1.next;
            cur.next = cur1;
            cur = l1;
            cur1.next = l1;
            cur1 = l2;
        }
    }    
}
```

## <font color="green">27、回文链表</font>

如果一个链表是回文，那么链表节点序列从前往后看和从后往前看是相同的。

```
示例 1：
输入: head = [1,2,3,3,2,1]
输出: true

示例 2：
输入: head = [1,2]
输出: false
```

**提示：**

- 链表 L 的长度范围为 [1, 10^5]
- `0 <= node.val <= 9`

**进阶：**能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

注意：本题与主站 234 题相同：https://leetcode-cn.com/problems/palindrome-linked-list/

{% notel green 题解思路 %}

回文是很常见的一类题，通常是用首尾双指针，但这里是单向链表。然后想到将链表转化为数组，这样就具备了往前遍历的能力，然而时间复杂度为O(n)，但空间复杂度却不符合O(1)的要求

空间复杂度的要求，也就是不能用额外空间来保存链表的节点，也就是说只能操作链表本身。那么还是使用上一题的思路，先找中间结点，反转后段链表，在比较前后段链表是否相等

{% endnotel %}

```java
class Solution {
    public boolean isPalindrome(ListNode head) {
        // 链表只有一个结点，是回文链表
        if (head.next == null) {
            return true;
        }
        // 找到链表中点
        ListNode mid = getMiddle(head);
        // 取中点的next做后段链表的头结点
        // 链表为偶数情况，两个链表长度相等；为奇数情况，前段链表长度比后段大1
        ListNode rear = mid.next;
        mid.next = null;
        rear = reverse(rear);
        return check(head, rear);
    }

    /**
     * 取链表的中间结点，奇数个即为中间结点，偶数个即为两个中间结点的前者
     */
    private ListNode getMiddle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null) {
            fast = fast.next;
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }

    /**
     * 倒转链表
     */
    private ListNode reverse(ListNode head) {
        ListNode pre = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode temp = cur.next;
            cur.next = pre;
            pre = cur;
            cur = temp;
        }
        return pre;
    }

    /**
     * 校验两个链表是否符合回文串
     */
    private boolean check(ListNode front, ListNode rear) {
        while (true) {
            // 当前两个结点都不会空，比较值是否相等，如果不相等就不是回文串
            if (front != null && rear != null) {
                if (front.val != rear.val) {
                    return false;
                }
            } else if (front != null && front.next == null) {
                // 如果前段链表当前不会空，而后段链表当前为空，那么判断当前是否是前端链表的最后一个结点，如果是则是奇数的回文串
                return true;
            } else {
                // 两者都为空，则为偶数的回文串
                return front == null && rear == null;
            }
            front = front.next;
            rear = rear.next;
        }
    }
}
```

## <font color="orange">28、扁平化多级双向链表</font>

多级双向链表中，除了指向下一个节点和前一个节点指针之外，它还有一个子链表指针，可能指向单独的双向链表。这些子列表也可能会有一个或多个自己的子项，依此类推，生成多级数据结构，如下面的示例所示。

给定位于列表第一级的头节点，请扁平化列表，即将这样的多级双向链表展平成普通的双向链表，使所有结点出现在单级双链表中。

```
示例 1：
输入：head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
输出：[1,2,3,7,8,11,12,9,10,4,5,6]
解释：

示例 2：
输入：head = [1,2,null,3]
输出：[1,3,2]
解释：
输入的多级列表如下图所示：
  1---2---NULL
  |
  3---NULL
  
示例 3：
输入：head = []
输出：[]
```

**如何表示测试用例中的多级链表？**

以 **示例 1** 为例：

```
 1---2---3---4---5---6--NULL
       |
       7---8---9---10--NULL
          |
          11--12--NULL
```

序列化其中的每一级之后：

```
[1,2,3,4,5,6,null]
[7,8,9,10,null]
[11,12,null]
```

为了将每一级都序列化到一起，我们需要每一级中添加值为 null 的元素，以表示没有节点连接到上一级的上级节点。

```
[1,2,3,4,5,6,null]
[null,null,7,8,9,10,null]
[null,11,12,null]
```

合并所有序列化结果，并去除末尾的 null 。

```
[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
```

**提示：**

- 节点数目不超过 `1000`
- `1 <= Node.val <= 10^5`

注意：本题与主站 430 题相同： https://leetcode-cn.com/problems/flatten-a-multilevel-doubly-linked-list/

{% notel orange 题解思路 %}

从题目要求中能看出是深度优先遍历，但这里是链表不是二叉树，一旦进入某个结点的child结点就无法回到该结点的next结点了

因此需要将结点保存起来，这里选用了栈，因为符合深度遍历的特征

{% endnotel %}

```java
class Solution {
    public Node flatten(Node head) {
        // 空链表特殊情况处理
        if (head == null) {
            return null;
        }
        Stack<Node> stack = new Stack<>();
        stack.push(head);
        // 记录上一个结点，用于后续结点的prev赋值
        Node node = null;
        while (!stack.isEmpty()) {
            Node curr = stack.pop();
            curr.prev = node;
            // next不为空，将next入栈
            if (curr.next != null) {
                stack.push(curr.next);
            }
            // child不为空，将child入栈，并将child指针赋值null
            if (curr.child != null) {
                stack.push(curr.child);
                curr.child = null;
            }
            // 将next指针赋值为当前栈的栈顶
            if (!stack.isEmpty()) {
                curr.next = stack.peek();
            }
            node = curr;
        }
        return head;
    }
}
```

## <font color="orange">29、循环有序列表的插入</font>

给定**循环单调非递减列表**中的一个点，写一个函数向这个列表中插入一个新元素 `insertVal` ，使这个列表仍然是循环升序的。

给定的可以是这个列表中任意一个顶点的指针，并不一定是这个列表中最小元素的指针。

如果有多个满足条件的插入位置，可以选择任意一个位置插入新的值，插入后整个列表仍然保持有序。

如果列表为空（给定的节点是 `null`），需要创建一个循环有序列表并返回这个节点。否则。请返回原先给定的节点。

![img](../../../images/algorithm/leetcode/example_1_before_65p.jpg) ![img](../../../images/algorithm/leetcode/example_1_after_65p.jpg)

```
示例 1：
输入：head = [3,4,1], insertVal = 2
输出：[3,4,1,2]
解释：在上图中，有一个包含三个元素的循环有序列表，你获得值为 3 的节点的指针，我们需要向表中插入元素 2 。新插入的节点应该在 1 和 3 之间，插入之后，整个列表如上图所示，最后返回节点 3 。

示例 2：
输入：head = [], insertVal = 1
输出：[1]
解释：列表为空（给定的节点是 null），创建一个循环有序列表并返回这个节点。

示例 3：
输入：head = [1], insertVal = 0
输出：[1,0]
```

**提示：**

- `0 <= Number of Nodes <= 5 * 10^4`
- `-10^6 <= Node.val <= 10^6`
- `-10^6 <= insertVal <= 10^6`

注意：本题与主站 708 题相同： https://leetcode-cn.com/problems/insert-into-a-sorted-circular-linked-list/

{% notel orange 题解思路 %}

主要就是插入条件的判断，有很多种情况。最开始就想着快慢指针，目标值小于快指针大于慢指针即可

但提交后又陆续遇到目标值是新最大值、新最小值等等情况，这种很难一次就想到，个人认为更偏向于考验debug的能力

{% endnotel %}

```java
class Solution {
    public Node insert(Node head, int insertVal) {
        if (head == null) {
            Node node = new Node(insertVal);
            node.next = node;
            return node;
        }
        Node slow = head;
        Node fast = slow.next;
        while (true) {
            /*
             * 第一部分条件，慢结点比快结点大，即到了非递减列表的边界，此时如果元素大于等于最大值或者小于等于最小值，视为新的临界点插入
             * 第二部分条件，元素大于等于慢结点，小于等于快结点说明是正常顺序找到了位置，插入
             * 第三部分条件，快结点等于头结点，说明此时已经找了一圈，仍然没有找到，那么就插在链表尾部
             */
            if ((slow.val > fast.val && (insertVal <= fast.val || insertVal >= slow.val))
                    || (insertVal >= slow.val && insertVal <= fast.val)
                    || fast == head) {
                Node node = new Node(insertVal, fast);
                slow.next = node;
                break;
            }
            slow = slow.next;
            fast = fast.next;
        }
        return head;
    }
}
```

## <font color="orange">30、O(1)时间插入、删除和获取随机元素</font>

设计一个支持在*平均* 时间复杂度 **O(1)** 下，执行以下操作的数据结构：

- `insert(val)`：当元素 `val` 不存在时返回 `true` ，并向集合中插入该项，否则返回 `false` 。
- `remove(val)`：当元素 `val` 存在时返回 `true` ，并从集合中移除该项，否则返回 `false` 。
- `getRandom`：随机返回现有集合中的一项。每个元素应该有 **相同的概率** 被返回。

```
示例 :
输入: inputs = ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
[[], [1], [2], [2], [], [1], [2], []]
输出: [null, true, false, true, 2, true, false, 2]
解释:
RandomizedSet randomSet = new RandomizedSet();  // 初始化一个空的集合
randomSet.insert(1); // 向集合中插入 1 ， 返回 true 表示 1 被成功地插入
randomSet.remove(2); // 返回 false，表示集合中不存在 2 
randomSet.insert(2); // 向集合中插入 2 返回 true ，集合现在包含 [1,2] 
randomSet.getRandom(); // getRandom 应随机返回 1 或 2 
randomSet.remove(1); // 从集合中移除 1 返回 true 。集合现在包含 [2] 
randomSet.insert(2); // 2 已在集合中，所以返回 false 
randomSet.getRandom(); // 由于 2 是集合中唯一的数字，getRandom 总是返回 2 
```

**提示：**

- `-2^31 <= val <= 2^31 - 1`
- 最多进行` 2 * 105` 次 `insert` ， `remove` 和 `getRandom` 方法调用
- 当调用 `getRandom` 方法时，集合中至少有一个元素

注意：本题与主站 380 题相同：https://leetcode-cn.com/problems/insert-delete-getrandom-o1/

{% notel orange 题解思路 %}

第一想法是没有思路，因为set不能实现随机访问，list无法做到O(1)删除。

于是学习了题解，使用map而不是set，map保存元素在list中的下标。这一点是我没有想到的，通过map让list也具备O(1)的查询能力

此外，还有一个细节就是删除元素时，如果不是尾部元素不要直接移除，而是将尾部元素替换删除元素，再删除尾部元素，这样可以避免执行数组移位操作

{% endnotel %}

```java
class RandomizedSet {

    List<Integer> list;
    Map<Integer, Integer> map;
    Random random;

    /** Initialize your data structure here. */
    public RandomizedSet() {
        list = new ArrayList<>();
        map = new HashMap<>();
        random = new Random();
    }
    
    /** Inserts a value to the set. Returns true if the set did not already contain the specified element. */
    public boolean insert(int val) {
        if (map.containsKey(val)) {
            return false;
        }
        list.add(val);
        map.put(val, list.size() - 1);
        return true;
    }
    
    /** Removes a value from the set. Returns true if the set contained the specified element. */
    public boolean remove(int val) {
        if (!map.containsKey(val)) {
            return false;
        }
        Integer index = map.get(val);
        // 如果要删除的就是尾部元素，则无需做元素移动操作
        if (index != list.size() - 1) {
            Integer last = list.get(list.size() - 1);
            map.put(last, index);
            list.set(index, last);
        }
        map.remove(val);
        list.remove(list.size() - 1);
        return true;
    }
    
    /** Get a random element from the set. */
    public int getRandom() {
        int index = random.nextInt(list.size());
        return list.get(index);
    }
}
```

## <font color="orange">31、LRU缓存</font>

运用所掌握的数据结构，设计和实现一个 [LRU (Least Recently Used，最近最少使用) 缓存机制](https://baike.baidu.com/item/LRU) 。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以正整数作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
- `void put(int key, int value)` 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

**示例：**

```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]
解释
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
```

**提示：**

- `1 <= capacity <= 3000`
- `0 <= key <= 10000`
- `0 <= value <= 10^5`
- 最多调用 `2 * 10^5` 次 `get` 和 `put`

**进阶**：是否可以在 `O(1)` 时间复杂度内完成这两种操作？

注意：本题与主站 146 题相同：https://leetcode-cn.com/problems/lru-cache/

{% notel orange 题解思路 %}

和30题一样，都是对数据结构的综合运用，这类题遇到很少，也是没有太多思路

了解到LinkedHashMap可以实现，只需要重写一个方法，但既然是在刷题练手，过度依赖JDK提供的容器是没意义的

又了解到，通过哈希表+双向链表可以实现LRU的效果

- 哈希表中存放key和链表结点Node
- 链表来实现最近最少使用，即最新使用的放到链表头，那么尾部结点就是最近最少使用的结点

和30题的思路其实类似，都是借助哈希表的O(1)查找使得原本查找需要O(n)的数据结构也拥有O(1)的能力

{% endnotel %}

```java
public class LRUCache {
    /**
     * 实际容量
     */
    private int size = 0;
    /**
     * 最大容量
     */
    private final int capacity;
    /**
     * 存储所有元素的map
     */
    private final Map<Integer, LinkedNode> map;
    /**
     * 维护最近最少使用顺序链表的首尾结点
     */
    private final LinkedNode head;
    private final LinkedNode tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new LinkedNode();
        this.tail = new LinkedNode();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        LinkedNode node = map.get(key);
        if(node == null){
            return -1;
        }
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        LinkedNode node = map.get(key);
        if (node == null) {
            LinkedNode newNode = new LinkedNode(key, value);
            if(size >= capacity){
                LinkedNode removeNode = tail.prev;
                map.remove(removeNode.key);
                removeTail(removeNode);
                size--;
            }
            map.put(key, newNode);
            addToHead(newNode);
            size++;
        } else {
            node.value = value;
            moveToHead(node);
        }
    }

    private void moveToHead(LinkedNode node){
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
        node.prev = head;
    }

    private void addToHead(LinkedNode node){
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
        node.prev = head;
    }

    private void removeTail(LinkedNode node){
        node.prev.next = tail;
        tail.prev = node.prev;
    }
}

class LinkedNode {
    int key;
    int value;
    LinkedNode prev;
    LinkedNode next;
    public LinkedNode(){}
    public LinkedNode(int key, int value) {
        this.key = key;
        this.value = value;
    }
}
```

## <font color="green">32、有效的字母异位词</font>

给定两个字符串 `s` 和 `t` ，编写一个函数来判断它们是不是一组变位词（字母异位词）。

**注意：**若 `s` 和 `t` 中每个字符出现的次数都相同且**字符顺序不完全相同**，则称 `s` 和 `t` 互为变位词（字母异位词）。

```
示例 1:
输入: s = "anagram", t = "nagaram"
输出: true

示例 2:
输入: s = "rat", t = "car"
输出: false

示例 3:
输入: s = "a", t = "a"
输出: false
```

**提示:**

- `1 <= s.length, t.length <= 5 * 10^4`
- `s` and `t` 仅包含小写字母

**进阶:** 如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？

注意：本题与主站 242 题相似（字母异位词定义不同）：https://leetcode-cn.com/problems/valid-anagram/

{% notel green 题解思路 %}

第一种思路是利用哈希

1. 创建一个长度为26的数组，下标依次对应abcd...
2. 然后遍历字符串s，将s中出现的字符，依次找到数组中对应位置并+1
3. 遍历字符串t，将t中出现的字符，依次找到数组中对应位置并-1，最终如果数组中所有元素都为0则说明是异位词

当前前提是两个字符串不是相等的

第二种思路是排序，将字符排序后比较是否相等即可

而两种方案比较，哈希时间复杂度是O(n)，排序时间复杂度为O(nlogn)

因此第一种方案更佳

{% endnotel %}

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.equals(t) || s.length() != t.length()) {
            return false;
        }
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < t.length(); i++) {
            counts[t.charAt(i) - 'a']--;
        }
        for (int count : counts) {
            if (count != 0) {
                return false;
            }
        }
        return true;
    }
}
```

## <font color="orange">33、字母异位词分组</font>

给定一个字符串数组 `strs` ，将 **变位词** 组合在一起。 可以按任意顺序返回结果列表。

**注意：**若两个字符串中每个字符出现的次数都相同，则称它们互为变位词。

```
示例 1:
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

示例 2:
输入: strs = [""]
输出: [[""]]

示例 3:
输入: strs = ["a"]
输出: [["a"]]
```

**提示：**

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` 仅包含小写字母

注意：本题与主站 49 题相同： https://leetcode-cn.com/problems/group-anagrams/

{% notel orange 题解思路 %}

算是第32题的加强版，也就是可以照搬基本逻辑，使用数组来记录字符出现次数

区别在于：不能使用减法了来判断了，需要将每个字符串的数组都计算出来

原本的想法是将每个分区的数组保存到一个List中，两个List下标相对应，这样每个字符串的数组先和已经分区了的比较，然后跟据比较结果执行存入已有分区或者另建分区

但是效率很差平均500ms，分析后发现，比较这一步耗时很大，其时间复杂度为O(n^2)

于是用哈希来优化key保存数组转化的字符串，value为分区list，把时间复杂度降为O(n)，以后需要注意能用hash的绝对不要遍历

{% endnotel %}

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String str : strs) {
            int[] counts = new int[26];
            int length = str.length();
            for (int i = 0; i < length; i++) {
                counts[str.charAt(i) - 'a']++;
            }
            // 将每个出现次数大于 0 的字母和出现次数按顺序拼接成字符串，作为哈希表的键
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < 26; i++) {
                if (counts[i] != 0) {
                    sb.append((char) ('a' + i));
                    sb.append(counts[i]);
                }
            }
            String key = sb.toString();
            List<String> list = map.getOrDefault(key, new ArrayList<>());
            list.add(str);
            map.put(key, list);
        }
        return new ArrayList<>(map.values());
    }
}
```

## <font color="green">34、验证外星语词典</font>

某种外星语也使用英文小写字母，但可能顺序 `order` 不同。字母表的顺序（`order`）是一些小写字母的排列。

给定一组用外星语书写的单词 `words`，以及其字母表的顺序 `order`，只有当给定的单词在这种外星语中按字典序排列时，返回 `true`；否则，返回 `false`。

```
示例 1：
输入：words = ["hello","leetcode"], order = "hlabcdefgijkmnopqrstuvwxyz"
输出：true
解释：在该语言的字母表中，'h' 位于 'l' 之前，所以单词序列是按字典序排列的。

示例 2：
输入：words = ["word","world","row"], order = "worldabcefghijkmnpqstuvxyz"
输出：false
解释：在该语言的字母表中，'d' 位于 'l' 之后，那么 words[0] > words[1]，因此单词序列不是按字典序排列的。

示例 3：
输入：words = ["apple","app"], order = "abcdefghijklmnopqrstuvwxyz"
输出：false
解释：当前三个字符 "app" 匹配时，第二个字符串相对短一些，然后根据词典编纂规则 "apple" > "app"，因为 'l' > '∅'，其中 '∅' 是空白字符，定义为比任何其他字符都小（更多信息）。
```

**提示：**

- `1 <= words.length <= 100`
- `1 <= words[i].length <= 20`
- `order.length == 26`
- 在 `words[i]` 和 `order` 中的所有字符都是英文小写字母。

注意：本题与主站 953 题相同： https://leetcode-cn.com/problems/verifying-an-alien-dictionary/

{% notel green 题解思路 %}

首先将order转化为哈希表减少查询耗时

然后依次两两比对，如果前字符串出现字符值大于后字符串，或者两者相等长度都一致，且前字符串长度大于后字符串时，返回false

遍历完成未出现上述情况，返回true

{% endnotel %}

```java
class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        if (words.length <= 1) {
            return true;
        }
        Map<Character, Integer> map = new HashMap<>(32);
        char[] orderChars = order.toCharArray();
        for (int i = 0; i < orderChars.length; i++) {
            map.put(orderChars[i], i);
        }
        String lastStr = words[0];
        next:
        for (int i = 1; i < words.length; i++) {
            String str = words[i];
            int length = Math.min(lastStr.length(), str.length());
            for (int j = 0; j < length; j++) {
                if (lastStr.charAt(j) == str.charAt(j)) {
                    continue;
                }
                if (map.get(lastStr.charAt(j)) > map.get(str.charAt(j))) {
                    return false;
                } else {
                    lastStr = str;
                    continue next;
                }
            }
            if (lastStr.length() > str.length()) {
                return false;
            }
        }
        return true;
    }
}
```

## <font color="orange">35、最小时间差</font>

给定一个 24 小时制（小时:分钟 **"HH:MM"**）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。

```
示例 1：
输入：timePoints = ["23:59","00:00"]
输出：1

示例 2：
输入：timePoints = ["00:00","23:59","00:00"]
输出：0
```

**提示：**

- `2 <= timePoints <= 2 * 10^4`
- `timePoints[i]` 格式为 **"HH:MM"**

注意：本题与主站 539 题相同： https://leetcode-cn.com/problems/minimum-time-difference/

{% notel orange 题解思路 %}

首先如果不排序的话，那么是O(n^2)，排序的话是O(nlogn)+O(n)，所以先排序效果会更好一些

排序后就是相邻两个元素，转化成分钟数后两两比较(不要漏掉首尾元素比较)，需要注意分钟差不是两者相减即可：

如23：59和00：00，即1439和0

两者的相隔分钟数应该是min(1439-0, 0+1440-1439) = 1

{% endnotel %}

```java
class Solution {
    public int findMinDifference(List<String> timePoints) {
        timePoints.sort(String::compareTo);
        int last = formatMinute(timePoints.get(0));
        int lastMinute = formatMinute(timePoints.get(timePoints.size() - 1));
        int min = subtractTime(last, lastMinute);
        for (int i = 1; i < timePoints.size(); i++) {
            int minute = formatMinute(timePoints.get(i));
            int subtractTime = subtractTime(last, minute);
            if (subtractTime == 0) {
                return 0;
            }
            if (subtractTime < min) {
                min = subtractTime;
            }
            last = minute;
        }
        return min;
    }

    private int formatMinute(String time) {
        int hour = Integer.parseInt(time.substring(0, 2));
        int minute = Integer.parseInt(time.substring(3, 5));
        return hour * 60 + minute;
    }

    public int subtractTime(int time1, int time2) {
        return Math.min(time2 - time1, time1 + 1440 - time2);
    }
}
```

## <font color="orange">36、逆波兰表达式求值</font>

根据[ 逆波兰表示法](https://baike.baidu.com/item/逆波兰式/128437)，求该后缀表达式的计算结果。

有效的算符包括 `+`、`-`、`*`、`/` 。每个运算对象可以是整数，也可以是另一个逆波兰表达式。

**说明：**

- 整数除法只保留整数部分。
- 给定逆波兰表达式总是有效的。换句话说，表达式总会得出有效数值且不存在除数为 0 的情况。

```
示例 1：
输入：tokens = ["2","1","+","3","*"]
输出：9
解释：该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9

示例 2：
输入：tokens = ["4","13","5","/","+"]
输出：6
解释：该算式转化为常见的中缀算术表达式为：(4 + (13 / 5)) = 6
```

**提示：**

- `1 <= tokens.length <= 10^4`
- `tokens[i]` 要么是一个算符（`"+"`、`"-"`、`"*"` 或 `"/"`），要么是一个在范围 `[-200, 200]` 内的整数

**逆波兰表达式：**

逆波兰表达式是一种后缀表达式，所谓后缀就是指算符写在后面。

- 平常使用的算式则是一种中缀表达式，如 `( 1 + 2 ) * ( 3 + 4 )` 。
- 该算式的逆波兰表达式写法为 `( ( 1 2 + ) ( 3 4 + ) * )` 。

逆波兰表达式主要有以下两个优点：

- 去掉括号后表达式无歧义，上式即便写成 `1 2 + 3 4 + * `也可以依据次序计算出正确结果。
- 适合用栈操作运算：遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中。

注意：本题与主站 150 题相同： https://leetcode-cn.com/problems/evaluate-reverse-polish-notation/

{% notel orange 题解思路 %}

跟据示例，尤其是示例2，很明显符合栈的特征：

当遇到数字时入栈，遇到运算符则取栈顶两个元素，执行响应运算并将结果压回栈

注意尤其是除法和减法，不要写错运算数顺序

这里还发现JDK12一个语法: 这样写可以不加break，当然得是JDK12以上版本

```java
switch (token) {
    case "+" -> {
        Integer second = stack.pop();
        Integer first = stack.pop();
        stack.push(first + second);
    }
}
```

{% endnotel %}

```java
class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        for (String token : tokens) {
            switch (token) {
                case "+": {
                    Integer second = stack.pop();
                    Integer first = stack.pop();
                    stack.push(first + second);
                    break;
                }
                case "-": {
                    Integer second = stack.pop();
                    Integer first = stack.pop();
                    stack.push(first - second);
                    break;
                }
                case "*": {
                    Integer second = stack.pop();
                    Integer first = stack.pop();
                    stack.push(first * second);
                    break;
                }
                case "/": {
                    Integer second = stack.pop();
                    Integer first = stack.pop();
                    stack.push(first / second);
                    break;
                }
                default: {
                    stack.push(Integer.valueOf(token));
                }
            }
        }
        return stack.peek();
    }
}
```

## <font color="orange">37、行星碰撞</font>

给定一个整数数组 `asteroids`，表示在同一行的小行星。

对于数组中的每一个元素，其绝对值表示小行星的大小，正负表示小行星的移动方向（正表示向右移动，负表示向左移动）。每一颗小行星以相同的速度移动。

找出碰撞后剩下的所有小行星。碰撞规则：两个行星相互碰撞，较小的行星会爆炸。如果两颗行星大小相同，则两颗行星都会爆炸。两颗移动方向相同的行星，永远不会发生碰撞。

```
示例 1：
输入：asteroids = [5,10,-5]
输出：[5,10]
解释：10 和 -5 碰撞后只剩下 10 。 5 和 10 永远不会发生碰撞。

示例 2：
输入：asteroids = [8,-8]
输出：[]
解释：8 和 -8 碰撞后，两者都发生爆炸。

示例 3：
输入：asteroids = [10,2,-5]
输出：[10]
解释：2 和 -5 发生碰撞后剩下 -5 。10 和 -5 发生碰撞后剩下 10 。

示例 4：
输入：asteroids = [-2,-1,1,2]
输出：[-2,-1,1,2]
解释：-2 和 -1 向左移动，而 1 和 2 向右移动。 由于移动方向相同的行星不会发生碰撞，所以最终没有行星发生碰撞。 
```

**提示：**

- `2 <= asteroids.length <= 10^4`
- `-1000 <= asteroids[i] <= 1000`
- `asteroids[i] != 0`

注意：本题与主站 735 题相同： https://leetcode-cn.com/problems/asteroid-collision/

{% notel orange 题解思路 %}

比较典型的栈题。跟据规则，只有栈顶元素为正数，入栈元素为负数时会发生碰撞。碰撞时，判断两个数绝对值大小来讨论：

- 栈顶元素绝对值大，则无需对栈做处理
- 入栈元素绝对值大，则移除栈顶元素，并和一下栈顶元素做新一轮判断
- 两者一样，则移除栈顶元素

这里原本使用Stack来做但效率很差，最后用了ArrayDeque来代替

{% endnotel %}

{% note success  %}

### 栈的使用

Stack其底层使用了Vector，是线程安全的，那么也就会导致性能偏差，耗时偏长

建议使用ArrayDeque来代替，使用起来没有区别

但还是有不同的地方，目前使用发现的有：

- 使用Stream转化为数组时。Stack是从栈底到栈顶的顺序，而ArrayDeque是从栈顶到栈底的顺序

{% endnote %}

```java
class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int asteroid : asteroids) {
            collision(asteroid, stack);
        }
        int size = stack.size();
        int[] ans = new int[size];
        for (int i = size - 1; i >= 0; i--) {
            ans[i] = stack.pop();
        }
        return ans;
    }

    private void collision(int asteroid, Deque<Integer> stack){
        if (stack.isEmpty()) {
            stack.push(asteroid);
            return;
        }
        Integer prev = stack.peek();
        if(asteroid < 0 && prev > 0){
            int abs = Math.abs(asteroid);
            if(prev < abs){
                stack.pop();
                collision(asteroid, stack);
            } else if(prev == abs){
                stack.pop();
            }
        } else {
            stack.push(asteroid);
        }
    }
}
```

## <font color="orange">38、每日温度</font>

请根据每日 `气温` 列表 `temperatures` ，重新生成一个列表，要求其对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

```
示例 1:
输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]

示例 2:
输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]

示例 3:
输入: temperatures = [30,60,90]
输出: [1,1,0]
```

**提示：**

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

注意：本题与主站 739 题相同： https://leetcode-cn.com/problems/daily-temperatures/

{% notel orange 题解思路 %}

使用栈来做，但栈中存放的不能是温度，而是存温度在数组中的下标，从栈底到栈顶，下标对应温度逐渐下降

当遍历一个温度时，循环比较栈顶：当前温度大于栈顶温度时，可以弹出栈顶并计算两者下标差，直到出现当前问题小于等于栈顶温度或栈为空时结束循环，并将当前温度入栈

遍历完成后，将栈中元素全部弹出，并给0

这种栈也叫做单调栈，但不一定时栈中元素就是单调递增/减，只要逻辑上存在单调递增/减即可

{% endnotel %}

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        Deque<Integer> stack = new ArrayDeque<>();
        int[] result = new int[temperatures.length];
        for (int i = 0; i < temperatures.length; i++) {
            if (stack.isEmpty()) {
                stack.push(i);
                continue;
            }
            int temperature = temperatures[i];
            while (!stack.isEmpty() && temperature > temperatures[stack.peek()]) {
                Integer index = stack.pop();
                result[index] = i - index;
            }
            stack.push(i);
        }
        while (!stack.isEmpty()) {
            Integer index = stack.pop();
            result[index] = 0;
        }
        return result;
    }
}
```

## <font color="red">39、柱状图中最大的矩阵</font>

给定非负整数数组 `heights` ，数组中的数字用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 `1` 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

![img](../../../images/algorithm/leetcode/LCR39.jpg)

```
示例 1:
输入：heights = [2,1,5,6,2,3]
输出：10
解释：最大的矩形为图中红色区域，面积为 10

示例2
输入： heights = [2,4]
输出： 4
```

**提示：**

- `1 <= heights.length <=10^5`
- `0 <= heights[i] <= 10^4`

注意：本题与主站 84 题相同： https://leetcode-cn.com/problems/largest-rectangle-in-histogram/

{% notel red 题解思路 %}

完全没思路，题解看了也不是很理解，先跳过吧

{% endnotel %}

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] left = new int[n];
        int[] right = new int[n];
        Arrays.fill(right, n);

        Deque<Integer> mono_stack = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            while (!mono_stack.isEmpty() && heights[mono_stack.peek()] >= heights[i]) {
                right[mono_stack.peek()] = i;
                mono_stack.pop();
            }
            left[i] = (mono_stack.isEmpty() ? -1 : mono_stack.peek());
            mono_stack.push(i);
        }

        int ans = 0;
        for (int i = 0; i < n; ++i) {
            ans = Math.max(ans, (right[i] - left[i] - 1) * heights[i]);
        }
        return ans;
    }
}
```

## <font color="red">40、最大矩阵</font>

{% notel red 题解思路 %}

和39类似，一样的没思路，先提升实力后面再来

{% endnotel %}