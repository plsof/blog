---
title: 数据类型
---

## 基础类型

值类型：变量直接存储，变量通常在栈中分配

### 整型

#### 有符号整型

```go
int8    1字节 -2^7 ~ 2^7-1
int16   2字节 -2^15 ~ 2^15-1
int32   4字节 -2^31 ~ 2^31-1
int64   8字节 -2^63 ~ 2^63-1
int     32位系统为int32 64位系统为int64
```

#### 无符号整型

```go
uint8   1字节 0 ~ 2^8-1
uint16  2字节 0 ~ 2^16-1
uint32  4字节 0 ~ 2^32-1
uint64  8字节 0 ~ 2^64-1
```

### 浮点数

浮点数都是有符号的，go的浮点型默认为float64

```go
float32 4字节
float64 8字节
```

### 字符

Go语言有两种字符类型

+ byte（uint8的别名），代表ASCII码的一个字符，一个ASCII字符占一个字节
+ rune（int32的别名），代表一个Unicode码，当需要处理中文的时候需要用到rune类型，一个中文占用3个字节

Example

```go
package main

import (
  "fmt"
)

func main() {
  var c1 = 'a'
  var c2 = '0' // 字符0
  // 当我们直接输出byte值，就是直接输出对应字符的码值
  fmt.Println("c1=", c1, "c2=", c2)
  // 输出对应字符，需要使用格式化输出
  fmt.Printf("c1=%c c2=%c\n", c1, c2)
  // 数字转换成字符
  var c3 int = 22269
  fmt.Printf("c3=%c\n", c3)
  // 字符串可以进行运行，运算时按照码值
  var n1 = 10 + 'a' // 10 + 97 = 107
  fmt.Println("n1=", n1)
  c4 := []rune(string("中国"))
  fmt.Printf("c4=%c, len=%d\n", c4, len(c4))
}
```

```shell
c1= 97 c2= 48
c1=a c2=0
c3=国
n1= 107
c4=[中 国], len=2
```

### 复数

```go
complex64 complex128
```

### 布尔值

bool类型数据只允许取值true和false，默认值为false

bool类型占一个字节

### 字符串

一个字符串是一个**不可改变**的字节序列

字符串底层实现是一个数据结构（结构体），占用16个字节，前8个字节是一个指针，指向字符串的地址，后8个字节是一个整数，标识字符串的长度。

注意go语言的字符串内部并不以'\0'作为结尾，而是通过一个长度域来表示字符串的长度

```go
type string {
  ptr uintptr
  len uint64
}
```

```go
var a string
a = "aa"
fmt.Println("a size=", unsafe.Sizeof(a)) // a size= 16
```

<img src="./images/string.png" alt="string" style="zoom:60%;" />

### 常量

常量是一个简单值的标识符，在程序运行时，不会被修改的量

常量中的数据类型只可以是布尔型、数字型（整数型、浮点型和复数）和字符串型

```go
const s string = "abc"
```

### Example

基本数据类型转换

Example1

int32 -> float32, int32 -> int8, int32 -> int8, int32 -> int64

```go
package main

import "fmt"

func main() {
  var i int32 = 100
  var n1 float32 = float32(i)
  var n2 int8 = int8(i)
  var n3 int64 = int64(i)
  fmt.Printf("i=%v n1=%v n2=%v n3=%v\n", i, n1, n2, n3)

  // 被转换的是变量存储的数据（值），变量本身的数据类型没有变化
  fmt.Printf("i type is %T\n", i)

  // 高精度 -> 低精度；高精度的值超过低精度值的范围，编译时不会出错，结果会按溢出处理
  var num1 int64 = 999999
  var num2 int8 = int8(num1)
  fmt.Println("num2=", num2)
}
```

```shell
i=100 n1=100 n2=100 n3=100
i type is int32
num2= 63
```

Example2

