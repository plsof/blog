---
title: Generic views
---

## GenericAPIVIEW

### 概述
```python
from rest_framework.generics import GenericAPIView
```

`GenericAPIView`继承`APIView`, 其它的generic views都是继承`GenericAPIView`和其它minix类的集合

### 属性

#### 基本设置
+ `queryset`

+ `serializer_class`

+ `lookup_field`

+ `lookup_url_kwarg`

#### 分页
+ `pagination_class` - 默认值`DEFAULT_PAGINATION_CLASS`，设置`pagination_class=None`在当前view关闭分页

#### 过滤
+ `filter_backends` - 默认值`DEFAULT_FILTER_BACKENDS`

### 方法

#### 基本方法

+ `get_queryset(self)`

+ `get_object(self)`

+ `filter_queryset(self, queryset)`

+ `get_serializer_class(self)`

#### 其它方法

+ `get_serializer_context(self)`

+ `get_serializer(self, instance=None, data=None, many=False, partial=False)` - 返回serializer实例

+ `get_paginated_response(self, data)` - 返回分页风格的`Response`object

+ `paginate_queryset(self, queryset)` - 分页queryset

+ `filter_queryset(self, queryset)` - 用filter backends过滤queryset

## Concrete View Classes

### CreateAPIView

**create-only**，继承`GenericAPIVIEW`、`CreateModelMixin`

### ListAPIView

**read-only**，代表model实例的集合，继承`GenericAPIVIEW`、`ListModelMixin`

### RetrieveAPIView

**read-only**，代表一个单独的model实例，继承`GenericAPIView`、`RetrieveModelMixin`

### DestroyAPIView

**delete-only**，删除一个model实例，继承`GenericAPIView`、`DestroyModelMixin`

### UpdateAPIView

**update-only**，更新一个model实例，继承`GenericAPIView`、`UpdateModelMixin`

### ListCreateAPIView

**read-write**，一组model实例的集合，继承`GenericAPIView`、`ListModelMixin`、`CreateModelMixin`

### RetrieveUpdateAPIView

**read or update**，代表一个单独的model实例，继承`GenericAPIView`、`RetrieveModelMixin`、`UpdateModelMixin`

### RetrieveDestroyAPIView

**read or delete**，代表一个单独的model实例，继承`GenericAPIView`、`RetrieveModelMixin`、`DestroyModelMixin`

### RetrieveUpdateDestroyAPIView

**read-write-delete**，代表一个单独的model实例，继承`GenericAPIView`、`RetrieveModelMixin`、`UpdateModelMixin`、`DestroyModelMixin`