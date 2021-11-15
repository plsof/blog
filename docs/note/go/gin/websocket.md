---
title: websocket
---

## gorilla/websocket

`gorilla/websocket`是websocket协议的Go实现

在Gin中使用`gorilla/websocket`

v1/task.go

```go
import (
  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
)

var upGrader = websocket.Upgrader{
  CheckOrigin: func(r *http.Request) bool {
    return true
  },
}

func WebsocketTask(c *gin.Context) {
  ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
  defer ws.Close()
  // 后面逻辑省略
}
```

router/task.go

```go
import (
  "github.com/gin-gonic/gin"
  "gin-create/api/v1"
)

func InitTaskRouter(Router *gin.RouterGroup) (R gin.IRoutes) {
  TaskRouter := Router.Group("task")
  {
    TaskRouter.GET("message", v1.WebsocketTask)
  }
  return TaskRouter
}
```
