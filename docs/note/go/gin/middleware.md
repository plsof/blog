---
title: 中间件
---

## 认证

### JWT

关于`JWT`的介绍可以看阮一峰老师的博客

`https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html`

```go
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

Example

```go
package middleware

import (
  "github.com/gin-gonic/gin"
  "go.uber.org/zap"
  "sdn-lcm/global"
  "sdn-lcm/model/response"
  "sdn-lcm/utils"
)

中间件
func JWTAuth() gin.HandlerFunc {
  return func(c *gin.Context) {
    token := c.Request.Header.Get("x-token")
    if token == "" {
      global.ARSDN_LOG.Error("未登陆或非法登陆")
      response.FailWithDetailed(gin.H{"reload": true}, "未登陆或非法登陆", c)
      c.Abort()
      return
    }
    j := utils.NewJWT()
    // parseToken 解析token包含的信息
    claims, err := j.ParseToken(token)
    if err != nil {
      if err == utils.TokenExpired {
        global.ARSDN_LOG.Error("授权已过期")
        response.FailWithDetailed(gin.H{"reload": true}, "授权已过期", c)
        c.Abort()
        return
      }
      global.ARSDN_LOG.Error("jwt", zap.Error(err))
      response.FailWithDetailed(gin.H{"reload": true}, err.Error(), c)
      c.Abort()
      return
    }
    c.Set("claims", claims)
    c.Next()
  }
}
```

JWT生成、解析函数

```go
package utils

import (
  "errors"
  "github.com/dgrijalva/jwt-go"
  "sdn-lcm/global"
  "sdn-lcm/model/request"
)

type JWT struct {
  SigningKey []byte
}

var (
  TokenExpired     = errors.New("Token is expired")
  TokenNotValidYet = errors.New("Token not active yet")
  TokenMalformed   = errors.New("That's not even a token")
  TokenInvalid     = errors.New("Couldn't handle this token:")
)

func NewJWT() *JWT {
  return &JWT{
    []byte("kubeops"),
  }
}

// 创建token

func (j *JWT) CreateToken(claims request.CustomClaims) (string, error) {
  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(j.SigningKey)
}


// 解析token

func (j *JWT) ParseToken(tokenString string) (*request.CustomClaims, error) {
  token, err := jwt.ParseWithClaims(tokenString, &request.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
    return j.SigningKey, nil
  })
  if err != nil {
    if ve, ok := err.(*jwt.ValidationError); ok {
      if ve.Errors&jwt.ValidationErrorMalformed != 0 {
        return nil, TokenMalformed
      } else if ve.Errors&jwt.ValidationErrorExpired != 0 {
        // token is expired
        return nil, TokenExpired
      } else if ve.Errors&jwt.ValidationErrorNotValidYet != 0 {
        return nil, TokenNotValidYet
      } else {
        return nil, TokenInvalid
      }
    }
  }
  if token != nil {
    if claims, ok := token.Claims.(*request.CustomClaims); ok && token.Valid {
      return claims, nil
    }
    return nil, TokenInvalid
  } else {
    return nil, TokenInvalid
  }
}
```

自定义Claims

```go
package request

import (
  "github.com/dgrijalva/jwt-go"
)

// Custom claims structure

type CustomClaims struct {
  ID          uint
  Username    string
  BufferTime  int64
  jwt.StandardClaims
}
```

## 鉴权