```go
package main

import (
  "fmt"
  "strconv"
)

func main() {
  var num1 int = 99
  var num2 float64 = 23.456
  var b bool = true
  var str string = "hello"

  // int -> string
  str1 := strconv.FormatInt(int64(num1), 10)
  fmt.Printf("str1: type=%T, value=%q\n", str1, str1)
  // float64 -> string
  str2 := strconv.FormatFloat(num2, 'f', 10, 64)
  fmt.Printf("str2: type=%T, value=%q\n", str2, str2)
  // bool -> string
  str3 := strconv.FormatBool(b)
  fmt.Printf("str3: type=%T, value=%q\n", str3, str3)

  // string -> int64
  i1, _ := strconv.ParseInt("100", 10, 64)
  fmt.Printf("i1: type=%T, value=%d\n", i1, i1)
  // string -> float64
  i2, _ := strconv.ParseFloat("23.456", 64)
  fmt.Printf("i2: type=%T, value=%f\n", i2, i2)
  // string -> bool
  i3, _ := strconv.ParseBool("true")
  fmt.Printf("i3: type=%T, value=%t\n", i3, i3)
  // string在做数据类型转换时，要确保string能转换成有效的数据，否则转换为默认值
  i4, _ := strconv.ParseInt(str, 10, 64)
  fmt.Printf("i4: type=%T, value=%d\n", i4, i4)
}
```

```shell
str1: type=string, value="99"
str2: type=string, value="23.4560000000"
str3: type=string, value="true"
i1: type=int64, value=100
i2: type=float64, value=23.456000
i3: type=bool, value=true
i4: type=int64, value=0
```

## 聚合类型

值类型：变量直接存储，变量通常在栈中分配

### 数组

数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成

```go
package main

import "fmt"

func main() {
  var a[5]int
  fmt.Println("a=", a)

  var b [3]int = [3]int{1,2}
  fmt.Println("b[2]=", b[2])

  var c [...]int{4:-1} // 定义一个含有5个元素的数组c，最后一个元素初始化为-1
  fmt.Println("c=", c)
}
```

```shell
a= [0 0 0 0 0]
b[2]= 0
c= [0,0,0,0,-1]
```

如果在数组的长度位置出现的是“...”省略号，则表示数组的长度是根据初始化值的个数来计算

```go
q := [...]int{1, 2, 3}
fmt.Printf("%T\n", q) // "[3]int"
```

数组的长度是数组类型的一个组成部分，因此[3]int和[4]int是两种不同的数组类型。

数组的长度必须是常量表达式，因为数组的长度需要在编译阶段确定

```go
q := [3]int{1, 2, 3}
q = [4]int{1, 2, 3, 4} // compile error: cannot assign [4]int to [3]int
```

数组是值类型

Example: 修改数组的值

```go
package main

import "fmt"

func modify(arr *[3]int) {
  (*arr)[0] = 80
  arr[1] = 90 // 指针隐式解引用
  // arr++ go中没有指针运算
}

func main() {
  var intArr [3]int = [3]int{10, 20, 30}
  modify(&intArr)
  fmt.Println("intArr", intArr)
}
```

```shell
intArr [80 90 30]
```

#### 数组的内存布局

+ 数组地址可以通过数组名来获取 &数组名

+ 数组第一个元素的地址就是数组的地址

+ 数组各个元素的地址间隔是依据数组类型决定的，比如int64 -> 8字节，int32 -> 4字节 ...

```go
package main

import "fmt"

func main() {
  var intArr [3]int
  fmt.Printf("intArr的地址=%p\n"+
    "intArr[0]的地址=%p\n"+
    "intArr[1]的地址=%p\n"+
    "intArr[2]的地址=%p\n",
    &intArr, &intArr[0], &intArr[1], &intArr[2])
  // 为什么内存地址是一个字节加1，google内存最小寻址单位
}
```

```shell
intArr的地址=0xc000014090
intArr[0]的地址=0xc000014090
intArr[1]的地址=0xc000014098
intArr[2]的地址=0xc0000140a0
```

#### 遍历

for-range

```go
package main

import "fmt"

func main() {
  var myArr [3]string = [3]string{"pdd", "pxx", "pbb"}

  for i := 0; i < len(myArr); i++ {
    fmt.Printf("%s ", myArr[i])
  }
  fmt.Println()
  // index, value名称自行定义
  for index, value := range myArr {
    fmt.Printf("下标=%d 值=%s\n", index, value)
  }
}
```

```shell
pdd pxx pbb 
下标=0 值=pdd
下标=1 值=pxx
下标=2 值=pbb
```

### 结构体

