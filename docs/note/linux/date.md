<center>
    <h1>date</h1>
</center>

## 标准时间 -> unix时间戳

```shell
date -d '2015-10-20 15:07:02' +%s
```



## unix时间戳 -> 标准时间

```shell
date -d @1445324822
```



## 基准时间前后

#### 某基准时间前一天

```shell
date "-d -1 days 20150203" "+%Y_%m_%d"
```

#### 某基准时间前一小时

```shell
date -d "-1 hours 20191001 01:03:00" "+[%Y-%m-%dT%H:%M:%S+08:00]"
```



#### 某基准时间前一分钟

```shell
date -d "-1 minute 20191001 0950" "+[%Y-%m-%dT%H:%M:%S+08:00]"
```

#### 某基准时间前一秒

```shell
date -d "-1 seconds 20191001 01:03:00" "+[%Y-%m-%dT%H:%M:%S+08:00]"
```

