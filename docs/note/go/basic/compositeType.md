---
title: 复合数据类型
---

## 数组

### 概念
数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成
```go
// 定义变量 `a` 是一个有十个整数的数组 默认情况下，数组的每个元素都被初始化为元素类型对应的零值
var a [10]int
```

```go
var q [3]int = [3]int{1, 2, 3}
var r [3]int = [3]int{1, 2}
fmt.Println(r[2]) // "0"
```

如果在数组的长度位置出现的是“...”省略号，则表示数组的长度是根据初始化值的个数来计算
```go
q := [...]int{1, 2, 3}
fmt.Printf("%T\n", q) // "[3]int"
```

数组的长度是数组类型的一个组成部分，因此[3]int和[4]int是两种不同的数组类型。数组的长度必须是常量表达式，因为数组的长度需要在编译阶段确定
```go
q := [3]int{1, 2, 3}
q = [4]int{1, 2, 3, 4} // compile error: cannot assign [4]int to [3]int
```

数组是值类型
```go
package main

import "fmt"

func modify(arr *[3]int)  {
	(*arr)[0] = 80
	arr[1] = 90 // 指针隐式解引用
	//arr++ go中没有指针运算
}

func main()  {
	var intArr [3]int = [3]int{10, 20, 30}
	modify(&intArr)
	fmt.Println("intArr=", intArr)
}
```

### 数组的内存布局
1. 数组地址可以通过数组名来获取 &数组名

2. 数组第一个元素的地址就是数组的地址

3. 数组各个元素的地址间隔是依据数组类型决定的，比如int64 -> 8字节，int32 -> 4字节 ...

```go
package main

import "fmt"

func main()  {
	var intArr [3]int
	fmt.Printf("intArr的地址=%p intArr[0]的地址=%p intArr[1]的地址=%p intArr[2]的地址=%p",
		&intArr, &intArr[0], &intArr[1], &intArr[2])
	// 为什么内存地址是一个字节加1，google内存最小寻址单位
}
```

```go
intArr的地址=0xc0000160e0 intArr[0]的地址=0xc0000160e0 intArr[1]的地址=0xc0000160e8 intArr[2]的地址=0xc0000160f0
```

### 遍历
常规遍历、for-range
```go
package main

import "fmt"

func main()  {
	var myArr [3]string = [3]string{"pdd", "pxx", "pbb"}

	for i := 0; i<len(myArr); i++ {
		fmt.Printf("%s\n", myArr[i])
	}
	// index, value名称自行定义
	for index, value := range myArr {
		fmt.Printf("下标=%d 值=%s\n", index, value)
	}
}
```

### 数组指针和指针数组
```go
package main

import "fmt"

func main(){
	x,y := 1, 2
	var arr =  [...]int{5:2}
	//数组指针
	var pf *[6]int = &arr

	//指针数组
	pfArr := [...]*int{&x,&y}
	fmt.Println(pf)
	fmt.Println(pfArr)
}
```

## 结构体
结构体是一种聚合的数据类型，是由零个或多个任意类型的值聚合成的实体

### 结构体字面值
结构体值也可以用结构体字面值表示，结构体字面值可以指定每个成员的值
```go
type Point struct{ X, Y int }
1. p := Point{1, 2}
2. p := Point{X:1, Y:2}
```

## 引用类型

### slice
Slice（切片）代表变长的序列，序列中每个元素都有相同的类型。一个slice类型一般写作[]T，其中T代表slice中元素的类型；slice的语法和数组很像，只是没有固定长度而已

```go
s := []int{0, 1, 2, 3, 4, 5}
```

内置的make函数创建一个指定元素类型、长度和容量的slice。容量部分可以省略，在这种情况下，容量将等于长度

```go
make([]T, len)
make([]T, len, cap) // same as make([]T, cap)[:len]
```

### Map
在Go语言中，一个map就是一个哈希表的引用，map类型可以写为map[K]V，其中K和V分别对应key和value。map中所有的key都有相同的类型，所有的value也有着相同的类型，但是key和value之间可以是不同的数据类型

```go
ages := map[string]int{
    "alice":   31,
    "charlie": 34,
}
ages := make(map[string]int) // mapping from strings to ints
ages["alice"] = 31
ages["charlie"] = 34
```

### channel
管道

### 指针

#### 使用细节
1. 值类型，都有对应的指针类型，形式为*数据类型，比如 *int *float
2. 值类型包括：基本数据类型 int系列，float系列，bool，string、数组和结构体（struct）

#### 隐式解引用
对于一些复杂类型的指针， 如果要访问成员变量的话，需要写成类似`(*p).field`的形式，Go提供了隐式解引用特性，我们只需要`p.field`即可访问相应的成员

```go
p1 := &Person{name: "易天", age: 24}
fmt.Println((*p1).name)
fmt.Println(p1.name)
```

### 接口类型
interface

#### error

## 值类型和引用类型
值类型：变量直接存储，变量通常在栈中分配

引用类型：变量存储的是一个地址、这个地址对应的空间存储数据（值），内存通常在堆上分配，当没有任何变量引用这个地址时，该地址对应的数据空间就成了一个垃圾，由GC来回收
