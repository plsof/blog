---
title: ipaddress
---

## 简介

### 介绍
`ipaddress`是Python的的自带库，提供创建和操作IPv4、IPv6地址和网络的能力

## 说明

### 实例

```python
import ipaddress

def netmask_ip_to_int(netmask):
    """
    IP类型的子网掩码转换为数字类型
    :param netmask:
    :return:
    """
    try:
        netmask_int = ipaddress.IPv4Network((0, netmask)).prefixlen
    except ipaddress.NetmaskValueError:
        raise ValidationError('子网掩码格式不合规')

    return netmask_int


def validate_ip(ip_addr):
    """
    验证IP格式
    :param ip_addr:
    :return:
    """
    try:
        ipaddress.ip_address(ip_addr)
    except ValueError:
        return False
    return True


def get_network(ip, netmask=24):
    """
    :param ip: str: ip地址
    :param netmask: int 掩码位， 8, 16 24等
    :return: str 10.20.2.0/24
    """
    interface = ipaddress.IPv4Interface((ip, netmask))
    return str(interface.network)


def ip_to_int(ip_addr):
    """
    ip 转10进制
    :param ip_addr: ip -> 178.10.10.2
    :return: int -> 2987002370
    """
    return int(ipaddress.IPv4Address(ip_addr))


def validate_domain(domain):
    """
    验证域名格式
    :param domain:
    :return:
    """
    pattern = re.compile(
        r'^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|'
        r'([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|'
        r'([a-zA-Z0-9][-_.a-zA-Z0-9]{0,61}[a-zA-Z0-9]))\.'
        r'([a-zA-Z]{2,13}|[a-zA-Z0-9-]{2,30}.[a-zA-Z]{2,3})$'
    )
    return True if pattern.match(domain) else False
```