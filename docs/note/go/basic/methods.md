---
title: 方法
---

## 概述
Go中的方法是作用在指定的数据类型上（与指定的数据类型绑定），**因此自定义的类型，都可以有方法，而不仅仅是struct**
```go
package main

import "fmt"

type Person struct {
	Name string
	Age int
}

type integer int

func (p Person) run() {
	fmt.Printf("%s can run\n", p.Name)
}

func (i *integer) add()  {
	*i = *i + 1
}

func main()  {
	var p Person = Person{"pdd", 30}
	p.run()
	var a integer = 10
	a.add()
	fmt.Println("a=", a)
}
```

```go
pdd can run
a= 11
```

如果一个类型实现了String这个方法，那么fmt.Println默认就会调用这个变量的String()进行输出
```go
package main

import "fmt"

type Student1 struct {
	Name string
	Age int
}

func (s *Student1) String() string {
	str := fmt.Sprintf("name=[%v] age=[%v]", s.Name, s.Age)
	return str
}

func main() {
	var std Student1 = Student1{"pdd", 30}
	fmt.Println(&std)
}
```

```go
name=[pdd] age=[30]
```

方法的接收者为值类型时，可以用指针类型的变量调用方法，反之亦然。**方法是值拷贝还是地址拷贝由方法绑定的类型决定，与调用形式无关**
```go
package main

import "fmt"

type Student1 struct {
	Name string
	Age int
}

func (s Student1) change() {
	s.Name = "pxx"
	s.Age = 31
}

func (s *Student1) address() {
	s.Name = "paa"
	s.Age = 32
}

func main() {
	var std Student1 = Student1{"pdd", 30}
	(&std).change() // 值拷贝 ==> std.change
	fmt.Println(std)
	std.address() // 地址拷贝 ==> (&std).address
	fmt.Println(std)
}
```

## 工厂模式
Go的结构体没有构造函数，通常使用工厂模式来解决这个问题

`案例说明：如果main/main.go想访问model/model.go中的结构体以及结构体字段（model.go中的结构体和结构体字段开头字母为小写）`

`model/model.go`
```go
package model

type student struct {
	Name string
	score float64
}

func NewStudent(n string, s float64) *student {
	return &student{
		Name: n,
		score: s,
	}
}

func (s *student) GetScore() float64 {
	return s.score
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
	var std = model.NewStudent("pdd", 99.8)
	fmt.Println(*std)
	fmt.Printf("name=%s score=%.2f\n", std.Name, std.GetScore())
}
```

```go
{pdd 99.8}
name=pdd score=99.80
```