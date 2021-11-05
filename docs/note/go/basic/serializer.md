---
title: 序列化
---

## encoding/json

### Marshal

```go
func Marshal(v interface{}) ([]byte, error)
```

`Marshal`返回v的JSON编码

每个结构体字段的编码可以通过字段标签中的json键进行自定义

omitempty选项指定字段可以被忽略，如果这个字段是个空值、false、0、nil

-选项指定字段总是被忽略

Example

```go
// Field appears in JSON as key "myName".
Field int `json:"myName"`

// Field appears in JSON as key "myName" and
// the field is omitted from the object if its value is empty,
// as defined above.
Field int `json:"myName,omitempty"`

// Field appears in JSON as key "Field" (the default), but
// the field is skipped if empty.
// Note the leading comma.
Field int `json:",omitempty"`

// Field is ignored by this package.
Field int `json:"-"`

// Field appears in JSON as key "-".
Field int `json:"-,"`
```

Example: 结构体, map, 切片 -> json

```go
package main

import (
  "encoding/json"
  "fmt"
)

type Monster struct {
  Name     string  `json:"name"`
  Age      int     `json:"age"`
  Birthday string  `json:"birthday"`
  Sal      float64 `json:"sal"`
  Skill    string  `json:"skill"`
}

// 结构体序列化
func testStruct() {
  monster := Monster{
    Name:     "牛魔王",
    Age:      500,
    Birthday: "1000-10-01",
    Sal:      20000.0,
    Skill:    "功夫",
  }
  data, err := json.Marshal(&monster)
  if err != nil {
    fmt.Printf("fail err=%v\n", err)
  }
  fmt.Printf("struct success %v\n", string(data))
}

// map序列化
func testMap() {
  var a map[string]interface{}
  a = make(map[string]interface{})
  a["name"] = "红孩儿"
  a["age"] = 30
  a["address"] = "洪崖洞"

  data, err := json.Marshal(a)
  if err != nil {
    fmt.Printf("fail err=%v\n", err)
  }
  fmt.Printf("map success %v\n", string(data))
}

//切片序列化
func testSlice() {
  var slice []map[string]interface{}
  var m1, m2 map[string]interface{}

  m1 = make(map[string]interface{})
  m1["name"] = "jack"
  m1["age"] = 7
  m1["address"] = "扬州"
  slice = append(slice, m1)

  m2 = make(map[string]interface{})
  m2["name"] = "tom"
  m2["age"] = 8
  m2["address"] = [2]string{"无锡", "上海"}
  slice = append(slice, m2)

  data, err := json.Marshal(slice)
  if err != nil {
    fmt.Printf("fail err=%v\n", err)
  }
  fmt.Printf("slice success %v\n", string(data))
}

func main() {
  testStruct()
  testMap()
  testSlice()
}
```

```go
struct success {"name":"牛魔王","age":500,"Birthday":"1000-10-01","Sal":20000,"Skill":"功夫"}
map success {"address":"洪崖洞","age":30,"name":"红孩儿"}
slice success [{"address":"扬州","age":7,"name":"jack"},{"address":["无锡","上海"],"age":8,"name":"tom"}]
```

### Unmarshal

```go
func Unmarshal(data []byte, v interface{}) error
```

`Unmarshal`解析json编码的数据并将结果存入v指向的值。

Example: json -> struct, map, slice

```go
package main

import (
  "encoding/json"
  "fmt"
)

type Monster struct {
  Name     string  `json:"name"`
  Age      int     `json:"age"`
  Birthday string  `json:"birthday"`
  Sal      float64 `json:"sal"`
  Skill    string  `json:"skill"`
}

// json -> struct
func unmarshalStruct() {
  str := `{"Age": 500, "Birthday": "1900-00-00", "Sal": 8000, "Skill": "牛魔拳"}`

  monster := new(Monster)

  err := json.Unmarshal([]byte(str), monster)
  if err != nil {
    fmt.Printf("unmarshal err=%v\n", err)
  }
  fmt.Printf("marshal struct=%v\n", monster)
}

// json -> map
func unmarshalMap() {
  str := `{"address": "洪崖洞", "age": 30, "name": "红孩儿"}`

  var a map[string]interface{}
  // a = make(map[string]interface{}) make已经封装到Unmarshal中

  err := json.Unmarshal([]byte(str), &a)
  if err != nil {
    fmt.Printf("unmarshal err=%v\n", err)
  }
  fmt.Printf("marshal map=%v\n", a)
}

// json -> slice
func unmarshalSlice() {
  str := `[
        {"address": "扬州", "age": 7, "name": "jack"},
        {"address": ["无锡", "上海"], "age": 8, "name": "tom"}
      ]`

  var a []map[string]interface{}
  // a = make([]map[string]interface{}, 2) make已经封装到Unmarshal中

  err := json.Unmarshal([]byte(str), &a)
  if err != nil {
    fmt.Printf("unmarshal err=%v\n", err)
  }
  fmt.Printf("marshal slice=%v\n", a)
}

func main() {
  unmarshalStruct()
  unmarshalMap()
  unmarshalSlice()
}
```

```go
marshal struct={ 500 1900-00-00 8000 牛魔拳}
marshal map=map[address:洪崖洞 age:30 name:红孩儿]
marshal slice=[map[address:扬州 age:7 name:jack] map[address:[无锡 上海] age:8 name:tom]]
```

### NewDecoder

```go
func NewDecoder(r io.Reader) *Decoder
```

`NewDecoder`创建一个从r读取的新decoder。decoder引入了缓冲，可以从r读取超出请求JSON值的数据。

Example: 解析http请求返回的json数据

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "name": "pdd",
      "age": 30
    }
  ]
}
```

```go
package main

import (
  "encoding/json"
  "log"
  "net/http"
)

type Data struct {
  Name string `json:"name"`
  Age uint `json:"age"`
}

type Res struct {
  Code uint `json:"code"`
  Msg string `json:"msg"`
  Data []Data `json:"data"`
}

func main() {
  res := new(Res)
  resp, err := http.Get("http://127.0.0.1:8090/")
  if err != nil {
    log.Fatalln(err)
  }
  defer resp.Body.Close()

  err = json.NewDecoder(resp.Body).Decode(res)
  if err != nil {
    log.Fatalln(err)
  }
  log.Println(res)
}
```

### NewEncoder

```go
func NewEncoder(w io.Writer) *Encoder
```

`NewEncoder`返回一个写入w的新encoder

Example: 写入json文件

```go
package main

import (
  "encoding/json"
  "os"
)

type Person struct {
  Name string `json:"name"`
  Age  int    `json:"age"`
  // 如果Child字段为nil 编码JSON时可忽略
  Child *Person `json:"child,omitempty"`
}

func main() {
  person := Person{
    Name: "John",
    Age: 40,
    Child: &Person{
      Name: "Jack",
      Age: 20,
    },
  }

  // File类型实现了io.Writer接口
  file, _ := os.Create("person.json")
  defer file.Close()

  // 根据io.Writer创建Encoder 然后调用Encode()方法将对象编码成JSON
  json.NewEncoder(file).Encode(&person)
}
```

```shell
➜  plsof cat person.json 
{"name":"John","age":40,"child":{"name":"Jack","age":20}}
```
