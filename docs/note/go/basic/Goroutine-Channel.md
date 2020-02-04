---
title: 协程和管道
---

## goroutine

### 概述
Go主线程可以启动多个协程，可以说协程是轻量级的线程

协程特点：
1. 有独立的栈空间

2. 共享程序堆空间

3. 调度由用户控制

### panic
goroutine中使用recover解决协程中出现panic，导致程序崩溃问题
```go
package main

import (
	"fmt"
	"time"
)

func sayHello() {
	for i := 0; i < 10; i++ {
		fmt.Println("hello world")
	}
}

func test1() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("test() 发生错误", err)
		}
	}()
	var myMap map[int]string
	myMap[0] = "string" // error
}

func main() {
	go sayHello()
	go test1()
	time.Sleep(time.Second*2)
}
```

## channel

### 概述
**管道是引用类型**
1. channel本质就是一个数据结构-队列

2. 数据先进先出（FIFO: first in first out）

3. 线程安全，多goroutine访问时，不需要加锁

4. channel是有类型的，一个string类型的channel只能存放string类型数据

### 定义
```go
// var 变量名 chan 数据类型
var intChan chan int
var mapChan chan map[int]string
var perChan chan Person
var perChan2 chan *Person

// 管道默认是双向 可读可写
// 声明只写
var chan2 chan <- int
// 声明只读
var chan3 <- chan int 
```

1. channel是引用类型

2. channel必须初始化才能写入数据，即make后使用

3. 管道是有类型的

```go
package main

import "fmt"

func main() {
	var intChan chan int
	intChan = make(chan int, 3)
	fmt.Printf("intChan的值=%v intChan的地址=%p\n", intChan, &intChan)

	intChan <- 10
	num := 100
	intChan <- num
	// 查看管道长度和容量
	fmt.Printf("channel len=%v cap=%v\n", len(intChan), cap(intChan))

	// 不能超过其容量
	//intChan <- 101
	//intChan <- 102

	// 从管道中读取数据
	var num2 int
	num2 = <-intChan
	fmt.Println("num2=", num2)
	fmt.Printf("channel len=%v cap=%v\n", len(intChan), cap(intChan))

	// 在没有使用协程的情况下，如果管道的数据全部取出了，再取会报错
	num3 := <-intChan
	num4 := <-intChan
	num5 := <-intChan
	fmt.Println("num3=", num3, "num4=", num4, "num5", num5)
}
```

```go
intChan的值=0xc0000a8000 intChan的地址=0xc00008a008
channel len=2 cap=3
num2= 10
channel len=1 cap=3
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [chan receive]:
main.main()
        /Users/plsof/go/src/awesomeProject/channel/channel.go:28 +0x47c
exit status 2
```

`案例：定义一个存放任何数据类型的管道`
```go
package main

import "fmt"

type Cat struct {
	Name string
	Age int
}

func main() {
	allChan := make(chan interface{}, 3)
	allChan <-10
	allChan <-"tomcat jack"
	cat := Cat{"猫", 4}
	allChan <- cat

	// 推出前2个元素
	<-allChan
	<-allChan

	newCat := <-allChan
	fmt.Printf("newCat=%T newCat=%v\n", newCat, newCat)
	a := newCat.(Cat) // 类型断言
	fmt.Printf("newCat.Name=%v\n", a.Name)

}
```

```go
newCat=main.Cat newCat={猫 4}
newCat.Name=猫
```

### channel关闭
使用内置函数close可以关闭channel，当channel关闭后，就不能再向channel写数据了，但是仍然可以从该channel读取数据

### channel遍历
channel支持for-range方式遍历

1. 在遍历时，如果channel没有关闭，则会出现deadlock错误

2. 在遍历时，如果channel已经关闭，则会正常遍历数据，遍历完后退出遍历

```go
package main

import "fmt"

func main() {
	intChan := make(chan int, 5)
	for i := 0; i < 5; i++ {
		intChan <- i*2
	}
	close(intChan)
	for v := range intChan {
		fmt.Println("v=", v)
	}
	
}
```

`如果channel遍历放在协程中，为什么不需要先关闭再遍历？`
```go
package main

import (
	"fmt"
	"time"
)

func test(intChan chan int) {
	for v := range intChan {
		fmt.Println("v=", v)
	}
}

func main() {
	intChan := make(chan int, 5)
	for i := 0; i < 5; i++ {
		intChan <- i*2
	}
	//close(intChan)
	go test(intChan)
	time.Sleep(time.Second)
}
```

### select
使用select可以解决从管道读取数据的阻塞问题
```go
package main

import "fmt"

func main() {
	intChan := make(chan int, 10)
	for i := 0; i < 10; i++ {
		intChan <- i
	}

	stringChan := make(chan string, 5)
	for i := 0; i < 5; i++ {
		stringChan <- "hello" + fmt.Sprintf("%d", i)
	}

	// 传统方式遍历管道时，如果不关闭会阻塞而导致deadlock
	for {
		select {
			case v := <-intChan:
				fmt.Printf("从intChan读取数据%d\n", v)
			case v := <-stringChan:
				fmt.Printf("从stringChan读取数据%s\n", v)
			default:
				fmt.Println("读取不到了")
				return
		}
	}
}
```