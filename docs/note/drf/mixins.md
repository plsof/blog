---
title: Mixins
---

```python
from rest_framework.generics import mixins
```

mixin类提供用于基本视图行为的操作（actions），注意不是handler方法，例如`.get()`、`.post()`

## ListModelMixin

提供`.list(request, *args, **kwargs)`方法，列出queryset

## CreateModelMixin

提供`.create(request, *args, **kwargs)`方法，创建和保存一个新的model实例

## RetrieveModelMixin

提供`.retrieve(request, *args, **kwargs)`方法，返回一个存在的model实例

## UpdateModelMixin

提供`.update(request, *args, **kwargs)`方法，更新和保存一个存在的model实例。也提供`.partial_update(request, *args, **kwargs)`方法，可以更新model实例的部分字段（HTTP PATCH方法）

## DestroyModelMixin

提供`.destroy(request, *args, **kwargs)`方法，删除一个已经存在的model实例