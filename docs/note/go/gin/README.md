---
title: Gin
---

## websocket

```go
package api

import (
 "DPM_Agent/model/response"
 "DPM_Agent/utils"
 "github.com/gin-gonic/gin"
 "github.com/gorilla/websocket"
 "net/http"
)

// @Summary bash docker container
// @Produce bit
// @Router /container/terminal

var upGrader = websocket.Upgrader{
 CheckOrigin: func(r *http.Request) bool {
  return true
 },
}

func TerminalContainer(c *gin.Context) {
//升级get请求为webSocket协议
 ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
 if err != nil {
  return
 }
 defer ws.Close()
 container, ok := c.GetQuery("container")
 if !ok {
  response.FailWithMessage("参数为空或不正确", c)
  return
 }
// 执行exec，获取到容器终端的连接
 hr, err := utils.ExecContainerBash(container, "/root")
 if err != nil {
  return
 }
// 关闭I/O流
 defer hr.Close()
// 退出进程
 defer func() {
  hr.Conn.Write([]byte("exit\r"))
 }()

 go func() {
  utils.WsWriterCopy(hr.Conn, ws)
 }()
 utils.WsReaderCopy(ws, hr.Conn)
}
```
