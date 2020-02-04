---
title: 接口
---

## 概述
**接口是引用类型**
接口类型是由一组方法定义的集合，接口里面的所有方法都没有方法体，接口不需要显式的实现。只要一个变量包含接口类型中的所有方法，那么这个变量就实现了这个接口

## 注意事项
1. 接口本身不能创建实例，但可以指向一个实现了该接口的自定义类型的变量（实例）即：一个自定义类型只有实现了某个接口，才能将该自定义类型的实例（变量）赋值给接口类型
    ```go
    package main

    import "fmt"

    type AInterface interface {
      Say()
    }

    type Std struct {
      Name string
    }

    func (std Std) Say() {
      fmt.Println("std say")
    }

    func main() {
      var std Std
      var a AInterface = std
      a.Say()
    }
    ```

2. 接口中的所有方法都没有方法体，即都没有实现的方法

3. 一个自定义类型实现了某个接口的所有方法，就可以说这个自定义类型实现了这个接口

4. 只要是自定义数据类型，就可以实现接口，不仅仅是结构体类型
    ```go
    type Integer int

    func (i Integer) Say() {
      fmt.Println("i say")
    }

    func main() {
      var i Integer
      var b AInterface = i
      b.Say()
    }
    ```

5. 一个自定义类型可以实现多个接口

6. 接口中不能有任何变量

7. 一个接口（A接口）继承多个别的接口（B，C接口），这时如果要实现A接口，也必须将B，C接口的方法也全部实现
    ```go
    package main

    import "fmt"

    type CInterface interface {
      test01()
    }

    type BInterface interface {
      test02()
    }

    type AInterface interface {
      CInterface
      BInterface
      test03()
    }

    type Std struct {

    }

    func (std Std) test01()  {

    }

    func (std Std) test02()  {

    }

    func (std Std) test03()  {

    }

    func main() {
      var std Std
      var a AInterface = std
      a.test01()
      a.test02()
      a.test03()
    }
    ```

8. 空接口interface{}没有任何方法，**所有类型都实现了这个空接口**，即可以把任何变量赋值给空接口
    ```go
    var t1 interface{} = 10
    ```

`案例`
```go
package main

import (
	"fmt"
	"math/rand"
	"sort"
)

type Hero struct {
	Name string
	Age int
}

type HeroSlice []Hero

func (hs HeroSlice) Len() int {
	return len(hs)
}

// Hero切片按照年龄大小排序
func (hs HeroSlice) Less(i, j int) bool {
	return hs[i].Age > hs[j].Age
}

func (hs HeroSlice) Swap (i, j int) {
	hs[i], hs[j] = hs[j], hs[i]
}

func main() {
	var heroes HeroSlice
	for i := 0; i < 5; i++ {
		hero := Hero{
			Name: fmt.Sprintf("hero%d", rand.Intn(100)),
			Age: rand.Intn(100),
		}
		heroes = append(heroes, hero)
	}
	// 排序前
	//for _, v := range heroes {
	//	fmt.Println(v.Name, v.Age)
	//}
	// 排序后
	sort.Sort(heroes)
	for _, v := range heroes {
		fmt.Println(v.Name, v.Age)
	}
}
```

## 类型断言
接口是一般类型，不知道其具体类型，如果要转换成具体类型，就需要使用类型断言

`案例`
```go
type Point struct {
  x int
  y int
}

func main() {
  var a inetrface{}
  var point Point = Point{1, 2}
  a = point
  var b point
  b = a.(Point) // 类型断言

  var x inetrface{}
  var b float32 = 1.1
  x = b // 空接口，可以接收任意类型
  // y := x.(float64) error panic 类型要匹配
  y := x.(float32)
}
```

带检测的类型断言
```go
var x inetrface{}
var b float32 = 1.1
x = b // 空接口，可以接收任意类型
y, ok := x.(float64)
if ok {
  fmt.Println("convert success")
} else {
  fmt.Println("convert fail")
}
```

`实践1：接口Usb数组中，存放Phone，Camera结构体变量，Phone还有一个特有的方法call()，请遍历数组，调用Usb接口声明的方法，如果是Phone变量，还需要调用特有的方法call()`
```go
package main

import "fmt"

type Usb interface {
	Start()
	Stop()
}

type Phone struct {
	Name string
}

func (p Phone) Start() {
	fmt.Println("手机开始工作")
}

func (p Phone) Stop() {
	fmt.Println("手机停止工作")
}

func (p Phone) Call() {
	fmt.Println("手机开始通话")
}

type Camera struct {
	Name string
}

func (c Camera) Start() {
	fmt.Println("相机开始工作")
}

func (c Camera) Stop() {
	fmt.Println("相机停止工作")
}

func Working(usb Usb) {
	usb.Start()
	if phone, ok := usb.(Phone); ok {
		phone.Call()
	}
	usb.Stop()
}

func main() {
	var usbArr [2]Usb = [2]Usb{ Phone{"小米"}, Camera{"尼康"} }
	for _, v := range usbArr {
		Working(v)
	}
}
```

```go
手机开始工作
手机开始通话
手机停止工作
相机开始工作
相机停止工作
```

`实践2：函数循环判断传入的参数类型`
```go
package main

import "fmt"

type Student struct {

}

func TypeJudge(items...interface{}) {
	for i, v := range items {
		switch v.(type) {
			case bool:
				fmt.Printf("第%v个参数是bool类型，值为%v\n", i, v)
			case float32:
				fmt.Printf("第%v个参数是float32类型，值为%v\n", i, v)
			case float64:
				fmt.Printf("第%v个参数是float64类型，值为%v\n", i, v)
			case int, int32, int64:
				fmt.Printf("第%v个参数是整数类型，值为%v\n", i, v)
			case string:
				fmt.Printf("第%v个参数是string类型，值为%v\n", i, v)
			case Student:
				fmt.Printf("第%v个参数是Student类型，值为%v\n", i, v)
			default:
				fmt.Printf("第%v个参数不确定类型，值为%v\n", i, v)
		}
	}
}

func main() {
	var a bool = true
	var b float32 = 1.1
  var c float64 = 2.2
	var d string = "pdd"
	var e Student
	TypeJudge(a, b, c ,d, e)
}
```

```go
第0个参数是bool类型，值为true
第1个参数是float32类型，值为1.1
第2个参数是float64类型，值为2.2
第3个参数是string类型，值为pdd
第4个参数是Student类型，值为{}
```
