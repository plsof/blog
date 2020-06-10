---
title: GORM
---

## CRUD

### 创建

### 查询

### 更新

#### 更新修改字段
```go
db.Model(&Email{}).Where("id = ?", 2).Update("email", "plsof@qq.com")
```

### 删除

## 关联

### Belongs to

### Has One

### Has Many

### Many To Many

### 案例

1. 数据结构

| 表1 | 表2 | 关联关系 |
| ---- | --- | -------- |
| user | address | belongs_to |
| user | email | has_many |
| user | creditcard | has_one |
| user | languages | many_to_many |

<img src="./images/related.png" alt="gorm" style="zoom:85%;" />

2. 代码
```go
package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type User struct {
	ID                uint       `gorm:"primary_key"`
	Birthday          string     `gorm:"column:birthday"`
	Age               int        `gorm:"column:age"`
	Name              string     `gorm:"column:name"`
	BillingAddress    Address    `gorm:"foreignkey:BillingAddressId;"` // One-To-One (属于 - 本表的BillingAddressID作外键
	BillingAddressId  int        `gorm:"column:billing_address_id"`
	ShippingAddress   Address    `gorm:"foreignkey:ShippingAddressId;"` // One-To-One (属于 - 本表的ShippingAddressID作外键)
	ShippingAddressId int        `gorm:"column:shipping_address_id"`
	CreditCard        CreditCard `gorm:"foreignkey:UserID;"` // One-To-One (拥有一个 - CreditCard表的UserID作外键)
	Emails            []Email    `gorm:"ForeignKey:UserID;"`            // One-To-Many (拥有多个 - Email表的UserID作外键)
	Languages         []Language `gorm:"many2many:user_languages;"`     // Many-To-Many , 'user_languages'是连接表
}

type Email struct {
	ID     int    `gorm:"primary_key"`
	UserID int    `gorm:"column:user_id;"` // 外键 (属于), tag `index`是为该列创建索引
	Email  string `gorm:"column:email"`    // `type`设置sql类型, `unique_index` 为该列设置唯一索引
}

type Address struct {
	ID       int    `gorm:"primary_key"`
	Address1 string `gorm:"column:address1"` // 设置字段为非空并唯一
	Address2 string `gorm:"column:address2"`
	Post     string `gorm:"column:post"`
}

type Language struct {
	ID   int    `gorm:"primary_key"`
	Name string `gorm:"column:name"` // 创建索引并命名，如果找到其他相同名称的索引则创建组合索引
	Code string `gorm:"column:code"` // `unique_index` also works
}

type CreditCard struct {
	ID     int    `gorm:"primary_key"`
	UserID int    `gorm:"column:user_id;"`
	Number string `gorm:"column:number"`
}

func main() {
	db, err := gorm.Open("mysql", "root:21ysten123@(127.0.0.1)/gorm?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic(err)
	}
	defer db.Close()
	db.AutoMigrate(&User{},
		Email{},
		Address{},
		Language{},
		CreditCard{})

	var creditCard1 CreditCard
	creditCard1.ID = 1
	creditCard1.UserID = 1001
	creditCard1.Number = "1001PDD"

	var creditCard2 CreditCard
	creditCard2.ID = 2
	creditCard2.UserID = 1002
	creditCard2.Number = "1002PXX"

	var language1 Language
	language1.ID = 1
	language1.Name = "english"
	language1.Code = "101ENG"

	var language2 Language
	language2.ID = 2
	language2.Name = "chinese"
	language2.Code = "102CHI"

	languages := make([]Language, 2)
	languages[0] = language1
	languages[1] = language2

	var address Address
	address.ID = 1
	address.Address1 = "扬州市"
	address.Address2 = "无锡市"
	address.Post = "214000"

	var email1 Email
	email1.ID = 1
	email1.UserID = 11
	email1.Email = "254995740@qq.com"

	var email2 Email
	email2.ID = 2
	email2.UserID = 12
	email2.Email = "1103901630@qq.com"

	oEmails1 := make([]Email, 1)
	oEmails1[0] = email1

	oEmails2 := make([]Email, 1)
	oEmails2[0] = email2

	var user1 User
	user1.ID = 1
	user1.Birthday = "1029"
	user1.Age = 30
	user1.Name = "pdd"
	user1.BillingAddress = address
	user1.BillingAddressId = 1
	user1.ShippingAddress = address
	user1.ShippingAddressId = 2
	user1.CreditCard = creditCard1
	user1.Emails = oEmails1
	user1.Languages = languages

	var user2 User
	user2.ID = 2
	user2.Birthday = "1030"
	user2.Age = 30
	user2.Name = "pxx"
	user2.BillingAddress = address
	user2.BillingAddressId = 2
	user2.ShippingAddress = address
	user2.ShippingAddressId = 2
	user2.CreditCard = creditCard2
	user2.Emails = oEmails2
	user2.Languages = languages

	//插入数据
	//db.Create(&creditCard1)
	//db.Create(&creditCard2)
	//db.Create(&language1)
	//db.Create(&language2)
	//db.Create(&address)
	//db.Create(&email1)
	//db.Create(&email2)
	//db.Create(&user1)
	//db.Create(&user2)

	//删除数据
	//db.Delete(&user)

	//查询
	u := User{ID: 1}
	db.Model(&u).Debug().Find(&u)
	db.Model(&u).Debug().Related(&u.CreditCard,"CreditCard")
	db.Model(&u).Debug().Related(&u.Emails,"Emails")
	db.Model(&u).Debug().Related(&u.Languages, "Languages")
	db.Model(&u).Debug().Related(&u.BillingAddress,"BillingAddress")
	db.Model(&u).Debug().Related(&u.ShippingAddress,"ShippingAddress")
	fmt.Println(u)
}
```

```go
{1 1029 30 pdd {1 扬州市 无锡市 214000} 1 {1 扬州市 无锡市 214000} 1 {1 1 1001PDD} [{1 1 254995740@qq.com}] [{1 english 101ENG} {2 chinese 102CHI}]}
```