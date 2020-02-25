---
title: Harbor
---

## 安装
docker安装不予累赘

## 上传镜像
### 打标签
```shell
➜  ~ docker tag myhttp:v1 172.188.3.24:8000/library/myhttp:v1
```

### 设置http推送
`/etc/docker/daemon.json`
```json
{
  "insecure-registries" : [
    "172.188.3.24:8000"
  ]
}
```

### 登陆仓库
```shell
➜  ~ docker login 172.188.3.24:8000
Username: admin
Password:
Login Succeeded
```
**公共仓库上传和下载不需要登陆**

### 推送
```shell
➜  ~ docker push 172.188.3.24:8000/library/myhttp:v1
```

## 下载镜像
```shell
➜  ~ docker pull 172.188.3.24:8000/library/myhttp:v1
```