---
title: 系统
---

## os/exec

exec包执行外部命令。它包装了os.StartProcess以便更容易的重新映射stdin和stdout，用管道连接I/O以及其它的调整。

### LookPath

```go
func LookPath(file string) (string, error)
```

`LookPath`在环境变量PATH中查找文件，如果文件名包含反斜杠则在当前目录中查找。

### Cmd

```go
type Cmd struct {
  Path string // 命令路径，该字段不能为空
  Args []string // 命令参数
  Env []string // 进程环境
  Dir string // 工作目录
  Stdin io.Reader // 标准输入
  Stdout io.Writer // 标准输出
  Stderr io.Writer // 标准错误输出
  ExtraFiles []*os.File
  SysProcAttr *syscall.SysProcAttr
  Process *os.Process
  ProcessState *os.ProcessState
}
```

`Cmd`表示一个正在准备中或者执行中的命令。Cmd在调用其Run Output CombinedOutput方法之后不能被重复使用。

### Command

```go
func Command(name string, arg ...string) *Cmd
```

`Command`返回一个*Cmd结构体，用于使用给出的参数执行name指定的程序。返回值只设定了Path和Args两个参数。

### CommandContext

```go
func CommandContext(ctx context.Context, name string, arg ...string) *Cmd
```

`CommandContext`类似于Command但是包含了一个context。context用来kill这个进程，如果context结束的比进程早。

Exmaple

```go
package main

import (
  "context"
  "os/exec"
  "time"
)

func main() {
  ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
  defer cancel()

  if err := exec.CommandContext(ctx, "sleep", "5").Run(); err != nil {
    // This will fail after 100 milliseconds. The 5 second sleep
    // will be interrupted.
  }
}
```

### CombinedOutput

```go
func (c *Cmd) CombinedOutput() ([]byte, error)
```

`CombinedOutput`运行命令，stdout和stderr一起返回。

Example

```go
package main

import (
  "fmt"
  "log"
  "os/exec"
)

func main() {
  cmd := exec.Command("sh", "-c", "echo stdout; echo 1>&2 stderr")
  stdoutStderr, err := cmd.CombinedOutput()
  if err != nil {
    log.Fatal(err)
  }
  fmt.Printf("%s\n", stdoutStderr)
}
```

### Output

```go
func (c *Cmd) Output() ([]byte, error)
```

`Output`执行命令并返回它的stdout

### Run

```go
func (c *Cmd) Run() error
```

`Run`执行命令并等待直到执行完成

Example

```go
package main

import (
  "log"
  "os/exec"
)

func main() {
  cmd := exec.Command("sleep", "1")
  log.Printf("Running command and waiting for it to finish...")
  err := cmd.Run()
  log.Printf("Command finished with error: %v", err)
}
```

### Start

```go
func (c *Cmd) Start() error
```

`Start`执行命令但不会等待命令执行完成。Wait方法会等待其执行完成并释放其关联的资源

Example

```go
package main

import (
  "log"
  "os/exec"
)

Example

func main() {
  cmd := exec.Command("sleep", "5")
  err := cmd.Start()
  if err != nil {
    log.Fatal(err)
  }
  log.Printf("Waiting for command to finish...")
  err = cmd.Wait()
  log.Printf("Command finished with error: %v", err)
}
```

### StderrPipe

```go
func (c *Cmd) StderrPipe() (io.ReadCloser, error)
```

`StderrPipe`返回一个管道连接该执行命令的stderr。命令执行完成后Wait方法会关闭管道，在Wait方法之后从管道中读取内容是不正确的。StderrPipe不能与Run方法一起使用。

```go
import (
  "fmt"
  "io"
  "log"
  "os/exec"
)

Example

func main() {
  cmd := exec.Command("sh", "-c", "echo stdout; echo 1>&2 stderr")
  stderr, err := cmd.StderrPipe()
  if err != nil {
    log.Fatal(err)
  }

  if err := cmd.Start(); err != nil {
    log.Fatal(err)
  }

  slurp, _ := io.ReadAll(stderr)
  fmt.Printf("%s\n", slurp)

  if err := cmd.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

### StdinPipe

```go
func (c *Cmd) StdinPipe() (io.WriteCloser, error)
```

`StdinPipe`返回一个管道连接该执行命令的stdin。命令执行完成后Wait方法会关闭管道。

```go
import (
  "fmt"
  "io"
  "log"
  "os/exec"
)

