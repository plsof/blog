---
title: 网络
---

## net

### IP

IP格式校验

```go
func ValidateIP(ip string) {
    addr := net.ParseIP(ip)
    if addr != nil {
    fmt.Println("IP地址格式不正确")
    } else {
    fmt.Println("ip地址", addr.String())
    }
}
```

检测IP地址是否在某个网络段内 gateway not in (start - end)

```go
func CompareIp(start, end, gateway string) error {
    startIp := net.ParseIP(start)
    endIp := net.ParseIP(end)
    gatewayIp := net.ParseIP(gateway)

    if bytes.Compare(startIp, endIp) > 0 {
    return errors.New("起始IP地址大于结束IP地址")
    }
    if bytes.Compare(startIp, gatewayIp) <=0 && bytes.Compare(endIp, gatewayIp) >= 0 {
    return errors.New("网关介于起始IP与结束IP之间")
    }
    return nil
}
```

IPv4地址转换为十进制 192.168.1.10 -> 3232235786

```go
package main

import (
    "net"
    "math/big"
    "fmt"
)

func main() {
    addr := net.ParseIP("192.168.1.10")
    IPv4Int := big.NewInt(0)
    IPv4Int.SetBytes(addr.To4())
    fmt.Println(IPv4Int.Int64())
}
```

十进制转换为IPv4 3232235786 -> 192.168.1.10

refer: `https://www.cnblogs.com/wangjq19920210/p/13898592.html`

```go
package main

import (
    "fmt"
    "net"
)

func main() {
    intIP := 3232235786
    var bytes [4]byte

    bytes[0] = byte(intIP & 0xFF)
    bytes[1] = byte((intIP >> 8) & 0xFF)
    bytes[2] = byte((intIP >> 16) & 0xFF)
    bytes[3] = byte((intIP >> 24) & 0xFF)

    addr := net.IPv4(bytes[3], bytes[2], bytes[1], bytes[0])
    fmt.Println(addr.String())
}
```

### Netmask

number -> 32bit `24 -> 255.255.255.0`

refer: `https://stackoverflow.com/questions/34672725/converting-netmask-number-to-32-bit-in-golang`

```go
func NetMaskToString(mask int) (netmaskstring string) {
  var binarystring string

  for ii := 1; ii <= mask; ii++ {
      binarystring = binarystring + "1"
  }
  for ii := 1; ii <= (32 - mask); ii++ {
      binarystring = binarystring + "0"
  }
  oct1 := binarystring[0:8]
  oct2 := binarystring[8:16]
  oct3 := binarystring[16:24]
  oct4 := binarystring[24:]

  ii1, _ := strconv.ParseInt(oct1, 2, 64)
  ii2, _ := strconv.ParseInt(oct2, 2, 64)
  ii3, _ := strconv.ParseInt(oct3, 2, 64)
  ii4, _ := strconv.ParseInt(oct4, 2, 64)
  netmaskstring = strconv.Itoa(int(ii1)) + "." + strconv.Itoa(int(ii2)) + "." + strconv.Itoa(int(ii3)) + "." + strconv.Itoa(int(ii4))
  return
}
```

### CIDR

计算CIDR `192.168.1.200/28 -> 192.168.1.192/28`

```go
package main

import (
    "fmt"
    "net"
)

func main() {
    addr := "192.168.1.200/28"
    _, ipNet, err := net.ParseCIDR(addr)
    if err != nil {
        fmt.Println("error", err)
        return
    }
    fmt.Println("CIDR", ipNet.String())
}
```

### Dial

检测端口的是否Open `nc -w1 -t -v 192.168.1.10`

```go
package main

import (
    "fmt"
    "net"
    "time"
)

func main() {
    address := "192.168.1.10:80"
    conn, err := net.DialTimeout("tcp", address, 1000*time.Millisecond)
    if err != nil {
        fmt.Println("error", err)
        return
    } else {
        if conn != nil {
            defer conn.Close()
            fmt.Println("telnet ok")
        } else {
            fmt.Println("telnet failed")
        }
    }
}
```

## ping

*go-ping是一个第三方的库 `github.com/go-ping/ping`*

ping 192.168.1.1

```go
package main

import (
    "github.com/go-ping/ping"
    "time"
    "fmt"
)

func main() {
    ip := "192.168.1.1"
    pinger, err := ping.NewPinger(ip)
    if err != nil {
        fmt.Println("error", err)
        return
    }
    pinger.Count = 2
    pinger.Timeout = 1000*time.Millisecond
    err = pinger.Run() // Blocks until finished.
    if err != nil {
        fmt.Println("error", err)
        return
    }
    stats := pinger.Statistics()
    if stats.PacketsRecv < 1 {
        fmt.Println("ping failed")
        return
    }
    fmt.Println("ping ok")
}
```
