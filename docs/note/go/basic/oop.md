---
title: 面向对象
---

## 封装

### 概述
封装（encapsulation）就是把抽象出的**字段和对字段的操作**封装在一起，数据被保护在内部，程序的其它包只有通过被授权的操作（方法）才能对字段进行操作

封装的好处：1. 隐藏实现细节 2. 可以对数据进行验证，保证安全合理

Go中体现封装：1. 对结构体中的属性进行封装 2. 通过方法、包实现封装

### 实现步骤
1. 结构体、字段（属性）的首字母小写（不能导出了，其它包不能使用，类似private）
2. 结构体所在包提供一个工厂模式的函数，首字母大写，类似一个构造函数
3. 提供一个首字母大写的Set方法（类似其它语言的public），用于对属性判断并赋值
    ```go
    func (var struct) setXxx(参数列表) (返回值列表) {
      // 数据验证逻辑
      var.field = 参数
    }
    ```
4. 提供一个首字母大写的Get方法（类似其它语言的public），用于获取属性的值
    ```go
    func (var struct) GetXxx {
      return var.field
    }
    ```
`案例：编写程序实现不能随便查看人的年龄，工资等隐私，并对输入的年龄进行合理的验证`

`model/person.go`
```go
package model

import "fmt"

type person struct {
	Name string
	age int
	sal float64
}

func Newperson(name string) *person {
	return &person{
		Name: name,
	}
}

func (p *person) SetAge(age int) {
	if age >0 && age < 150 {
		p.age = age
	} else {
		fmt.Println("年龄不符合范围")
	}
}

func (p *person) GetAge() int {
	return p.age
}

func (p *person) SetSal(sal float64) {
	if sal >= 3000 && sal <= 30000 {
		p.sal = sal
	} else {
		fmt.Println("薪水不符合范围")
	}
}

func (p *person) GetSal() float64 {
	return p.sal
}
```

`main/main.go`
```go
package main

import (
	"awesomeProject/struct/model"
	"fmt"
)

func main() {
	p := model.Newperson("pdd")
	p.SetAge(30)
	p.SetSal(29999)
	fmt.Println(p.Name, "age=", p.GetAge(), "salary=", p.GetSal())
}
```

```go
pdd age= 30 salary= 29999
```

## 继承

### 概述
继承可以解决代码复用，提高代码的扩展性和维护性
基本语法
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

### 注意事项
1. 结构体可以使用嵌套匿名结构体所有的字段和方法，首字母小写的字段、方法也可以使用

2. 匿名结构体字段访问可以简化
    ```go
    var b B
    b.name = "tom" // b.A.name = "tom"
    b.age = 78 // b.A.age = 78
    b.say() // b.A.say()
    ```

3. 当结构体和匿名结构体有相同的字段或者方法时，编译器采用**就近访问原则**访问，如希望访问匿名结构体的字段和方法，可以通过匿名结构体名来区分

4. 结构体嵌入两个（或多个）匿名结构体（多重继承），如两个匿名结构体有相同的字段和方法（同时结构体本身没有同名的字段和方法），在访问时，就必须明确指定匿名结构体名字，否则编译出错

5. 结构体嵌入有名结构体，这种模式就叫组合，如果是组合关系，那么访问组合的结构体的字段和方法时，就必须带上结构体的名字
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

6. 嵌套匿名结构体后，也可以在创建结构体变量时，直接指定各个匿名结构体字段的值
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

## 多态
### 概述
变量（实例）具有**多种形态**，Go中多态特征是通过接口实现的。可以按照统一的接口来调用不同的实现，这时接口变量就呈现不同的形态

### 接口体现多态特征

1. 多态参数

2. 多态数组

`案例`
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

type Camera struct {

}

func (c Camera) Start() {
	fmt.Println("相机开始工作")
}

func (c Camera) Stop() {
	fmt.Println("相机停止工作")
}

func Working(usb Usb) {
	usb.Start()
	usb.Stop()
}

func main() {
  // 多态参数 既可以接受Phone 也可以接受Camera
	var p Phone
	var c Camera
	Working(p)
  Working(c)
  // 定义多态数组
  var usbArr [3]Usb
  usbArr[0] = Phone{"小米"}
  usbArr[1] = Camera{"尼康"}
}
```