---
title: 输入输出
---

## io

io包为I/O原语提供了基本的接口, 它主要包装了这些原语的已有实现

### Reader

```go
type Reader interface {
  Read(p []byte) (n int, err error)
}
```

`Reader`接口包装了基本的读方法

### Writer

```go
type Writer interface {
  Write(p []byte) (n int, err error)
}
```

`Writer`接口包装了基本的写方法

### Copy

```go
func Copy(dst Writer, src Reader) (written int64, err error)
```

`Copy`将src复制到dst，直到在src上到达EOF或发生错误。它返回复制的字节数，如果有错误的话，还会返回在复制时遇到的第一个错误。
成功的Copy返回err == nil，而非err == EOF。由于Copy被定义为从src读取直到EOF为止，因此它不会将来自Read的EOF当做错误来报告。
若dst实现了ReaderFrom接口，其复制操作可通过调用dst.ReadFrom(src)实现。此外，若src实现了WriterTo接口，其复制操作可通过调用 src.WriteTo(dst)实现。

#### example

```go
package main

import (
  "io"
  "log"
  "os"
  "strings"
)

func main() {
  r := strings.NewReader("some io.Reader stream to be read\n")

  if _, err := io.Copy(os.Stdout, r); err != nil {
    log.Fatal(err)
  }
}
```

### MultiReader

```go
func MultiReader(readers ...Reader) Reader
```

`MultiReader`返回一个逻辑串联的Reader，他们是按顺序读入的。一旦所有的输入都返回EOF，Read将返回EOF。如果任何一个Reader返回非nil，非EOF错误，Read将返回该错误。

#### example

```go
import (
  "io"
  "log"
  "os"
  "strings"
)

func main() {
  r1 := strings.NewReader("first reader ")
  r2 := strings.NewReader("second reader ")
  r3 := strings.NewReader("third reader\n")
  r := io.MultiReader(r1, r2, r3)

  if _, err := io.Copy(os.Stdout, r); err != nil {
    log.Fatal(err)
  }
}
```

### MultiWriter

```go
func MultiWriter(writers ...Writer) Writer
```

`MultiWriter`创建一个Writer，将写入复制到所有提供的写入器,类似Unix tee(1)命令。每次写入都会写入每个列出的写入器，一次一个。如果列出的写入器返回错误，则整个写入操作将停止并返回错误。

#### example

```go
package main

import (
  "bytes"
  "fmt"
  "io"
  "log"
  "strings"
  )

  func main() {
  r := strings.NewReader("some io.Reader stream to be read\n")

  var buf1, buf2 bytes.Buffer
  w := io.MultiWriter(&buf1, &buf2)

  if _, err := io.Copy(w, r); err != nil {
    log.Fatal(err)
  }

  fmt.Print(buf1.String())
  fmt.Print(buf2.String())
}
```

## ioutil

## bufio
