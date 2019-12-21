---
title: 集群管理
# Cluster Administration
---

## 集群网络 | Cluster Networking

同一个Pod内多个容器之间：localhost (Container模式)

各Pod之间的通讯：Overlay Network (Flannel)

Pod与Service之间的通讯，iptables/ipvs