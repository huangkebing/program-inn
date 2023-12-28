---
title: Collection & AbstractCollection
date: 2023-05-09 13:42:07
categories: [Java, 集合]
excerpt: JDK源码集合系列 Collection接口和AbstractCollection抽象类源码阅读
---

Collection接口是Java集合框架的基本接口，它代表着一组对象的集合。List、Set和Queue均继承自Collection

![AbstractCollection](../../../images/AbstractCollection.png)

通过继承树，可以看到

- Collection继承了Iterable
- Collection有一个抽象子类AbstractCollection

## 一、Iterable

`Iterable`表示可迭代的、可遍历的，指的是一种对象，它可以被迭代、枚举、遍历

只要一个对象实现了Iterable接口，就可以使用for-each循环语句遍历对象中的元素。但是该对象必须提供一个Iterator对象来遍历元素。例如，List、Set和数组默认都实现了Iterable接口，因此可以使用for-each循环语句遍历它们中的元素

::: danger

### 问题1 for-each与Iterator

> Q：for-each和Iterator有什么关系？为什么要使用for-each还需要提供Iterator对象呢？

以ArrayList为例，写一个简单的for-each循环测试样例：

```java
List<Integer> list = new ArrayList<>();
list.add(1);list.add(2);list.add(3);
for (Integer integer : list) {
    System.out.println(integer);
}
```

将样例的字节码反编译后得到如下内容：

```java
List<Integer> list = new ArrayList();
list.add(1);list.add(2);list.add(3);

Iterator var2 = list.iterator();
while(var2.hasNext()) {
    Integer integer = (Integer)var2.next();
    System.out.println(integer);
}
```

可以看到实际是用迭代器实现的，所以要使用for-each的类，必须提供Iterator对象。实际上<font color="#16b777">for-each用法是Java5发布的语法糖</font>。是一种更简洁的循环语法，可以遍历数组或集合中的所有元素，但实际上是通过迭代器来实现的。其全称是增强型for循环，可以让代码更加简洁、易读。

:::

Iterable接口定义了三个方法，除了迭代器的方法外，Java8还新增了forEach函数式接口的实现和可拆分的迭代器

```java
public interface Iterable<T> {
    /**
     * 获得迭代器
     */
    Iterator<T> iterator();

    /**
     * forEach函数式接口的实现，本质还是for-each即迭代器
     */
    default void forEach(Consumer<? super T> action) {
        Objects.requireNonNull(action);
        for (T t : this) {
            action.accept(t);
        }
    }

    /**
     * 获得Spliterator(可拆分迭代器)对象
     */
    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(), 0);
    }
}
```

## 二、Collection

Collection接口定义了集合的通用方法并给出了一些设计规范，这里主要翻译了一下注释，有助于理解每个方法

1. size 获取集合元素数

```java
/**
 * 返回此集合中的元素数。如果此集合包含的元素数量超过Integer.MAX_VALUE，则返回Integer.MAX_VALUE
 */
int size();
```

2. isEmpty 判断集合是否为空

```java
/**
 * 如果此集合不包含任何元素，则返回 true
 */
boolean isEmpty();
```

3. contains 判断是否包含元素

```java
/**
 * 如果此集合包含指定的元素，则返回 true
 * 更正式地说，当且仅当此集合包含至少一个元素e时返回true，使得o==null？e==null:o.equals(e)
 *
 * @param o 要测试其在此集合中的是否存在的元素
 * @return 如果此集合包含指定的元素，则返回 true
 * @throws ClassCastException 如果指定元素的类型与此集合不兼容
 * @throws NullPointerException 如果指定的元素为 null，并且此集合不允许 null 元素
 */
boolean contains(Object o);
```

4. iterator 获取迭代器

```java
/**
 * 返回此集合中元素的迭代器。对于元素的返回顺序没有保证（除非此集合是提供顺序保证的集合实例）
 */
Iterator<E> iterator();
```

5. toArray 转化为数组

