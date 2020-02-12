---
title: 编译
---

## 交叉编译
查看Golang支持的平台和版本
```shell
go tool dist list
```

linux/amd64
```shell
sudo env GOOS=linux GOARCH=amd64 go build -o getip main.go
```