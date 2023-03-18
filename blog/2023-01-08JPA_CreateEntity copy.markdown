---
layout: post
title:  "JPA에서 엔티티를 작성하는 방법"
date:   "2023-01-08"
category: "tech"
tags: ["JPA", "JPA 스터디"]
---
# JPA에서 엔티티를 작성하는 방법

JPA에서 **엔티티(Entity)**는 관계형 데이터베이스의 테이블과 대응하며, JPA가 관리하는 클래스를 말합니다. 

이는 Java 클래스로 선언하며, 보통 domain 패키지에 포함되고, 아래와 같이 구성됩니다

```java
@Entity
@Table
public class Member{
...
}
```

## 기본 엔티티 매핑 방법 @Entity

JPA에서 테이블과 매핑할 클래스는 @Entity 애너테이션을 필수로 붙여야 합니다. @Entity 적용 시에는, 클래스가 아래 주의사항을 따라야 합니다

- 기본생성자 필수
- final, enum, interface, inner 클래스에는 사용 불가
- 테이블에 저장할 필드는 final 키워드 사용 불가

> JPA는 자바 리플렉션(Java Reflection API)을 통해 엔티티 정보를 받는데, 이 때 생성자 인자 정보를 가져올 수 없으므로 기본 생성자는 필수적으로 필요합니다. 몇몇 JPA구현체(하이버네이트같은)에서는 바이트코드 조작(Bytecode Manipulation)을 통해 이런 문제를 회피한다고 합니다. 

>  자바는 클래스를 생성하면 기본 생성자를 자동으로 만들지만, 만약 생성자가 추가된다면 기본 생성자가 사라지므로 주의해야 합니다. (대부분의 IDE에서 잡아주긴 하지만..)

**속성**

- name: 엔티티 이름 지정, 기본값 - 클래스명

## 매핑할 테이블을 지정하는 @Table

@Table은 엔티티와 매핑할 데이터베이스 테이블을 지정합니다. 생략 시, 엔티티 이름을 테이블 이름으로 사용합니다.

- name속성: 매핑할 테이블 이름, 기본값 - 엔티티 이름
- catalog: catalog 기능이 있는 데이터베이스에서 catalog 매핑
- schema - schema기능이 있는 데이터베이스에서 schema를 매핑한다
- uniqueConstraints - DDL 생성 시, 유니크 제약조건을 만듭니다.

> catalog 기능: 데이터베이스의 인덱스, 뷰테이블, 사용자정보 등 메타데이터를 저장하는 객체

## 엔티티 내 필드 매핑 방법

MySQL,MsSQL등 다양한 RDBMS에는 데이터 타입이 존재합니다. JPA역시 Java의 데이터타입을 RDBMS와 매핑하기 위한 방법들이 존재합니다.

```java
@Entity
@Table
public class Member{
	@Id
	@Column(name="ID")
	private String id;

	@Column(name="NAME")
	private String username;

	private Integer age;

	@Enumerated(EnumType.STRING)
	private RoleType roleType;

	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;

	@Temporal(TemproalType.TIMESTAMP)
	private Date lastModifiedDate;

	@Lob
	private String description
}
```

### 가장 많이 사용되는 @Column

데이터베이스 테이블과 필드를 매핑하기 위해 사용합니다.

**속성**

- **name**: 필드와 매핑할 테이블 컬럼 이름, 기본값 - 필드명
- **nullable**(DDL) : false로 지정 시 NOT NULL 제약조건 추가. 기본값 true
- **unique**(DDL) : true로 지정 시 하나의 칼럼에 대해 유니크 제약조건. 기본값 false
- **columnDefinition**: 데이터베이스 컬럼정보를 직접 입력
- **length**: String 타입의 필드의 경우, 최대 길이 제약조건. 기본값 255
- **precision**, **scale:** precision의 경우 소수점 제외 전체자리수, scale은 소수 자리수
- i**nsertable**, **updatable**: 저장 / 수정하고싶지 않을 때 false로 지정, 기본값 true
- **table**: 하나의 엔티티를 두 개의 테이블에서 사용하려고 할 때 사용

> 필드에 @Column을 사용하지 않으면, 모든 속성이 기본값으로 들어가게 된다.

> Java Primitive type은 Null이 들어올 수 없으므로, DDL 생성 시 nullable=true로 설정됨

> Wrapper Type을 사용하거나  nullable을 false로 지정해야 한다.

> @Column(**columnDefinition**=”varchar(100)”) 과 같이, 방언정보를 활용해 선언한다

### 날짜 필드를 매핑하는 @Temporal

java의 날짜 타입인 java.util.Date, java.util.Calendar를 매핑한다. 

**속성**

- value: 시간포맷 지정, 기본값 없음(필수지정)
    - TemporalType.DATE: “날짜(**date**)”에 매핑 - 2023-01-01
    - TemporalType.TIME: “시간(**time**)”에 매핑 - 12:03:21
    - TemporalType.TIMESTAMP: “날짜 및 시간(**timestamp**)에 매핑” - 2023-01-01 12:03:21

>  Java의 Date에는 날짜,시간이 모두 있지만, RDBMS는 date, time, timestamp로 나누어져있는 경우가 많아 @Temporal을 명시한 경우 value 속성을 필수로 지정해야한다.

>  @Temporal을 생략하면, DB의 timestamp 타입으로 매핑된다. 

