<center>
  <h1>Go学习笔记</h1>
</center>

## 变量

#### 声明

1. var

   ```go
   var 变量名字 类型 = 表达式
   ```

2. :=

   在函数内部，有一种称为简短变量声明语句的形式可用于声明和初始化局部变量。它以“名字 := 表达式”形式声明变量，变量的类型根据表达式来自动推导

   ```go
   t := 0
   ```

3. new

   另一个创建变量的方法是调用用内建的new函数。表达式new(T)将创建一个T类型的匿名变量，初始化为T类型的零值，然后返回变量地址，返回的指针类型为`*T`

   ```go
   p := new(int)   // p, *int 类型, 指向匿名的 int 变量
   fmt.Println(*p) // "0"
   *p = 2          // 设置 int 匿名变量的值为 2
   fmt.Println(*p) // "2"
   ```

   

## 赋值

#### 元祖赋值

元组赋值是另一种形式的赋值语句，它允许同时更新多个变量的值。在赋值之前，赋值语句右边的所有表达式将会先进行求值，然后再统一更新左边对应变量的值

```Go
x, y = y, x

a[i], a[j] = a[j], a[i]
```



## 基本类型

```go
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // uint8 的别名

rune // int32 的别名
     // 代表一个Unicode码

float32 float64

complex64 complex128
```



## 基础数据类型

#### 整型

##### 有符号整数类型

```go
int8 int16 int32 int64
```

##### 无符号整数类型

```go
uint8 uint16 uint32 uint64
```

#### 浮点数

```go
float32 float64
```

#### 复数

```go
complex64 complex128
```

#### 布尔型

```go
true false
```

#### 字符串

一个字符串是一个不可改变的字节序列

#### 常量

常量表达式的值在编译期计算，而不是在运行期




## 复合数据类型(聚合类型)

#### 数组

数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成

```go
var a [10]int
```

定义变量 `a` 是一个有十个整数的数组

默认情况下，数组的每个元素都被初始化为元素类型对应的零值

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

##### 数组指针和指针数组

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

#### 结构体

结构体是一种聚合的数据类型，是由零个或多个任意类型的值聚合成的实体

##### 结构体字面值

结构体值也可以用结构体字面值表示，结构体字面值可以指定每个成员的值

```go
type Point struct{ X, Y int }
1. p := Point{1, 2}
2. p := Point{X:1, Y:2}
```



## 引用类型

#### slice

Slice（切片）代表变长的序列，序列中每个元素都有相同的类型。一个slice类型一般写作[]T，其中T代表slice中元素的类型；slice的语法和数组很像，只是没有固定长度而已

```go
s := []int{0, 1, 2, 3, 4, 5}
```

内置的make函数创建一个指定元素类型、长度和容量的slice。容量部分可以省略，在这种情况下，容量将等于长度

```go
make([]T, len)
make([]T, len, cap) // same as make([]T, cap)[:len]
```

#### Map

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

#### channel

#### 指针

##### 隐式解引用

对于一些复杂类型的指针， 如果要访问成员变量的话，需要写成类似`(*p).field`的形式，Go提供了隐式解引用特性，我们只需要`p.field`即可访问相应的成员

```go
p1 := &Person{name: "易天", age: 24}
fmt.Println((*p1).name)
fmt.Println(p1.name)
```



## 接口类型

#### error



## 函数

#### 函数声明

函数声明包括函数名、形式参数列表、返回值列表（可省略）以及函数体

```go
func name(parameter-list) (result-list) {
    body
}
```



## 方法

在函数声明时，在其名字之前放上一个变量，即是一个方法。这个附加的参数会将该函数附加到这种类型上，即相当于为这种类型定义了一个独占的方法

```go
package geometry

import "math"

type Point struct{ X, Y float64 }

// traditional function
func Distance(p, q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}

// same thing, but as a method of the Point type
func (p Point) Distance(q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}
```



## 接口

接口类型是由一组方法定义的集合

接口类型的值可以存放实现这些方法的任何值