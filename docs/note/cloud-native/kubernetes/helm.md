---
title: Helm
---

## 概述

`Version v2.16.1`

Helm: 客户端，管理本地的Chart仓库，于Tiller服务器交互，发送Chart，实例安装，查询，卸载等操作

Tiller: 服务端，接收helm发来的Charts与Config，合并生成release

Chart: helm程序包

Repository: Charts仓库，http/https服务器

Release: 特定Chart部署于目标集群上的一个实例

Chart -> Config -> Release

## 部署

`添加service account和clusterRoleBinding`

`helm-rbac.yaml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

```shell
kubectl apply -f helm-rbac.yaml
```

`安装helm`

```shell
wget 'https://get.helm.sh/helm-v2.16.1-linux-amd64.tar.gz'
tar -zxv -f helm-v2.16.1-linux-amd64.tar.gz; cp ./linux-amd64/helm /usr/local/bin
```

`初始化helm; 部署tiller`

```shell
helm init --service-account=tiller --tiller-image=sapcc/tiller:v2.16.1 --stable-repo-url=https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts --history-max 300
```

说明：

因为某些原因 需要将默认tiller-image, stable-repo源替换掉

`启动本地Repository Server`

```shell
[root@master helm]# helm serve &
[root@master helm]# helm repo list
NAME  	URL
stable	http://mirror.azure.cn/kubernetes/charts/
local 	http://127.0.0.1:8879/charts
```

`查看版本`

```shell
[root@master ~]# helm version
Client: &version.Version{SemVer:"v2.16.1", GitCommit:"bbdfe5e7803a12bbdf97e94cd847859890cf4050", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.16.1", GitCommit:"bbdfe5e7803a12bbdf97e94cd847859890cf4050", GitTreeState:"clean"}
```

`参考`

`https://devopscube.com/install-configure-helm-kubernetes/`

## 实战

### 项目myhttp

部署ingress方式的myhttp服务

`创建myhttp chart`

```shell
[root@master helm]# helm create myhttp
[root@master helm]# tree myhttp
myhttp
├── charts
├── Chart.yaml  # 该chart的描述文件
├── templates   # 目录下是YAML文件的模板，该模板文件遵循Go template语法
│   ├── deployment.yaml
│   ├── _helpers.tpl  # 全局模版，给其它模版使用
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml # 变量值文件，给templates里面的模版文件引用

3 directories, 9 files
```

`修改配置文件内容`

1. `values.yaml`

```yaml
replicaCount: 2

image:
  repository: 172.188.3.24:8000/library/myhttp
  tag: v1

ingress:
  enabled: true
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: www.myhttp.com
      paths: ['/']  # 如果多个uri ['/', '/api']
```

`检查依赖和模板配置是否正确`

```shell
[root@master helm]# helm lint myhttp
==> Linting myhttp
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, no failures
```

`打包chart`

```shell
[root@master helm]# helm package myhttp --debug
Successfully packaged chart and saved it to: /root/helm/myhttp-0.1.0.tgz
[debug] Successfully saved /root/helm/myhttp-0.1.0.tgz to /root/.helm/repository/local

```

`查看chart`

```shell
[root@master helm]# helm search myhttp
NAME        	CHART VERSION	APP VERSION	DESCRIPTION
local/myhttp	0.1.0        	1.0        	A Helm chart for Kubernetes
```

`在kubernetes部署chart`

1. `预部署`
```shell
[root@master helm]# helm install --dry-run --debug local/myhttp --name myhttp-chart
[debug] Created tunnel using local port: '7474'

[debug] SERVER: "127.0.0.1:7474"

[debug] Original chart version: ""
[debug] Fetched local/myhttp to /root/.helm/cache/archive/myhttp-0.1.0.tgz

[debug] CHART PATH: /root/.helm/cache/archive/myhttp-0.1.0.tgz

NAME:   myhttp-chart
REVISION: 1
RELEASED: Fri Feb 21 15:02:14 2020
CHART: myhttp-0.1.0
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: 172.188.3.24:8000/library/myhttp
  tag: v1
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: true
  hosts:
  - host: www.myhttp.com
    paths:
    - /
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 2
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
---
# myhttp-chart-test-connection
apiVersion: v1
kind: Pod
metadata:
  name: "myhttp-chart-test-connection"
  labels:
    app.kubernetes.io/name: myhttp
    helm.sh/chart: myhttp-0.1.0
    app.kubernetes.io/instance: myhttp-chart
    app.kubernetes.io/version: "1.0"
    app.kubernetes.io/managed-by: Tiller
  annotations:
    "helm.sh/hook": test-success
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args:  ['myhttp-chart:80']
  restartPolicy: Never
MANIFEST:

---
# Source: myhttp/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: myhttp-chart
  labels:
    app.kubernetes.io/name: myhttp
    helm.sh/chart: myhttp-0.1.0
    app.kubernetes.io/instance: myhttp-chart
    app.kubernetes.io/version: "1.0"
    app.kubernetes.io/managed-by: Tiller
---
# Source: myhttp/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myhttp-chart
  labels:
    app.kubernetes.io/name: myhttp
    helm.sh/chart: myhttp-0.1.0
    app.kubernetes.io/instance: myhttp-chart
    app.kubernetes.io/version: "1.0"
    app.kubernetes.io/managed-by: Tiller
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: myhttp
    app.kubernetes.io/instance: myhttp-chart
---
# Source: myhttp/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myhttp-chart
  labels:
    app.kubernetes.io/name: myhttp
    helm.sh/chart: myhttp-0.1.0
    app.kubernetes.io/instance: myhttp-chart
    app.kubernetes.io/version: "1.0"
    app.kubernetes.io/managed-by: Tiller
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: myhttp
      app.kubernetes.io/instance: myhttp-chart
  template:
    metadata:
      labels:
        app.kubernetes.io/name: myhttp
        app.kubernetes.io/instance: myhttp-chart
    spec:
      serviceAccountName: myhttp-chart
      securityContext:
        {}

      containers:
        - name: myhttp
          securityContext:
            {}

          image: "172.188.3.24:8000/library/myhttp:v1"
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
          readinessProbe:
            httpGet:
              path: /
              port: http
          resources:
            {}
---
# Source: myhttp/templates/ingress.yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: myhttp-chart
  labels:
    app.kubernetes.io/name: myhttp
    helm.sh/chart: myhttp-0.1.0
    app.kubernetes.io/instance: myhttp-chart
    app.kubernetes.io/version: "1.0"
    app.kubernetes.io/managed-by: Tiller
spec:
  rules:
    - host: "www.myhttp.com"
      http:
        paths:
          - path: /
            backend:
              serviceName: myhttp-chart
              servicePort: 80
```

2. `部署`

```shell
[root@master helm]# helm install local/myhttp --name myhttp-chart
NAME:   myhttp-chart
LAST DEPLOYED: Fri Feb 21 15:06:32 2020
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME          AGE
myhttp-chart  0s

==> v1/Pod(related)
NAME                           AGE
myhttp-chart-699c968dc7-747kj  0s
myhttp-chart-699c968dc7-sss9t  0s

==> v1/Service
NAME          AGE
myhttp-chart  0s

==> v1/ServiceAccount
NAME          AGE
myhttp-chart  0s

==> v1beta1/Ingress
NAME          AGE
myhttp-chart  0s


NOTES:
1. Get the application URL by running these commands:
  http://www.myhttp.com/
```

3. `测试、验证`

```shell
[root@master helm]# kubectl get deployment -l 'app.kubernetes.io/instance=myhttp-chart,app.kubernetes.io/name=myhttp'
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
myhttp-chart   2/2     2            2           63m
[root@master helm]# kubectl get svc -l 'app.kubernetes.io/instance=myhttp-chart,app.kubernetes.io/name=myhttp'
NAME           TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
myhttp-chart   ClusterIP   10.106.44.95   <none>        80/TCP    64m
[root@master helm]# kubectl get ingress
NAME           HOSTS                        ADDRESS          PORTS   AGE
myhttp-chart   www.myhttp.com               10.108.162.246   80      64m
```

```shell
➜  ~ curl -x '172.188.2.86:80' 'http://www.myhttp.com'
{"status": "SUCCESS", "data": "hello from server"}
```

### 升级

myhttp:v1 -> myhttp:v2

`修改配置文件`

`values.yaml`

```yaml
image:
  repository: 172.188.3.24:8000/library/myhttp
  tag: v2
  pullPolicy: IfNotPresent
```

`Chart.yaml`

```yaml
version: 0.2.0
```

`打包`

```shell
[root@master helm]# helm package myhttp --debug
Successfully packaged chart and saved it to: /root/helm/myhttp-0.2.0.tgz
[debug] Successfully saved /root/helm/myhttp-0.2.0.tgz to /root/.helm/repository/local

```

`查看版本`

```shell
[root@master helm]# helm search myhttp -l
NAME        	CHART VERSION	APP VERSION	DESCRIPTION
local/myhttp	0.2.0        	1.0        	A Helm chart for Kubernetes
local/myhttp	0.1.0        	1.0        	A Helm chart for Kubernetes
```

`升级, 如果没有指定版本默认升级到最新版本`

```shell
[root@master helm]# helm upgrade myhttp-chart local/myhttp --version=0.2.0
Release "myhttp-chart" has been upgraded.
LAST DEPLOYED: Fri Feb 21 16:44:55 2020
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME          AGE
myhttp-chart  98m

==> v1/Pod(related)
NAME                           AGE
myhttp-chart-699c968dc7-747kj  98m
myhttp-chart-699c968dc7-sss9t  98m
myhttp-chart-cf9f495d8-jrh42   0s

==> v1/Service
NAME          AGE
myhttp-chart  98m

==> v1/ServiceAccount
NAME          AGE
myhttp-chart  98m

==> v1beta1/Ingress
NAME          AGE
myhttp-chart  98m


NOTES:
1. Get the application URL by running these commands:
  http://www.myhttp.com/
```

`验证、测试`

```shell
[root@master helm]# helm list
NAME        	REVISION	UPDATED                 	STATUS  	CHART        	APP VERSION	NAMESPACE
myhttp-chart	2       	Fri Feb 21 16:44:55 2020	DEPLOYED	myhttp-0.2.0 	1.0        	default
```

```shell
➜  ~ curl -x '172.188.2.86:80' 'http://www.myhttp.com'
{"status": "SUCCESS", "version": "v2", "hostname": "myhttp-chart-cf9f495d8-8vcdj", "IP": "10.244.1.11"}
```

### 回退

`查看Release变更记录`

```shell
[root@master helm]# helm history myhttp-chart
REVISION	UPDATED                 	STATUS    	CHART       	APP VERSION	DESCRIPTION
1       	Fri Feb 21 15:06:32 2020	SUPERSEDED	myhttp-0.1.0	1.0        	Install complete
2       	Fri Feb 21 16:44:55 2020	DEPLOYED  	myhttp-0.2.0	1.0        	Upgrade complete
```

`回退`

```shell
[root@master helm]# helm rollback myhttp-chart 1
Rollback was a success.
```

`验证、测试`

```shell
[root@master helm]# helm list
NAME        	REVISION	UPDATED                 	STATUS  	CHART        	APP VERSION	NAMESPACE
myhttp-chart	3       	Fri Feb 21 16:53:25 2020	DEPLOYED	myhttp-0.1.0 	1.0        	default
[root@master helm]# helm history myhttp-chart
REVISION	UPDATED                 	STATUS    	CHART       	APP VERSION	DESCRIPTION
1       	Fri Feb 21 15:06:32 2020	SUPERSEDED	myhttp-0.1.0	1.0        	Install complete
2       	Fri Feb 21 16:44:55 2020	SUPERSEDED	myhttp-0.2.0	1.0        	Upgrade complete
3       	Fri Feb 21 16:53:25 2020	DEPLOYED  	myhttp-0.1.0	1.0        	Rollback to 1
```

```shell
➜  ~ curl -x '172.188.2.86:80' 'http://www.myhttp.com'
{"status": "SUCCESS", "data": "hello from server"}
```

### 删除

`删除`

```shell
[root@master helm]# helm delete myhttp-chart
release "myhttp-chart" deleted
```

`验证`

```shell
[root@master helm]# helm list -a
NAME        	REVISION	UPDATED                 	STATUS  	CHART        	APP VERSION	NAMESPACE
myhttp-chart	3       	Fri Feb 21 16:53:25 2020	DELETED 	myhttp-0.1.0 	1.0        	default
[root@master helm]# helm history myhttp-chart
REVISION	UPDATED                 	STATUS    	CHART       	APP VERSION	DESCRIPTION
1       	Fri Feb 21 15:06:32 2020	SUPERSEDED	myhttp-0.1.0	1.0        	Install complete
2       	Fri Feb 21 16:44:55 2020	SUPERSEDED	myhttp-0.2.0	1.0        	Upgrade complete
3       	Fri Feb 21 16:53:25 2020	DELETED   	myhttp-0.1.0	1.0        	Deletion complete
```