结构体是一种聚合的数据类型，是由零个或多个任意类型的值聚合成的实体

在创建一个结构体变量后，如果没有给字段赋值，则字段对应其默认值

```go
type Cat struct {
  Name string
  Age int
  Color string
  Hobby string
}

// 结构体变量
var cat1 Cat
cat1.Name = "小猫"
cat.Age = 2
cat.Color = "黄色"
cat.Hobby = "吃鱼"

// cat2 cat3 结构体字面量
cat2 := Cat{"小猫", 2, "黄色", "吃鱼"} // 字段顺序与Cat一致

// 字段顺序可以与Cat不一致
cat3 := Cat{
  Name: "小猫",
  Age: 2,
  Color: "黄色",
  Hobby: "吃鱼",
}

var cat4 *Cat = new(Cat)
cat4.Name = "小猫" // 隐式解引用 等价于(*cat4).Name = "小猫"
cat4.Age = 2
cat4.Color = "黄色"
cat4.Hobby = "吃鱼"

var cat5 *Cat = &Cat{}
```

#### 继承

Example

```go
type A struct {
  Name string
  Price int
}

type B string {
  A // 嵌套匿名结构体A
  Writing string
}
```

+ 匿名结构体字段访问可以简化

```go
var b B
b.name = "tom" // b.A.name = "tom"
b.age = 78 // b.A.age = 78
b.say() // b.A.say()
```

+ 当结构体和匿名结构体有相同的字段或者方法时，编译器采用就近访问原则访问，如希望访问匿名结构体的字段和方法，可以通过匿名结构体名来区分

+ 结构体嵌入两个（或多个）匿名结构体（多重继承），如两个匿名结构体有相同的字段和方法（同时结构体本身没有同名的字段和方法），在访问时，就必须明确指定匿名结构体名字，否则编译出错

+ 结构体嵌入有名结构体，这种模式就叫组合，如果是组合关系，那么访问组合的结构体的字段和方法时，就必须带上结构体的名字

```go
type A struct {
  Name string
  Age int
}

type C struct {
  a A
}

var c C
c.a.Name = "jack"
```

+ 嵌套匿名结构体后，也可以在创建结构体变量时，直接指定各个匿名结构体字段的值

```go
type Goods struct {
  Name string
  Price float64
}

type Brand struct {
  Name string
  Address string
}

type Tv struct {
  Goods
  Brand
}

tv := Tv{ Goods{"电视机", 2999}, Brand{
  Name:    "小米",
  Address: "北京",
},}
```

#### 结构体内存分布

结构体字段内存地址是连续的

```go
package main

import (
  "fmt"
  "unsafe"
)

type Cat struct {
  Name  string
  Age   int
  Color string
  Hobby string
  }

func main() {
  var cat1 Cat
  cat1.Name = "小猫"
  cat1.Age = 2
  cat1.Color = "黄色"
  cat1.Hobby = "吃鱼"

  fmt.Printf("%p %p %p %p %p\n", &cat1, &cat1.Name, &cat1.Age, &cat1.Color, &cat1.Hobby)
  fmt.Println("内存大小", unsafe.Sizeof(cat1), unsafe.Sizeof(cat1.Name), unsafe.Sizeof(cat1.Age))
}
```

```shell
0xc000070040 0xc000070040 0xc000070050 0xc000070058 0xc000070068
内存大小 56 16 8
```

## 引用类型

引用类型：变量存储的是一个地址、这个地址对应的空间存储数据（值），内存通常在堆上分配，当没有任何变量引用这个地址时，该地址对应的数据空间就成了一个垃圾，由GC来回收

### 切片

切片（slice）代表变长的序列，序列中每个元素都有相同的类型。一个slice类型一般写作[]T，其中T代表切片中元素的类型。切片的语法和数组很像，只是没有固定长度而已，切片是数组的一个引用

```go
package main

import "fmt"

func main() {
  var intArr [5]int = [...]int{1, 2, 3, 4, 5}
  slice := intArr[1:3]
  fmt.Println("intArr", intArr)
  fmt.Println("slice的元素", slice)
  fmt.Println("slice的元素个数", len(slice))
  fmt.Println("slice的容量", cap(slice))
}
```