```java
/**
 * 返回一个包含此集合中所有元素的数组。如果此集合对其迭代器返回其元素的顺序做出任何保证，则此方法必须以相同的顺序返回元素
 * 此方法会分配一个新数组，即使这个集合底层是依托数组实现的。因此，调用方修改数组不会影响集合
 * 此方法充当数组和集合之间转化的桥梁
 *
 * @return 包含此集合中所有元素的数组
 */
Object[] toArray();

/**
 * 返回包含此集合中所有元素的数组，返回数组的运行时类型是指定数组的运行时类型。
 * 如果集合的元素数量在指定的数组中足够存放，则在其中返回该集合。否则，将使用指定数组的运行时类型和集合的大小分配一个新数组
 *
 * 如果数组的元素多于集合，则紧跟在集合末尾之后的数组中的元素会被设置为null
 * 仅当调用方确定此集合不包含任何null元素时，这才可用于确定此集合的长度
 *
 * 如果此集合对其迭代器返回其元素的顺序做出任何保证，则此方法必须以相同的顺序返回元素
 * 与toArray()方法一样，此方法充当基于数组和基于集合的 API 之间的桥梁
 * 此外，该方法允许精确控制输出数组的运行时类型，并且在某些情况下可用于节省分配成本
 *
 * 假设x是一个已知只包含字符串的集合。以下代码可用于将集合转储到新分配的String数组中：
 * String[] y = x.toArray(new String[0]);
 * 请注意，toArray(new Object[0])在方法上与toArray()相同
 *
 * @param <T> 要包含集合的数组的运行时类型
 * @param a 存储此集合的元素的数组（如果它足够大）;否则，将分配相同运行时类型的新数组
 * @return 包含此集合中所有元素的数组
 * @throws ArrayStoreException 如果指定数组的运行时类型不是此集合中每个元素的运行时类型的超类
 * @throws NullPointerException 如果指定的数组为空
 */
<T> T[] toArray(T[] a);
```

6. add 新增元素

```java
/**
 * 可选择实现操作
 * 如果此集合因调用而更改，则返回true；如果此集合不允许重复且已包含指定的元素，则返回false
 * 支持此操作的集合可能会限制可以添加到此集合的元素,集合类应在其文档中明确指定对可以添加哪些元素的任何限制
 * 如果集合除了已经包含该元素外的任何原因拒绝添加特定元素，则必须引发异常，而不是返回false
 *
 * @param e 要确保其在此集合中的存在元素
 * @return 如果此集合因调用而更改，则为 true
 * @throws UnsupportedOperationException 如果此集合不支持添加操作
 * @throws ClassCastException 如果指定元素的类阻止将其添加到此集合
 * @throws NullPointerException 如果指定的元素为null，并且此集合不允许null元素
 * @throws IllegalArgumentException 如果元素的某些属性阻止将其添加到此集合
 * @throws IllegalStateException 如果由于插入限制而此时无法添加元素
 */
boolean add(E e);
```

7. remove 移除元素

```java
/**
 * 可选择实现操作
 * 从此集合中删除指定元素的单个实例（如果存在），更正式地说，删除元素e，符合要求(o==null?e==null:o.equals(e))
 * 如果此集合包含指定的元素（如果此集合由于调用而更改），则返回 true
 *
 * @param o 要从此集合中删除的元素（如果存在）
 * @return 如果由于此调用而删除了元素，则为true
 * @throws ClassCastException 如果指定元素的类型与此集合不兼容
 * @throws NullPointerException 如果指定的元素为null，并且此集合不允许null元素
 * @throws UnsupportedOperationException 如果此集合不支持删除操作
 */
boolean remove(Object o);
```

8. containsAll 批量包含

```java
/**
 * 如果此集合包含指定集合中的所有元素，则返回 true。
 *
 * @param  c 要检查是否在此集合中的元素的集合
 * @return 如果此集合包含指定集合中的所有元素，则为 true
 * @throws ClassCastException 如果指定集合中的一个或多个元素的类型与此集合不兼容
 * @throws NullPointerException 如果指定的集合包含一个或多个null元素，并且此集合不允许null元素或者，如果指定的集合为null
 * @see    #contains(Object)
 */
boolean containsAll(Collection<?> c);
```

9. addAll 批量新增

