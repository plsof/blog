(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{438:function(e,t,a){"use strict";a.r(t);var r=a(54),i=Object(r.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h2",{attrs:{id:"genericapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#genericapiview"}},[e._v("#")]),e._v(" GenericAPIVIEW")]),e._v(" "),a("h3",{attrs:{id:"概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#概述"}},[e._v("#")]),e._v(" 概述")]),e._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("from")]),e._v(" rest_framework"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("generics "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("import")]),e._v(" GenericAPIView\n")])])]),a("p",[a("code",[e._v("GenericAPIView")]),e._v("继承"),a("code",[e._v("APIView")]),e._v(", 其它的generic views都是继承"),a("code",[e._v("GenericAPIView")]),e._v("和其它minix类的集合")]),e._v(" "),a("h3",{attrs:{id:"属性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#属性"}},[e._v("#")]),e._v(" 属性")]),e._v(" "),a("h4",{attrs:{id:"基本设置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基本设置"}},[e._v("#")]),e._v(" 基本设置")]),e._v(" "),a("ul",[a("li",[a("p",[a("code",[e._v("queryset")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("serializer_class")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("lookup_field")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("lookup_url_kwarg")])])])]),e._v(" "),a("h4",{attrs:{id:"分页"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#分页"}},[e._v("#")]),e._v(" 分页")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("pagination_class")]),e._v(" - 默认值"),a("code",[e._v("DEFAULT_PAGINATION_CLASS")]),e._v("，设置"),a("code",[e._v("pagination_class=None")]),e._v("在当前view关闭分页")])]),e._v(" "),a("h4",{attrs:{id:"过滤"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#过滤"}},[e._v("#")]),e._v(" 过滤")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("filter_backends")]),e._v(" - 默认值"),a("code",[e._v("DEFAULT_FILTER_BACKENDS")])])]),e._v(" "),a("h3",{attrs:{id:"方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#方法"}},[e._v("#")]),e._v(" 方法")]),e._v(" "),a("h4",{attrs:{id:"基本方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基本方法"}},[e._v("#")]),e._v(" 基本方法")]),e._v(" "),a("ul",[a("li",[a("p",[a("code",[e._v("get_queryset(self)")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("get_object(self)")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("filter_queryset(self, queryset)")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("get_serializer_class(self)")])])])]),e._v(" "),a("h4",{attrs:{id:"其它方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#其它方法"}},[e._v("#")]),e._v(" 其它方法")]),e._v(" "),a("ul",[a("li",[a("p",[a("code",[e._v("get_serializer_context(self)")])])]),e._v(" "),a("li",[a("p",[a("code",[e._v("get_serializer(self, instance=None, data=None, many=False, partial=False)")]),e._v(" - 返回serializer实例")])]),e._v(" "),a("li",[a("p",[a("code",[e._v("get_paginated_response(self, data)")]),e._v(" - 返回分页风格的"),a("code",[e._v("Response")]),e._v("object")])]),e._v(" "),a("li",[a("p",[a("code",[e._v("paginate_queryset(self, queryset)")]),e._v(" - 分页queryset")])]),e._v(" "),a("li",[a("p",[a("code",[e._v("filter_queryset(self, queryset)")]),e._v(" - 用filter backends过滤queryset")])])]),e._v(" "),a("h2",{attrs:{id:"concrete-view-classes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#concrete-view-classes"}},[e._v("#")]),e._v(" Concrete View Classes")]),e._v(" "),a("h3",{attrs:{id:"createapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#createapiview"}},[e._v("#")]),e._v(" CreateAPIView")]),e._v(" "),a("p",[a("strong",[e._v("create-only")]),e._v("，继承"),a("code",[e._v("GenericAPIVIEW")]),e._v("、"),a("code",[e._v("CreateModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"listapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#listapiview"}},[e._v("#")]),e._v(" ListAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read-only")]),e._v("，代表model实例的集合，继承"),a("code",[e._v("GenericAPIVIEW")]),e._v("、"),a("code",[e._v("ListModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"retrieveapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#retrieveapiview"}},[e._v("#")]),e._v(" RetrieveAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read-only")]),e._v("，代表一个单独的model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("RetrieveModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"destroyapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#destroyapiview"}},[e._v("#")]),e._v(" DestroyAPIView")]),e._v(" "),a("p",[a("strong",[e._v("delete-only")]),e._v("，删除一个model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("DestroyModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"updateapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#updateapiview"}},[e._v("#")]),e._v(" UpdateAPIView")]),e._v(" "),a("p",[a("strong",[e._v("update-only")]),e._v("，更新一个model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("UpdateModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"listcreateapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#listcreateapiview"}},[e._v("#")]),e._v(" ListCreateAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read-write")]),e._v("，一组model实例的集合，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("ListModelMixin")]),e._v("、"),a("code",[e._v("CreateModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"retrieveupdateapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#retrieveupdateapiview"}},[e._v("#")]),e._v(" RetrieveUpdateAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read or update")]),e._v("，代表一个单独的model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("RetrieveModelMixin")]),e._v("、"),a("code",[e._v("UpdateModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"retrievedestroyapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#retrievedestroyapiview"}},[e._v("#")]),e._v(" RetrieveDestroyAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read or delete")]),e._v("，代表一个单独的model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("RetrieveModelMixin")]),e._v("、"),a("code",[e._v("DestroyModelMixin")])]),e._v(" "),a("h3",{attrs:{id:"retrieveupdatedestroyapiview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#retrieveupdatedestroyapiview"}},[e._v("#")]),e._v(" RetrieveUpdateDestroyAPIView")]),e._v(" "),a("p",[a("strong",[e._v("read-write-delete")]),e._v("，代表一个单独的model实例，继承"),a("code",[e._v("GenericAPIView")]),e._v("、"),a("code",[e._v("RetrieveModelMixin")]),e._v("、"),a("code",[e._v("UpdateModelMixin")]),e._v("、"),a("code",[e._v("DestroyModelMixin")])])])}),[],!1,null,null,null);t.default=i.exports}}]);