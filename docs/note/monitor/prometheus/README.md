---
title: Prometheus
---

## 安装
 
### 下载
二进制方式

```shell
wget https://github.com/prometheus/prometheus/releases/download/v2.14.0/prometheus-2.14.0.linux-amd64.tar.gz -C /data/server/
cd /data/server && tar -zxv -f prometheus-2.14.0.linux-amd64.tar.gz
ln -s prometheus-2.14.0.linux-amd64 prometheus
```

### 启动脚本
`/etc/systemd/system/prometheus.service`
```yaml
[Unit]
Description=Prometheus Monitoring System
Documentation=Prometheus Monitoring System

[Service]
ExecStart=/data/server/prometheus/prometheus \
  --config.file=/data/server/prometheus/prometheus.yml \
  --web.listen-address=:9090

[Install]
WantedBy=multi-user.target
```

### 启动
```shell
systemctl start prometheus
```

## 架构
<img src="./images/architecture.png" alt="prometheus" style="zoom:85%;" />
<center>Prometheus架构</center>

### Promethues server
Prometheus Server是Prometheus组件中的核心部分，负责实现对监控数据的获
取，存储以及查询。Prometheus Server可以通过静态配置管理监控目标，也可
以配合使用Service Discovery的方式动态管理监控目标，并从这些监控目标中获
取数据。其次Prometheus Server需要对采集到的监控数据进行存储，
Prometheus Server本身就是一个时序数据库，将采集到的监控数据按照时间序
列的方式存储在本地磁盘当中。最后Prometheus Server对外提供了自定义的
PromQL语言，实现对数据的查询以及分析。

### Exporters
Exporter将监控数据采集的端点通过HTTP服务的形式暴露给Prometheus
Server，Prometheus Server通过访问该Exporter提供的Endpoint端点，即可获取
到需要采集的监控数据。

一般来说可以将Exporter分为2类：
  - 直接采集：这一类Exporter直接内置了对Prometheus监控的支持，比如
    cAdvisor，Kubernetes，Etcd，Gokit等，都直接内置了用于向Prometheus
    暴露监控数据的端点。
  - 间接采集：间接采集，原有监控目标并不直接支持Prometheus，因此我们需
    要通过Prometheus提供的Client Library编写该监控目标的监控采集程序。例
    如： Mysql Exporter，JMX Exporter，Consul Exporter等。

### AlertManager
在Prometheus Server中支持基于PromQL创建告警规则，如果满足PromQL定义
的规则，则会产生一条告警，而告警的后续处理流程则由AlertManager进行管
理。在AlertManager中我们可以与邮件，Slack等等内置的通知方式进行集成，
也可以通过Webhook自定义告警处理方式。AlertManager即Prometheus体系中
的告警处理中心。

### PushGateway
由于Prometheus数据采集基于Pull模型进行设计，因此在网络环境的配置上必须
要让Prometheus Server能够直接与Exporter进行通信。 当这种网络需求无法直
接满足时，就可以利用PushGateway来进行中转。可以通过PushGateway将内部
网络的监控数据主动Push到Gateway当中。而Prometheus Server则可以采用同
样Pull的方式从PushGateway中获取到监控数据。


## 指标(Metric)

### 格式
```go
<metric name>{<label name>=<label value>, ...}
```

### 类型
  1. Counter
  2. Gauge
  3. Histogram
  4. Summary
