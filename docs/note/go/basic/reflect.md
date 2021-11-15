---
title: 反射
---

## reflect

### TypeOf

```go
func TypeOf(i interface{}) Type
```

`TypeOf`返回表示i的动态类型的反射类型。如果i是nil接口值，则`Typeof`返回nil

```go
package main

import (
  "fmt"
  "reflect"
)

func main() {
  i := 1
  fmt.Println("type=", reflect.TypeOf(i))
}
```

### ValueOf

```go
func ValueOf(i interface{}) Value
```

`ValueOf`返回一个初始化为接口i中存储的具体值的新值。`ValueOf(nil)`返回零值

```go
package main

import (
  "fmt"
  "reflect"
)

func main() {
  i := 1
  fmt.Println("value=", reflect.ValueOf(i))
}
```

### Example

遍历获取结构体字段的类型和值

```go
package main

import (
  "fmt"
  "reflect"
)

type Info struct {
  Name string `json:"name"`
  Age  uint   `json:"age"`
  Sex  string `json:"sex"`
}

func main() {
  info := new(Info)
  info.Name = "pdd"
  info.Age = 30
  info.Sex = "man"

  rInfo := reflect.TypeOf(*info)
  vInfo := reflect.ValueOf(*info)

  for i := 0; i < rInfo.NumField(); i++ {
    rFiled := rInfo.Field(i)
    fmt.Printf("name: %v\ntag: %v\n", rFiled.Name, rFiled.Tag)
    val := vInfo.FieldByName(rFiled.Name)
    fmt.Printf("value: %v\n", val)
    fmt.Println("-----------------")
  }
}
```

```shell
name: Name
tag: json:"name"
value: pdd
-----------------
name: Age
tag: json:"age"
value: 30
-----------------
name: Sex
tag: json:"sex"
value: man
-----------------
```