Example

func main() {
  cmd := exec.Command("cat")
  stdin, err := cmd.StdinPipe()
  if err != nil {
    log.Fatal(err)
  }

  go func() {
    defer stdin.Close()
    io.WriteString(stdin, "values written to stdin are passed to cmd's standard input")
  }()

  out, err := cmd.CombinedOutput()
  if err != nil {
    log.Fatal(err)
  }

  fmt.Printf("%s\n", out)
}
```

### StdoutPipe

```go
func (c *Cmd) StdoutPipe() (io.ReadCloser, error)
```

`StdoutPipe`返回一个管道连接该执行命令的stdout。命令执行完成后Wait方法会关闭管道，在Wait方法之后从管道中读取内容是不正确的。StdoutPipe不能与Run方法一起使用。

Example

```go
package main

import (
  "encoding/json"
  "fmt"
  "log"
  "os/exec"
)

func main() {
  cmd := exec.Command("echo", "-n", `{"Name": "Bob", "Age": 32}`)
  stdout, err := cmd.StdoutPipe()
  if err != nil {
    log.Fatal(err)
  }
  if err := cmd.Start(); err != nil {
    log.Fatal(err)
  }
  var person struct {
    Name string
    Age  int
  }
  if err := json.NewDecoder(stdout).Decode(&person); err != nil {
    log.Fatal(err)
  }
  if err := cmd.Wait(); err != nil {
    log.Fatal(err)
  }
  fmt.Printf("%s is %d years old\n", person.Name, person.Age)
}
```

### Wait

```go
func (c *Cmd) Wait() error
```

`Wait`阻塞直到命令执行完成。只能在Start方法之后调用。

### 案例

exmaple1: stdout和stderr分开处理

```go
package main

import (
  "bytes"
  "fmt"
  "log"
  "os/exec"
)

func main() {
  cmd := exec.Command("ls", "-lah")
  var stdout, stderr bytes.Buffer
  cmd.Stdout = &stdout
  cmd.Stderr = &stderr
  err := cmd.Run()
  if err != nil {
    log.Fatalf("cmd.Run() failed with %s\n", err)
  }
  outStr, errStr := stdout.String(), stderr.String()
  fmt.Printf("out:\n%s\nerr:\n%s\n", outStr, errStr)
}
```

exmaple2: 如果一个命令需要长时间才能执行完成，在执行过程中tail -f 输出

`test.sh`

```shell
#!/bin/bash

for i in $(seq 1 10)
do
    echo TASK${i}
    sleep 1
done
```

```go
package main

import (
    "os/exec"
    "io"
    "fmt"
    "bufio"
)

func main() {
    cmd := exec.Command("sh", "test.sh")
    stdoutIn, _ := cmd.StdoutPipe()
    stderrIn, _ := cmd.StderrPipe()
    err := cmd.Start()
    if err != nil {
      fmt.Println("err", err)
    }

    multi := io.MultiReader(stdoutIn, stderrIn)
    stdoutLogScan := bufio.NewScanner(multi)
    for stdoutLogScan.Scan() {
        fmt.Println(stdoutLogScan.Text())
    }
}
```

exmaple3: 管道方法实现`ls | wc -l`

```go
package main

import (
  "os"
  "os/exec"
)

func main() {
  c1 := exec.Command("ls")
  c2 := exec.Command("wc", "-l")
  c2.Stdin, _ = c1.StdoutPipe()
  c2.Stdout = os.Stdout
  _ = c2.Start()
  _ = c1.Run()
  _ = c2.Wait()
}
```

有一种偷巧的办法实现上面的需求

```go
package main

import (
  "fmt"
  "os"
  "os/exec"
)

func main() {
  c := exec.Command("bash", "-c", "ls | wc -l")
  out, _ := c.Output()
  fmt.Fprint(os.Stdout, string(out))
}
```
