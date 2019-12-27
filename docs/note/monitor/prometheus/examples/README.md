---
title: 实例
---

## nginx-vts

### 概述
nginx-module-vts是一个第三方的nginx插件，可以统计nginx的各种信息，v0.1.17版本开始支持数据输出格式为prometheus

### 安装
```shell
[root@localhost ~]# wget nginx-1.16.1.tar.gz -C /data/server
[root@localhost ~]# cd /data/server && tar -zxv -f nginx-1.16.1.tar.gz
[root@localhost ~]# cd nginx-1.16.1 && ./configure --prefix=/data/server/nginx --with-http_gzip_static_module --with-http_ssl_module --add-module=/data/tmp/nginx-module-vts && make -j `grep processor /proc/cpuinfo | wc -l`  &&  make install
```

项目地址`https://github.com/vozlt/nginx-module-vts`

### 输出格式
`http://127.0.0.1/status/format/prometheus`

### 配置prometheus
```yaml
global:
  evaluation_interval: 30s
  scrape_interval: 60s
scrape_configs:
- job_name: prometheus
  static_configs:
  - labels:
      instance: prometheus
    targets:
    - localhost:9090
- job_name: nginx_status_四川_西区601
  metrics_path: /status/format/prometheus
  static_configs:
  - labels:
      computerroom: 西区601
      province: 四川
    targets:
    - 10.1.33.129:8800
    - 10.1.33.130:8800
    - 10.1.33.133:8800
- job_name: nginx_status_四川_西区301
  metrics_path: /status/format/prometheus
  static_configs:
  - labels:
      computerroom: 西区301
      province: 四川
    targets:
    - 10.3.32.26:8800
    - 10.3.32.44:8800
    - 10.3.32.51:8800
```

### 配置文件验证
```shell
[root@localhost ~]# /data/server/prometheus/promtool check config /data/server/prometheus/prometheus.yml
Checking /data/server/prometheus/prometheus.yml
  SUCCESS: 0 rule files found
```

### 重启prometheus
```shell
[root@localhost ~]# systemctl restart prometheus
```

## kafka_exporter

### 概述
kafka不支持原生输出prometheus格式的数据，需要第三方的插件转换（kafka_exporter）

项目地址`https://github.com/danielqsj/kafka_exporter`

### 安装
二进制方式
```shell
[root@localhost ~]# wget 'https://github.com/danielqsj/kafka_exporter/releases/download/v1.2.0/kafka_exporter-1.2.0.linux-amd64.tar.gz' -C /data/metrics_exporter/
[root@localhost ~]# cd /data/metrics_exporter/ && tar -zxv -f kafka_exporter-1.2.0.linux-amd64
[root@localhost ~]# /data/metrics_exporter/kafka_exporter-1.2.0.linux-amd64/kafka_exporter --kafka.server=127.0.0.1:9092 &
```

### 输出格式
`http://127.0.0.1:9308/metrics`

### 配置prometheus
```yaml
# 采集kafka监控数据
  - job_name: 'kafka'
    metrics_path: /metrics
    static_configs:
    - labels:
        idc: south
      targets:
      - 192.168.0.1:9308
      - 192.168.0.2:9308
      - 192.168.0.3:9308
```

### 配置文件验证
```shell
[root@localhost ~]# /data/server/prometheus/promtool check config /data/server/prometheus/prometheus.yml
Checking /data/server/prometheus/prometheus.yml
  SUCCESS: 0 rule files found
```

### 重启prometheus
```shell
[root@localhost ~]# systemctl restart prometheus
```