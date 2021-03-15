---
title: netifaces
---

## 简介

### 介绍
`netifaces`是一个轻便的获取网络接口信息的库

### 安装
`pip install netifaces`

## 说明

### 实例

```python
def get_local_netmask_by_ip(ip_addr):
    """
    获取本机指定ip所在网卡的netmask
    :param ip_addr:
    :return:
    """
    netmask = ''

    for nic in netifaces.interfaces():
        try:
            if ip_addr == netifaces.ifaddresses(nic)[netifaces.AF_INET][0]['addr']:
                netmask = netifaces.ifaddresses(nic)[netifaces.AF_INET][0]['netmask']
                continue
        except KeyError:
            pass

    if netmask:
        return netmask_ip_to_int(netmask)
    else:
        return None

def network_rest_ip(ip_addr):
    """
    筛选网段可用的IP地址
    :param ip_addr:
    :return:
    """
    gateway = netifaces.gateways()['default'][netifaces.AF_INET][0]
    netmask = ''

    for nic in netifaces.interfaces():
        try:
            if ip_addr == netifaces.ifaddresses(nic)[netifaces.AF_INET][0]['addr']:
                netmask = netifaces.ifaddresses(nic)[netifaces.AF_INET][0]['netmask']
                continue
        except KeyError:
            pass

    ip_net = f'{ip_addr}/{netmask_ip_to_int(netmask)}'

    ip_list = (str(host) for host in ipaddress.ip_network(ip_net, strict=False).hosts() if str(host) != gateway)

    return ip_list
```