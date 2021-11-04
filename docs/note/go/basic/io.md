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

`Reader`接口包装了基本的读方法。Read方法会接收一个字节数组p，并将读取到的数据存进该数组，最后返回读取的字节数n。注意n不一定等于读取的数据长度，比如字节数组p的容量太小，n会等于数组的长度。

### Writer

```go
type Writer interface {
  Write(p []byte) (n int, err error)
}
```

`Writer`接口包装了基本的写方法。Write方法同样接收一个字节数组p，并将接收的数据保存至文件或者标准输出等，返回的n表示写入的数据长度。当n不等于len(p)时，返回一个错误。

### Closer

```go
type Closer interface {
  Close() error
}
```

`Closer`接口包装了基本的关闭方法。

### Copy

```go
func Copy(dst Writer, src Reader) (written int64, err error)
```

`Copy`将src复制到dst，直到在src上到达EOF或发生错误。它返回复制的字节数，如果有错误的话，还会返回在复制时遇到的第一个错误。
成功的Copy返回err == nil，而非err == EOF。由于Copy被定义为从src读取直到EOF为止，因此它不会将来自Read的EOF当做错误来报告。
若dst实现了ReaderFrom接口，其复制操作可通过调用dst.ReadFrom(src)实现。此外，若src实现了WriterTo接口，其复制操作可通过调用 src.WriteTo(dst)实现。

Example

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

Example

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

Example

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

`ioutil`包实现了一些I/O实用功能

### ReadFile

```go
func ReadFile(filename string) ([]byte, error)
```

`ReadFile`读取文件并返回内容（大文件慎用，没有读缓存）。成功的调用返回err == nil，而不是err == EOF。因为ReadFile读取整个文件，所以它不会将Read中的EOF视为要报告的错误。

Example

```go
package main

import (
  "fmt"
  "io/ioutil"
  "log"
  )

  func main() {
  content, err := ioutil.ReadFile("./1.txt") // 自动打开文件，关闭文件
  if err != nil {
    log.Fatal(err)
  }

  fmt.Printf("File contents: %s", string(content))
}
```

### WriteFile

```go
func WriteFile(filename string, data []byte, perm fs.FileMode) error
```

`WriteFile`写数据到文件（内容多慎用，没有写缓存），如果文件不存在则创建，文件存在则覆盖其内容

Example

```go
package main

import (
  "io/ioutil"
  "log"
)

func main() {
  message := []byte("Hello, Gophers!")
  err := ioutil.WriteFile("/tmp/test.txt", message, 0644)
  if err != nil {
    log.Fatal(err)
  }
}
```

## bufio

包bufio实现缓冲I/O。它包装了一个io.Reader或io.Writer对象，创建另一个对象（Reader或Writer）该对象也实现了该接口，但为文本I/O提供了缓冲和一些帮助。

### NewReader

```go
func NewReader(rd io.Reader) *Reader
```

`NewReader`返回一个默认缓冲值的新Reader

Exmaple: 隔行读取文件内容

```go
package main

import (
  "bufio"
  "fmt"
  "io"
  "log"
  "os"
)

func main() {
  file, err := os.Open("./1.txt")
  if err != nil {
    log.Fatal(err)
  }
  defer file.Close()

  reader := bufio.NewReader(file)
  for {
    str, err := reader.ReadString('\n')
    if err == io.EOF {
      break
    }
    fmt.Println(str)
  }
}
```

### NewWriter

```go
func NewWriter(w io.Writer) *Writer
```

`NewWriter`返回一个默认缓冲值的新Writer

Example

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

### Scanner

```go
type Scanner struct {
  // contains filtered or unexported fields
}
```

Example

```go
package main

import (
  "bufio"
  "fmt"
  "os"
)

func main() {
  scanner := bufio.NewScanner(os.Stdin)
  for scanner.Scan() {
    fmt.Println(scanner.Text()) // Println will add back the final '\n'
  }
  if err := scanner.Err(); err != nil {
    fmt.Fprintln(os.Stderr, "reading standard input:", err)
  }
}
```
