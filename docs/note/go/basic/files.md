---
title: 文件操作
---

## 概述
文件在程序中是以流的形式来操作的

## os.File
os.File封装所有文件相关操作，File是一个结构体

`打开，关闭文件`
```go
file, err := os.open("./1.txt")
if err != nil {
  fmt.Println("open file err=", err)
}

err = file.close()
if err != nil {
  fmt.Println("close file err=", err)
}
```

## bufio
带缓冲区的读写I/O

```go
file, err := os.open("./1.txt")
if err != nil {
  fmt.Println("open file err=", err)
}

err = file.close()
if err != nil {
  fmt.Println("close file err=", err)
}

const (
  defaultBufSize = 4096 // 默认缓冲区4096
)

reader := bufio.NewReader(file)
for {
  str, err := reader.ReadString('\n')
  if err == io.EOF { // io.EOF表示文件末尾
    break
  }
  fmt.Print(str) // 输出文件内容
}
```

## ioutil
ioutil一次性将整个文件读取到内存中（这种方式适用于文件体积不大的情况）
```go
package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	file := "./1.txt"
	content, err := ioutil.ReadFile(file) // 自动打开，关闭
	if err != nil {
		fmt.Printf("read file err=%v", err)
	}
	fmt.Printf("%v", string(content)) // 返回[]byte
}
```

## 写文件
`func OpenFile(name string, flag int, perm FileMode) (file *File, err error)`

`flag int 文件打开模式`
```go
const (
    O_RDONLY int = syscall.O_RDONLY // 只读模式打开文件
    O_WRONLY int = syscall.O_WRONLY // 只写模式打开文件
    O_RDWR   int = syscall.O_RDWR   // 读写模式打开文件
    O_APPEND int = syscall.O_APPEND // 写操作时将数据附加到文件尾部
    O_CREATE int = syscall.O_CREAT  // 如果不存在将创建一个新文件
    O_EXCL   int = syscall.O_EXCL   // 和O_CREATE配合使用，文件必须不存在
    O_SYNC   int = syscall.O_SYNC   // 打开文件用于同步I/O
    O_TRUNC  int = syscall.O_TRUNC  // 如果可能，打开时清空文件
)
```

`perm FileMode 权限控制 r->4 w->2 x->1`

`案例：`
```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	filePath := "./2.txt"
	file, err := os.OpenFile(filePath, os.O_WRONLY | os.O_CREATE, 0666)
	if err != nil {
		fmt.Printf("open file err=%v\n", err)
		return
	}
	defer file.Close()

	str := "hello pdd!\n"
	writer := bufio.NewWriter(file) // 带缓冲区的writer
	for i := 0; i < 5; i++ {
		writer.WriteString(str)
	}
	writer.Flush() // 将缓冲区内容写到文件
}
```