### enum 타입을 매핑하는 @Enumerated

**속성**

- value: 저장할 값 지정
    - (기본)EnumType.ORDINAL: enum 순서를 데이터베이스에 저장
    - EnumType.STRING: enum 이름을 데이터베이스에 저장

> EnumType.ORDINAL로 지정할 경우, 저장되는 크기가 작다는 장점이 있지만, 순서가 바뀌거나 사이에 새로운 내용이 추가되었을 때, 데이터베이스의 기존 데이터와 일치하지 않는다는 문제가 있다. 따라서, EnumType.STRING을 권장한다.

### 길이제한 없는 문자타입 @Lob

데이터베이스의 CLOB, BLOB 타입과 매핑됩니다. 필드 타입이 문자면 CLOB, 나머지는 BLOB로 매핑됩니다. 

Example) 

```java
@Lob //문자 필드이므로 CLOB으로 매핑
private String lobString;

@Lob //문자필드가 아니므로 BLOB으로 매핑
private byte[] lobByte;

```

> CLOB: Character Large Object (대형 문자 객체) , BLOB: Binary Large Object(대형 이진 객체)로, 최대 4GB의 대형 문자/이진 객체를  데이터베이스 시스템 밖의 파일로 저장하는 타입입니다.

### 무시하고 매핑하지 않는 @Transient

@Transient가 지정된 필드는 데이터베이스에 저장하지 않고, 따라서 조회하지도 않습니다.

### JPA의 접근방식을 지정하는 @Access

JPA가 엔티티 데이터에 접근하는 방식을 지정합니다. 

- 필드접근: AccessType.FIELD - 필드에 직접 접근. private여도 가능합니다.
- 프로퍼티접근: AccessType.Property - getter를 통해 접근합니다.

>  @Id 의 위치에 따라, @id가 프로퍼티(getter)에 있으면, 자동으로 AccessType.PROPERTY에 지정, 필드에 있으면 AccessType.FIELD에 지정됩니다. 

```java
@Access //: 필드통한 접근
private Long Id

@Access //: 프로퍼티 통한 접근 
public Long getId() {...}
```


### 아까 봤던 엔티티 다시보기
내용들을 공부하기 전에 확인했던 엔티티입니다. 아래 엔티티를 확인하면, 필드에 선언된 애너테이션의 의미와 역할, 제한사항, 컬럼 등에 대해 이해할 수 있습니다.

```java
@Entity
@Table
public class Member{
	@Id
	@Column(name="ID")
	private String id;

	@Column(name="NAME")
	private String username;

	private Integer age;

	@Enumerated(EnumType.STRING)
	private RoleType roleType;

	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;

	@Temporal(TemproalType.TIMESTAMP)
	private Date lastModifiedDate;

	@Lob
	private String description
}
```
## 데이터베이스 스키마 자동생성

JPA는 위처럼 엔티티를 통해 데이터베이스 테이블이 어떻게 구성되는지 알 수 있습니다. 이를 통해 데이터베이스 스키마를 DDL(Data Definition Language)로 자동 생성해주는 기능을 갖습니다.

(show-sql은 실행되는 쿼리를 콘솔에 출력해줍니다.)

application.properties

```
spring.jpa.hibernate.ddl-auto: create
spring.jpa.show-sql: true
```

application.yaml

```yaml
spring:
	jpa:
	show-sql: true
		hibernate:
			ddl-auto: create

```

### ddl-auto 옵션

| 옵션 | 환경 | 설명 |
| --- | --- | --- |
| create | 개발 초기 | 기존 테이블을 삭제 후, 새로 생성 (DROP + CREATE) |
| create-drop | 개발 초기 | 애플리케이션을 시작할 때 CREATE, 종료할 때 DROP (CREATE + DROP) |
| update | 테스트서버 | 데이터베이스 테이블과 엔티티의 변경사항을 비교해 변경사항만 수정 |
| validate | 테스트서버 or
스테이징/운영서버 | 데이터베이스 테이블과 엔티티 매핑정보가 차이가 있을 경우, 경고를 남기고 애플리케이션을 실행하지 않음.  |
| none | 스테이징/운영서버 | 자동생성기능을 사용하지 않음. ddl-auto 옵션을 제거하거나 유효하지 않은 옵션을 준것과 같음 |

> ddl-auto 옵션은 운영환경에서 사용할만큼 완벽하지 않다고 한다. 그렇기에 학습이나 참고용으로만 사용하는것이 좋다. 

## 복습질문

- [ ]  데이터베이스에 2GB이상의 데이터를 저장하기 위해 JPA에서 어떤 애너테이션을 사용해야하는가?
- [ ]  ddl-auto 옵션의 validate는 무슨 역할을 하는가?

**정답**

1. @Lob 애너테이션을 사용하면 문자열의 경우 CLOB, 이외는 BLOB으로 매핑해줍니다. 다만, Java String의 경우 최대 길이가 2GB이므로, 내용이 절삭되는것에 유의해야 한다.
2. 데이터베이스 테이블과 엔티티의 매핑이 일치하는지 확인하고, 일치하지 않으면 경고와 함께 애플리케이션을 실행하지 않음

## Referecnce

* [자바 ORM 표준 JPA 프로그래밍](http://www.yes24.com/Product/Goods/90439472)