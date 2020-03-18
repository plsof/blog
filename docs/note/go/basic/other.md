---
title: 其它
---

## 安装

## 编译

### 交叉编译

Golang支持交叉编译，在一个平台上生成另一个平台的可执行程序

`查看Golang支持的编译操作系统和体系架构`
```shell
go tool dist list
```

`环境变量说明`

| 名称         | 说明 |
| :---------- | :--------------------- |
| CGO_ENABLED | 指明cgo工具是否可用的标识 |
| GOOS        | 程序构建环境的目标操作系统 |
| GOARCH      | 程序构建环境的目标计算架构 |

`Mac -> Linux/amd64`

```shell
sudo env GOOS=linux GOARCH=amd64 go build -o getip main.go
```

**交叉编译时源码中有C代码，比如引用go-sqlite3模块，这时候就需要设置CGO_ENABLED=1，此外还要交叉编译器的支持**

Mac安装Linux交叉编译器

CentOS6交叉编译器地址:
`http://crossgcc.rts-software.org/download/gcc-4.8.0-for-linux32-linux64/gcc-4.8.0-for-linux64.dmg`

```zsh
sudo env CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=/usr/local/gcc-4.8.0-for-linux64/bin/x86_64-pc-linux-gcc go build -o main main.go
```

CentOS7交叉编译器地址:
`http://crossgcc.rts-software.org/download/gcc-4.8.1-for-linux32-linux64/gcc-4.8.1-for-linux64.dmg`

```zsh
sudo env CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=/usr/local/gcc-4.8.1-for-linux64/bin/x86_64-pc-linux-gcc go build -o main main.go
```