```java
/**
 * 将指定集合中的所有元素添加到此集合（可选操作）
 *
 * @param c 包含要添加到此集合的元素的集合
 * @return 如果此集合因调用而更改，则为true
 * @throws UnsupportedOperationException 如果此集合不支持 addAll 操作
 * @throws ClassCastException 如果指定集合的元素的类阻止将其添加到此集合
 * @throws NullPointerException 如果指定的集合包含 null 元素，并且此集合不允许 null 元素，或者指定的集合为 null
 * @throws IllegalArgumentException 如果指定集合的元素的某些属性阻止将其添加到此集合
 * @throws IllegalStateException 如果由于插入限制，此时无法添加所有元素
 * @see #add(Object)
 */
boolean addAll(Collection<? extends E> c);
```

10. removeAll 批量移除

```java
/**
 * 删除此集合中所有包含在指定集合中的元素(可选操作)。此调用返回后，此集合将不包含与指定集合相同的元素
 *
 * @param c 包含要从此集合中删除的元素的集合
 * @return 如果此集合因调用而更改，则为true
 * @throws UnsupportedOperationException 如果此集合不支持removeAll方法
 * @throws ClassCastException 如果此集合中一个或多个元素的类型与指定的集合不兼容
 * @throws NullPointerException 如果此集合包含一个或多个null元素，并且指定的集合不支持null元素，或者如果指定的集合为null
 * @see #remove(Object)
 * @see #contains(Object)
 */
boolean removeAll(Collection<?> c);
```

11. removeIf 移除满足predicate条件的元素

```java

/**
 * 删除此集合中满足给定predicate(即predicate判断为true)的所有元素
 * 循环期间发生的错误或运行时异常将传递给调用方
 *
 * 实现规范：
 * 默认实现使用其迭代器遍历集合的所有元素。符合的元素使用迭代器的remove方法移除
 * 如果集合的迭代器不支持删除，则会在第一个匹配元素上抛出{@code UnsupportedOperationException}
 *
 * @param filter 一个predicate，它为要删除的元素返回{@code true}
 * @return {@code true}如果删除了任何一个元素
 * @throws NullPointerException 如果指定的filter为空
 * @throws UnsupportedOperationException 如果无法从此集合中删除元素。如果无法删除匹配元素，或者通常不支持删除，则实现可能会引发此异常
 * @since 1.8
 */
default boolean removeIf(Predicate<? super E> filter) {
    Objects.requireNonNull(filter);
    boolean removed = false;
    final Iterator<E> each = iterator();
    while (each.hasNext()) {
        if (filter.test(each.next())) {
            each.remove();
            removed = true;
        }
    }
    return removed;
}
```

12. retainAll 保留包含在给定集合中的元素

```java
/**
 * 仅保留此集合中包含在给定集合中的元素 (可选操作)
 *
 * @param c 包含要保留在此集合中的元素的集合
 * @return 如果此集合因调用而更改，则为 true
 * @throws UnsupportedOperationException 如果此集合不支持 retainAll 操作
 * @throws ClassCastException 如果此集合中一个或多个元素的类型与给定的集合不兼容
 * @throws NullPointerException 如果此集合包含一个或多个null元素，并且指定的集合不允许null元素，或者如果指定的集合为null
 * @see #remove(Object)
 * @see #contains(Object)
 */
boolean retainAll(Collection<?> c);
```

13. clear 清空集合

```java
/**
 * 从此集合中删除所有元素 (可选操作)，此方法返回后，集合将为空。
 *
 * @throws UnsupportedOperationException 如果此集合不支持清除操作
 */
void clear();
```

14. equals

```java
/**	
 * 参考Object.equals()
 * @param o 要与此集合比较的对象 
 * @return 如果指定的对象等于此集合，则为 true
 * @see Object#equals(Object)
 * @see Set#equals(Object)
 * @see List#equals(Object)
 */
boolean equals(Object o);
```

14. hashcode

```java
/**
 * 返回此集合的哈希值
 * 应该注意，任何重写Object.equals方法的类也必须重写Object.hashCode方法，以满足Object.hashCode方法的一般协定
 * 特别是，c1.equals(c2)意味着c1.hashCode()==c2.hashCode()
 *
 * @return 此集合的哈希值
 * @see Object#hashCode()
 * @see Object#equals(Object)
 */
int hashCode();
```

15. spliterator

```java
/**
 * 在此集合中的元素上创建{@link Spliterator}
 *
 * @return 此集合中元素上的{@code Spliterator}
 * @since 1.8
 */
@Override
default Spliterator<E> spliterator() {
    return Spliterators.spliterator(this, 0);
}
```

16. stream

