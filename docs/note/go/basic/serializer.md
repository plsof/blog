---
title: 序列化
---

## JSON

### 序列化

`结构体, map, 切片 -> json`
```go
package main

import (
	"fmt"
	"encoding/json"
)

type Monster struct {
	Name string `json:"name"`
	Age int `json:"age"`
	Birthday string `json:birthday`
	Sal float64 `json:sal`
	Skill string `json:skill`
}

// 结构体序列化
func testStruct() {
	monster := Monster{
		Name: "牛魔王",
		Age: 500,
		Birthday: "1000-10-01",
		Sal: 20000.0,
		Skill: "功夫",
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
	var m1 map[string]interface{}
	m1 = make(map[string]interface{})
	m1["name"] = "jack"
	m1["age"] = 7
	m1["address"] = "扬州"
	slice = append(slice, m1)

	var m2 map[string]interface{}
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

### 反序列化
`json -> struct, map, slice`
```go
package main

import (
	"encoding/json"
	"fmt"
)

type Monster struct {
	Name string `json:"name"`
	Age int `json:"age"`
	Birthday string `json:birthday`
	Sal float64 `json:sal`
	Skill string `json:skill`
}

// json -> struct
func unmarshalStruct() {
	str := "{\"Age\":500, \"Birthday\":\"1900-00-00\", \"Sal\":8000, \"Skill\":\"牛魔拳\"}"

	var monster Monster

	err := json.Unmarshal([]byte(str), &monster)
	if err != nil {
		fmt.Printf("unmarshal err=%v\n", err)
	}
	fmt.Printf("marshal struct=%v\n", monster)
}

// json -> map
func unmarshalMap() {
	str := "{\"address\":\"洪崖洞\", \"age\":30, \"name\":\"红孩儿\"}"

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
	str := "[{\"address\":\"扬州\", \"age\":7, \"name\":\"jack\"}, {\"address\" :[\"无锡\", \"上海\"], \"age\":8, \"name\":\"tom\"}]"

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

## YAML