---
layout: post
title:  "JPA 일대일, 다대다 매핑"
date:   "2023-01-30"
category: "tech"
tags: ["JPA", "JPA 스터디"]
---
## 일대일 매핑

일대일 매핑의 경우, 반대방향도 일대일이므로 일대다/다대일에서 연관관계의 주인이 항상 “다”쪽이었던것과 달리 연관관계의 주인이 어느 쪽이든 가능하다. 

하지만 주/대상 관계에 따라 장단점이 존재한다. 

주 테이블이란? 아래 그림에서 멤버처럼 라커를 참조하거나 사용하는 테이블이다.

대상 테이블은 반대로, 멤버에 의해 불려지거나 참조를 당하는 테이블을 말한다. 

- 주 테이블에 외래키를 두는 경우: 외래키를 참조와 같이 사용할 수 있어 멤버 **객체만 확인해도 라커를 확인할 수 있는 간편함이 있음. → select with join**
- 대상 테이블에 외래키를 두는 경우: **멤버:라커가 일대다 관계로 변화했을 때**, 앞선 방법과 달리 **외래키의 위치를 수정하지 않아도 되는 확장성 면에서 장점이 있음 → select + select**

## 일대일 매핑: 주 테이블에 외래키를 두는 경우

![1](https://user-images.githubusercontent.com/30853787/226089963-dabd6db8-8bde-4f63-8441-821a583821f3.png)


```java
@Entity
public class Member{
	@Id @GeneratedValue
	@Column(name="MEMBER_ID")
	private Long id;

	private String name;

	@OneToOne
	@JoinColumn(name="LOCKER_ID")
	private Locker locker
	//,,,편의메서드 작성
}

@Entity
public class Locker{
	@Id @GeneratedValue
	private Long id;

	private String name;

	@OneToOne(mappedBy="locker")
	private Member member
	//...편의메서드 작성
}
```

 > 단방향매핑과 양방향 매핑에 큰 차이가 없어 같이 설명한다. 양방향에서는 앞 챕터에서 살펴본 편의메서드만 주의해서 작성해주면 된다.

mappedBy를 통해 연관관계의 주인을 명시하고(Member), Member를 통해 연관관계를 관리하고, 참조합니다.

### 대상 테이블에 외래키를 두는 경우

```java

@Entity
public class Member{

	@Id @GeneratedValue
	private Long id;

	private String name;

	@OneToOne(mappedBy="member_id")
	private Locker locker

	//,,,편의메서드 작성
}

@Entity
public class Locker{
	@Id @GeneratedValue
	private Long id;

	private String name;

	@OneToOne
	private Member member
	//...편의메서드 작성
}
```

![2](https://user-images.githubusercontent.com/30853787/226089965-93f9ed04-3e4f-49ce-998d-894890f58921.png)


대상 엔티티인 Locker를 연관관계의 주인으로 만들어 Locker 테이블이 외래키를 관리하도록 하였다. 

> OneToOne 양방향 관계에서는 연관관계의 주인이 아닌쪽에서 FetchType=Lazy로 설정할 수 없다.

[https://loosie.tistory.com/788#@OneToOne_양방향_매핑_중_LAZY가_먹히지_않는_경우_](https://loosie.tistory.com/788#@OneToOne_%EC%96%91%EB%B0%A9%ED%96%A5_%EB%A7%A4%ED%95%91_%EC%A4%91_LAZY%EA%B0%80_%EB%A8%B9%ED%9E%88%EC%A7%80_%EC%95%8A%EB%8A%94_%EA%B2%BD%EC%9A%B0_)

### 다대다 관계

다대다 관계는, 회원이 상품을 주문하는 시나리오에서 회원과 상품에 해당합니다. 회원은 여러 종류의 상품을 구입하지만 상품 입장에서도 여러명의 멤버가 구매하므로, 구매자 목록에는 여러 멤버가 있습니다. 

하지만 테이블에는 여러개의 값이 들어할 수 없습니다.(데이터베이스 1정규화 원자성 보장) 

그러므로 공통의 연결테이블을 통해 다대다 테이블의 관계를 표현할 수 있습니다. 

![3](https://user-images.githubusercontent.com/30853787/226089962-98701d15-de8d-4c88-a57c-2f5849b604eb.png)


다대다 관계에서 엔티티를 구성할때는, 각각의 엔티티에 @ManyToMany를 설정하면 **자동으로 위와 같이 연결 테이블을 설정해줍니다.**

아래는 단방향 ManyToMany 매핑 예시입니다. 

```java
@Entity
public class Member{
	@Id @Column(name="MEMBER_ID")
	private Long id;

	@JoinTable(
		joinColumns = @JoinColumn(name="MEMBER_ID")
		inverseJoinColumns = @JoinColumn(name = "PRODUCT_ID"))
	@ManyToMany
	private List<Product> products;
}

@Entity
public class Product{
	@Id @Column(name="PRODUCT_ID")
	private Long id;

	private String name;
}
```

### JoinTable설정

위같이 단방향에서도 ManyToMany매핑을 하면 자동적으로 연결테이블이 생성됩니다. JoinTable 애너테이션에서는 연결테이블이 어느 컬럼에 매핑할것인지에 대한 설정을 합니다.

- JoinTable.joinColumns: 현재 엔티티인 멤버와 매핑할 컬럼 지정
- JoinTable.inverseJoinColumns: 반대측 엔티티인 상품과 매핑할 컬럼 지정
- JoinTable.name: 연결테이블의 이름

### 연결엔티티 사용

**멤버와 상품 사이에 주문일자 또는 주문수량을 적고싶다면 어디에 저장할까요?** 멤버, 상품 모두 아닌 해당 엔티티들이 연관관계를 맺는 **연결 테이블이** 가장 적절할 것입니다. 

![4](https://user-images.githubusercontent.com/30853787/226089959-fb12f10e-ae72-40ee-ac04-47ac0526469e.png)


앞서 작성한 **연결엔티티를 생략해 단방향 +  외래키만 저장**하는 엔티티와 달리, 이번에는 **연결엔티티를 사용**해서 다대다관계를 정의하고, **연결 엔티티에 연결정보(주문일자, 주문수량)까지 저장하는 양방향 관계 엔티티**를 작성해보겠습니다.

```java
@Entity
public class Member{
	@Id @Column(name="MEMBER_ID")
	private Long id;

	@OneToMany(mappedBy = "MEMBER_ID")
	private List<MemberProduct> memberProduct;
}

@Entity
public class Product{
	@Id @Column(name="PRODUCT_ID")
	private Long id;

	private String name;

	@OneToMany(mappedBy="PRODUCT_ID")
	private List<MemberProduct> memberProduct;
}
```

회원과 상품 엔티티를 각각 생성했고, mappedBy를 통해 MemberProduct를 연관관계의 주인으로 설정해줍니다. 

```java

@Entity
@IdClass(MemberProductId.class)
public class MemberProduct{
	@Id @ManyToOne
	@JoinColumn(name="MEMBER_ID")
	private Member member;

	@Id @ManyToOne
	@JoinColumn(name="PRODUCT_ID")
	private Member product;

	private int orderAmount;

	private Date orderDate;

	
}
	
@Entity
@IdClass(MemberProductId.class)
public class MemberProductId implements Serializable {
	private String member;
	private String product;

	@Override
	public boolean equals(Object o){...}

	@Override
	public int hashCode(){...}
}
```

MemberProduct에서는 단순히 @ManyToMany를 통해 저장할 수 없던 주문수량, 주문일자를 저장할 수 있게됩니다. 테이블 구조는 앞선 구조와 동일합니다. (엔티티 구조만 변경)

 연결테이블 생성 시, 하나의 **엔티티에서 두 개의 키를 가지는  “복합키”** 개념이 새로 등장합니다. 이 개념은 뒤따라 소개할 방법에 비해 식별자 관리방법이 복잡하고 생성규칙이 많습니다. 

( Serializable 구현, 복합키 클래스는 별도의 클래스로 생성, equals, hashCode 오버라이드, 기본 생성자 필요 등등) 

또한 사용하기 용이하지 않습니다. 아래는 복합키를 통한 연관엔티티 **생성**입니다.

복합키 아이디클래스 생성 → 연관엔티티 생성 → 연관관계 설정 → 영속

**조회 역시 복합키 아이디 클래스를 통해 조회해야합니다.**

```java
em.find(MemberProduct.class, memberProductId);
```

이렇기에 실제로는 새로운 기본키를 생성해 연관엔티티를 관리합니다.

![5](https://user-images.githubusercontent.com/30853787/226089960-e887cded-3577-485a-b2f4-29aa04a214c9.png)


위의 테이블 구조와 달리, Member, Product_ID에서 기본키 제약조건이 빠지고, 테이블명이 새로운 의미를 갖는 “Order”라는 적절한 이름으로 변경되었습니다. 

```java
@Entity
public class Order{
	@Id @GeneratedValue
	private Long id;

	@ManyToOne
	@JoinColumn(name="MEMBER_ID")
	private Member member;

	@ManyToOne
	@JoinColumn(name="PRODUCT_ID")
	private Product product;

	private Integer orderAmount;

	private Date orderDate;
}
```

```java
@Entity
public class Member{
	@Id @Column(name="MEMBER_ID")
	private Long id;

	@OneToMany(mappedBy = "MEMBER_ID")
	private List<MemberProduct> memberProduct;
}

@Entity
public class Product{
	@Id @Column(name="PRODUCT_ID")
	private Long id;

	private String name;

	@OneToMany(mappedBy="PRODUCT_ID")
	private List<MemberProduct> memberProduct;
}
//member, product엔티티에 @OneToMany(mappedBy="___")가 붙음

```

### 추가질문

- 다대일 관계에서도 연관테이블을 만들어서 Order처럼 관리해도 괜찮은가?
- private int orderAmount 책에 int로 적혀있는데, Integer가 적절하지 않은가?
- 232쪽, orders = new ArrayList로 초기화해주는데, 안해주는것과 무슨 차이인가?
- 주테이블 외래키해서 select+join이 성능이 좋나, 대상테이블 외래키해서 select + select가 성능이 좋나?
- 복합키 다대다 테이블에서, 한 회원이 같은 상품 여러번 구매하면, PK의 Unique 제약조건 위반인가? [실험 필요]

- Nullable하지 않은값은 int(primitive type)가 좋다.

## Reference

책 -  김영한 저 Java ORM 표준 JPA 프로그래밍 (에이콘 출판, 2015)