```java
/**
 * 返回一个连续的Stream，并将此集合作为其源
 *
 * @return 返回一个连续的Stream
 * @since 1.8
 */
default Stream<E> stream() {
    return StreamSupport.stream(spliterator(), false);
}
```

17. parallelStream

```java
/**
 * 返回一个可能并行的Stream，并将此集合作为其源。此方法允许返回顺序流。
 *
 * @return 此集合中的元素上可能并行的Stream
 * @since 1.8
 */
default Stream<E> parallelStream() {
    return StreamSupport.stream(spliterator(), true);
}
```

## 三、AbstractCollection字段解读

`AbstractCollection`中只有一个字段MAX_ARRAY_SIZE，即数组的最大长度

```java
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```

::: danger

### 问题2 为什么是要减8

> 为什么MAX_ARRAY_SIZE的值是Integer.MAX_VALUE - 8？减8的意义是什么？

注释中提到：某些VM会在数组中保留一些header，尝试分配更大的数组可能会导致OutOfMemoryError：请求的数组大小超过VM限制

但是在ArrayList中，可以看到扩容逻辑，其实最大值是Integer.MAX_VALUE

```java
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
    MAX_ARRAY_SIZE;
}
```

数组最大容量是 Integer.MAX_VALUE ，在图示情况扩容到 MAX_ARRAY_SIZE 是为了扩容到 MAX_ARRAY_SIZE以上长度就OOM的虚拟机可以尽量不OOM

详见：[Java 8 ArrayList hugeCapacity 函数与 MAX_ARRAY_SIZE_明明如月学长的博客-CSDN博客](https://blog.csdn.net/w605283073/article/details/109696771)

:::

## 四、AbstractCollection方法解读

`AbstractCollection`中的提供了部分方法的默认实现，均是基于迭代器来完成，如移除操作：

```java
public boolean remove(Object o) {
    Iterator<E> it = iterator();
    if (o==null) {
        while (it.hasNext()) {
            if (it.next()==null) {
                it.remove();
                return true;
            }
        }
    } else {
        while (it.hasNext()) {
            if (o.equals(it.next())) {
                it.remove();
                return true;
            }
        }
    }
    return false;
}
```

但很多实现类，如ArrayList，是基于下标来完成remove的，所以研究这部分实现意义不大

## 五、Iterator

`Iterator`穿插在集合中，到底是什么呢？

迭代器（iterator）有时又称光标（cursor）是程序设计的软件设计模式，可在容器对象（container，例如链表或数组）上遍访的接口，设计人员无需关心容器对象的内存分配的实现细节。

也就是说，通过Iterator，我们无需关心集合内部是怎么实现的，就可以遍历集合

来看看Iterator接口都定义了哪些方法

```java
public interface Iterator<E> {
    /**
     * 如果还具有更多元素，则返回 true
     * 换句话说，如果 next 将返回一个元素而不是引发异常，则返回 true
     *
     * @return 如果还具有更多元素，则返回true
     */
    boolean hasNext();

    /**
     * 返回迭代中的下一个元素
     *
     * @return 迭代中的下一个元素
     * @throws NoSuchElementException 如果没有元素了，抛异常
     */
    E next();

    /**
     * 从基础集合中删除此迭代器返回的最后一个元素（可选操作）。每次调用 next 时只能调用此方法一次。
     *
     * @throws UnsupportedOperationException 如果此迭代器不支持删除操作
     * @throws IllegalStateException 如果尚未调用下一个方法，或者在上次调用下一个方法后已经调用了 Remove 方法
     */
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    /**
     * 对其余每个元素执行给定的操作，直到处理完所有元素或操作引发异常。
     * 操作按迭代顺序（如果指定了该顺序）执行。操作引发的异常将中继到调用方。
     *
     * @param action 要对每个元素执行的操作
     * @throws NullPointerException 如果执行的操作为null
     * @since 1.8
     */
    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}
```

::: tip

### 备注1、Enumeration

在Iterator的注释中，发现了这个。Enumeration是Interator的前身，在Vector和Hashtable中使用，均是已经过时的内容了。

Enumeration有hasMoreElements()、hasMoreElements()两个方法对应Iterator的hasNext()和next()

Iterator相比Enumeration而言，有两个优势：

1. 具备remove的能力
2. 方法名更简洁

:::