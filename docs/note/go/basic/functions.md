---
title: 函数
---

## 函数声明

函数声明包括函数名、形式参数列表、返回值列表（可省略）以及函数体

```go
func name(parameter-list) (result-list) {
  // body
}
```

## 注意事项

1. 函数的形参列表可以是多个，返回值也可以是多个

2. 形参列表和返回值列表的数据类型可以是值类型和引用类型

3. 函数的命名规范遵循标识符命名规范，首字母不能是数字，首字母大写的函数可以被本包文件和其它包文件使用，类似public，首字母小写的函数只能被本包文件使用，类似private

4. 函数中的变量是局部的，函数外不能使用

5. 基本数据类型和数组、结构体默认都是值传递，即进行值拷贝。在函数内部修改不会影响原来的值，如果希望函数内部能修改函数外部的变量，可以传入变量的地址&，函数内部以指针的方式操作变量

6. Go函数不支持重载

7. 在Go中**函数也是一种数据类型**，可以赋值给一个变量，则该变量就是一个函数类型的变量了，通过该变量可以对函数进行调用

```go
package main

import "fmt"

func getsum(n1 int, n2 int) int {
  return n1 + n2
}

func main()  {
  a := getsum
  res = a(10,20)
  fmt.Printf("res的数据类型是%T getsum的数据类型是%T", res, getsum)
}
```

```go
res的数据类型是func(int, int) int getsum的数据类型是func(int, int) int
```

8. 函数是一种数据类型，因此在Go中，函数可以作为形参，并且调用

```go
package main

import "fmt"

func getSum(n1 int, n2 int) int {
  return n1 + n2
}

func myFun(funvar func(int, int) int, num1 int, num2 int ) int {
  return funvar(num1, num2)
}

func main()  {
  res := myFun(getSum, 20, 30)
  fmt.Println("res =", res)
}
```

9. 为了简化数据类型定义，Go支持自定义数据类型

基本语法：type 自定义数据类型名 数据类型  // 理解：相当于一个别名
案例1：type myInt int  // myInt等价int
案例2：type mySum func(int, int) int  // mySum等价于一个函数类型func(int, int) int

```go
package main

import "fmt"

func getSum(n1 int, n2 int) int {
  return n1 + n2
}

type myFunType func(int, int) int

func myFun(funvar myFunType, num1 int, num2 int ) int {
  return funvar(num1, num2)
}

func main()  {
  // 给int取了别名，在go中myInt虽然是int类型，但是go认为myInt和int是两个不同的类型
  type myInt = int
  var num1 myInt
  var num2 int
  num1 = 40
  num2 = int(num1) // 这里需要显示转换
  fmt.Println("num1 =", num1, "num2 =", num2)

  res := myFun(getSum, 20, 30)
  fmt.Println("res =", res)
}
```

10. 支持对函数返回值命名

```go
package main

import "fmt"

func cal(n1 int, n2 int) (sum int, sub int) {
  sum = n1 + n2
  sub = n1 - n2
  return
}

func main()  {
  var n1 int = 1
  var n2 int = 2
  sum, sub := cal(n1, n2)
  fmt.Println("sum=", sum, "sub=", sub)
}
```

11. 使用 _ 标识符，忽略返回值

12. Go支持可变参数

```go
// 支持0到多个参数
func sum(args...int) int {
}
// 支持1到多个参数
func sum(n1 int, args...int) int {
}
```

```go
package main

import "fmt"

func sum(n1 int, args...int) int {
  res := n1
  for i:=0; i<=len(args)-1; i++ {
      res += args[i]
  }
  return res
}

func main()  {
  res := sum(1,2,3,4)
  fmt.Println("res =", res)
}
```

## 匿名函数

在定义时直接调用，将匿名函数赋值给一个变量，再通过该函数调用匿名函数

```go
package main

import "fmt"

func main()  {
  res1 := func(n1 int, n2 int) int {
      return n1 + n2
  }(10, 20)
  fmt.Println("res1 =", res1)

  a := func(n1 int, n2 int) int {
      return n1 - n2
  }
  res2 := a(10,20)
  res3 := a(20,10)
  fmt.Println("res2 =", res2, "res3 =", res3)
}
```

全局匿名函数在程序的各个地方都可以调用

## defer

1. go执行到一个defer时，不会立即执行defer后的语句，而是将defer后的语句压入到一个栈中，然后继续执行函数下面的语句。**defer将语句放入栈时，也会将相关的值拷贝入栈**

2. 函数执行完毕后，再从defer栈中依次取出语句执行（遵循栈先入后出的规则 FILO）

```go
package main

import "fmt"

func sum(n1 int, n2 int) int {
  defer fmt.Println("n1 =", n1)
  defer fmt.Println("n2 =", n2)
  n1++
  n2++
  res := n1 + n2
  fmt.Println("res =", res)
  return res
}

func main()  {
  res := sum(10,20)
  fmt.Println("main res =", res)
}
```

3. defer、return、返回值三者的执行逻辑应该是：return最先执行，return负责将结果写入返回值中；接着defer开始执行一些收尾工作；最后函数携带当前返回值退出。如果函数的返回值是无名的（不带命名返回值），则go语言会在执行return的时候会执行一个类似创建一个临时变量作为保存return值的动作，而有名返回值的函数，由于返回值在函数定义的时候已经将该变量进行定义，在执行return的时候会先执行返回值保存操作，而后续的defer函数会改变这个返回值(虽然defer是在return之后执行的，但是由于使用的函数定义的变量，所以执行defer操作后对该变量的修改会影响到return的值。

```go
package main

import (
    "fmt"
)

func test() int {
    a := 1
    defer func() {
        a = 4
    }()
    return a
}

func main() {
    a := test()
    fmt.Println("a", a)
}

a 1
```

```go
package main

import (
    "fmt"
)

func test() (a int) {
    a = 1
    defer func() {
        a = 4
    }()
    return
}

func main() {
    a := test()
    fmt.Println("a", a)
}

a 4
```

4. defer最主要的价值是在当函数执行完毕后，可以及时释放函数创建的资源

```go
func test() {
  connect = openDatabase()
  defer connect.close()
    // 其它代码
}
```

## 系统函数

### init

**每一个源文件都可以包含一个init函数**，该函数会在main函数执行前，被调用运行

如果一个文件同时包含全局定义变量，init函数，main函数，则执行的流程是 全局变量定义 -> init -> main

## 内置函数

### new

用来分配内存，主要用来分配值类型，比如int、float32、struct...返回的是指针

```go
package main

import "fmt"

func main()  {
  num := new(int)
  *num = 100
  fmt.Printf("num的类型=%T num的值=%v num的地址=%v num指向的值=%v", num, num, &num, *num)
}
```

### make

用来分配内存，主要用来分配引用类型