可以用内置的make函数创建一个指定元素类型、长度和容量的切片。容量部分可以省略，在这种情况下，容量将等于长度，未省略cap >= len

```go
make([]T, len, cap)
```

Example: 创建切片

```go
package main

import "fmt"

func main() {
  // 方式1
  var intArr1 [5]int = [...]int{1, 2, 3, 4, 5}
  slice1 := intArr1[1:3]
  fmt.Println("slice1", slice1)

  // 方式2
  var slice2 []int = make([]int, 5, 10)
  slice2[0] = 1
  slice2[1] = 2
  fmt.Println("slice2", slice2)

  // 方式3 使用原理类似make
  var slice3 []int = []int{1, 2, 3, 4, 5}
  fmt.Println("slice3", slice3)
}
```

#### 切片的内存布局

<img src="./images/slice.png" alt="slice" style="zoom:50%;" />

#### 切片扩容

append内置函数可以对切片进行动态追加

+ 切片append操作的本质就是对数组扩容

+ 如果扩容后的切片len不大于cap，就在数组上追加数据

+ 如果扩容后的切片len大于cap，go底层会创建一个新的数组newArr（扩容后大小），将切片原来包含的数据拷贝到新数组，追加数据，切片重新引用到新数组（newArr由底层维护，不可见）

```go
package main

import "fmt"

func main() {
  var intArr [5]int = [...]int{1, 2, 3, 4, 5}
  slice := intArr[0:2]
  fmt.Printf("数组地址=%p\n", &intArr)
  fmt.Printf("slice=%v len=%d cap=%d\n", slice, len(slice), cap(slice))
  fmt.Printf("数组地址=%p 切片地址=%p\n", slice, &slice)
  slice = append(slice, 6, 7)
  fmt.Printf("slice=%v len=%d cap=%d\n", slice, len(slice), cap(slice))
  fmt.Printf("数组地址=%p 切片地址=%p\n", slice, &slice)
  slice = append(slice, 8, 9)
  fmt.Printf("slice=%v len=%d cap=%d\n", slice, len(slice), cap(slice))
  fmt.Printf("数组地址=%p 切片地址=%p\n", slice, &slice)
}
```

```shell
数组地址=0xc000098030
slice=[1 2] len=2 cap=5
数组地址=0xc000098030 切片地址=0xc0000a2000
slice=[1 2 6 7] len=4 cap=5
数组地址=0xc000098030 切片地址=0xc0000a2000
slice=[1 2 6 7 8 9] len=6 cap=10
数组地址=0xc0000ac000 切片地址=0xc0000a2000
```

#### 切片拷贝

切片使用内置函数copy进行拷贝，copy(dst_para, src_para): dst_para和src_para都是切片类型

```go
package main

import "fmt"

func main() {
  var slice1 []int = []int{1, 2, 3, 4, 5}
  var slice2 = make([]int, 10)
  var slice3 = make([]int, 1)
  copy(slice2, slice1)
  copy(slice3, slice1)
  fmt.Printf("slice1=%v\nslice2=%v\nslice3=%v\n", slice1, slice2, slice3)
}
```

```shell
slice1=[1 2 3 4 5]
slice2=[1 2 3 4 5 0 0 0 0 0]
slice3=[1]
```

### 映射

在Go语言中，一个map就是一个哈希表的引用，map类型可以写为map[K]V，其中K和V分别对应key和value。map中所有的key都有相同的类型，所有的value也有着相同的类型，但是key和value之间可以是不同的数据类型。slice、map、function不可以作为key，因为这几个没法用==来判断

```go
// 声明map不会分配内存，初始化需要make分配内存后才能赋值和使用
// slice区别：slice声明后，可以append数据
var a map[string]string
a = make(map[string]string, 10)
a["no1"] = "北京"
a["no2"] = "上海"
a["no3"] = "无锡"

ages := make(map[string]int)
ages["alice"] = 31
ages["charlie"] = 34

ages := map[string]int{
  "alice":   31,
  "charlie": 34,
}
```

#### map增删查该

增加，更新

```go
map["key"] = value // key不存在则增加，存在则修改
```

删除

```go
delete(map, "key") // key存在则删除，key不存在也不会报错
```

查找

```go
val, ok := a["no1"] // 存在返回true, 否则false
if ok {
  fmt.Printf("key no1存在%v\n", val)
} else {
  fmt.Printf("key no1不存在\n")
}
```

#### map遍历

```go
for k,v := range a {
  fmt.Printf("k=%v v=%v", k, v)
}
```

### Channel

`Channel`是一种先入先出（FIFO）通信机制，可以用它在goroutine之间传递消息

和map类似，channel也对应一个由make创建的底层数据结构的引用，默认值为nil

```go
ch := make(chan int)
```

`Channel`支持三种通信模式，全双工、只读，只写

```go
chan T          // 可以接收和发送类型为T的数据
chan<- float64  // 只可以用来发送float64类型的数据
<-chan int      // 只可以用来接收int类型的数据
```

#### 关闭Channel

可以用内置close函数关闭channel，随后对该channel写数据将导致panic异常，但仍可以正常从该channel读取数据，如果channel已经没有数据的话将产生一个零值的数据。

```go
import "fmt"

func main() {
  ch := make(chan int, 1)
  ch <- 1
  close(ch)
  //ch <- 2 // panic
  a1 := <-ch
  a2 := <-ch
  fmt.Printf("a1=%d a2=%d\n", a1, a2)
}
```

检查channel是否已经被关闭

```go
v, ok := <-ch
```

#### 不带缓存的Channel

```go
ch := make(chan int)
```

一个基于无缓存channel的发送操作将导致发送者goroutine阻塞，直到另一个goroutine在相同的channel上执行接收操作，当发送的值通过channel成功传输之后，两个goroutine可以继续执行后面的语句。反之，如果接收操作先发生，那么接收者goroutine也将阻塞，直到有另一个goroutine在相同的channel上执行发送操作

```go
package main

import (
  "fmt"
  "time"
)

func worker(done chan bool) {
  time.Sleep(time.Second * 2)
  // 通知任务已完成
  done <- true
}

func main() {
  start := time.Now()

  done := make(chan bool, 1)
  go worker(done)
  // 阻塞直到接收到数据
  <-done

  end := time.Since(start)
  fmt.Println("task Done!")
  fmt.Println("cost time=", end)
}
```

```shell
task Done!
cost time= 2.001512833s
```

#### 带缓存的Channel

带缓存的channel内部持有一个元素队列。队列的最大容量是在调用make函数创建channel时通过第二个参数指定的。下面的语句创建了一个可以持有三个字符串元素的带缓存channel

```go
ch := make(chan int, 3)
```

当缓存满的时候写阻塞，当缓存空的时候读阻塞

#### Channel遍历

`for ... range`语句可以遍历channel

```go
package main

import (
  "fmt"
  "time"
)

func main() {
  c := make(chan int)
  go func() {
    for i := 0; i < 10; i = i + 1 {
      c <- i
      time.Sleep(1 * time.Second)
    }
    close(c)
  }()
  for i := range c {
    fmt.Println(i)
  }
  fmt.Println("Finished")
}
```

`range c`产生的迭代值为channel中发送的值，它会一直迭代直到channel被关闭。上面的例子中如果把`close(c)`注释掉，程序会一直阻塞在`for ... range`那一行

### 指针

Go支持指针，但不支持指针运算，指针默认值为nil

```go
package main

import "fmt"

func main() {
  //var a *int or a := new(int)
  b := 4
  a := new(int)
  a = &b
  fmt.Printf("%v, %d\n", a, *a)
}
```

Example: 数组指针和指针数组

```go
package main

import "fmt"

func main() {
  x, y := 1, 2
  var arr = [...]int{5: 2}
  //数组指针
  var pf *[6]int = &arr

  //指针数组
  pfArr := [...]*int{&x, &y}
  fmt.Println(*pf)
  fmt.Println(*pfArr[0], *pfArr[1])
}
```

```shell
[0 0 0 0 0 2]
1 2
```

#### 隐式解引用

对于一些复杂类型的指针， 如果要访问成员变量的话，需要写成类似`(*p).field`的形式，Go提供了隐式解引用特性，我们只需要`p.field`即可访问相应的成员

```go
p1 := &Person{name: "易天", age: 24}
fmt.Println((*p1).name)
fmt.Println(p1.name)
```

### 函数

函数也是一种引用类型，具体详见函数章节

## 接口
