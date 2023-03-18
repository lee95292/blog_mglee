---
layout: post
title:  "JPA에서 기본 키 매핑 방법 종류"
date:   "2023-01-13"
category: "tech"
tags: ["JPA", "JPA 스터디"]
---

JPA에서 엔티티와 데이터베이스의  기본 키(Primary Key) 매핑을 알아보겠습니다.

데이터베이스에는 **유일성** **최소성**을 만족하는지 여부에 따라 몇가지 키 종류가 존재합니다. 

![1](https://user-images.githubusercontent.com/30853787/226088482-446952cd-6dc2-42a8-b0dd-10e0a9e20137.png)

**유일성**이란, 여러 레코드들 중, 하나의 레코드를 특정지을 수 있는 키의 특성입니다.

 예를들어 이름,생일과 같은 특성은 레코드를 하나로 특정지을 수 없지만, [**학교 , 학번]**의 조합이나 [**주민등록번호]**와 같은 특성은 레코드를 유일하게 특정지을 수 있으므로 유일성을 만적하는 특성입니다.

**최소성**이란, 레코드를 유일하게 식별하는데 꼭 필요한 최소한의 특성만 선택되어야한다는 키의 특성입니다.

 예를 들어, **[이름, 나이, 주민등록번호]** 의 속성 조합으로 유일성을 만족하지만, 이름과 나이 없이 주민등록번호만으로 레코드를 유일하게 식별할 수 있으므로, **최소성을 만족하지 못하는 키**이고, **[주민등록번호]** 로 구성된 키는 **최소성을 만족한다**고 할 수 있습니다.

## JPA의 기본 키 매핑 방법

데이터베이스 시스템에서는 보통 레코드의 기본 키를 설정하기 위한 디폴트 설정이 있습니다. 앞서 소개한 주민등록번호나 학교+학번은 사실 **비즈니스 상 변경**될 수도 있는 값이고, **인덱스를 통해** **효율적으로 탐색**하기에는 부적절한 키입니다. 

그렇기때문에 데이터베이스 시스템에서는 비즈니스 로직과 관계 없는 고유한 값을 만들어 기본 키로 채택하는데요,   이번 글은 JPA에서 엔티티와 데이터베이스 테이블 간 “기본 키”를 어떻게 생성하고 매핑하는지 알아보겠습니다.

참고로 좋은 데이터베이스 기본 키를 선택하는 기준은 아래와 같습니다.

- Null값을 허용하지 않음
- 변하지 않음
- 유일함

JPA로 엔티티를 한번 이상 만들어봤다면, 기본적으로 아래 구조를 띄는것을 알 수 있습니다.

```java
@Entity
public class Member{
	@Id
	@Column(name="id")
	private String id;
}
```

이렇게 구성하면, Member테이블의 Key인 Id필드는 언제 지정될까요? 영속성 관리에서 배운것처럼, 엔티티는 바로 데이터베이스에 저장되지 않고 1차캐시에 저장됩니다. 

***고치기***

만약 데이터베이스의 기본 키 생성 전략이 직접할당일 경우에는, 애플리케이션에서 엔티티의 키를 설정할 방법이 없을것입니다.

JPA에서는 데이터베이스 벤더별로 각기 다른 키 생성 전략과 자바 엔티티를 매핑하기 위해, @Id 컬럼에 여러 옵션들을 제공합니다.

## 기본 키 생성 전략

기본키를 어떤 방식으로 생성하느냐에 따라, **개발자가 키를 직접 설정하는** 직접할당 전략, **자동으로 키를 생성하는**  IDENTITY, SEQUENCE, TABLE, AUTO 전략을 살펴봅니다. 

아래의 Java 타입을 선언한 뒤, Id애너테이션을 통해 필드가 기본 키로 매핑되도록 합니다.

@**Id필드 타입**

Id 애너테이션은 다음과 같은 자바 타입에서만 적용 가능합니다

- Primitive Types
- Wrapper Types
- String
- java.util.Date
- java.sql.Date
- java.math.[bigDecimal, bigInteger]

### 직접 할당 전략

기본 키 직접 할당 전략은 프로그래머가 **엔티티매니저에 영속되기 전에** 엔티티의 키를 직접 할당하는 방식입니다. 

이 방식에서 식별자 값 없이 영속시키면 PersistenceExeption이 발생합니다.

**설정방법:  Id** 필드에 @Id 애너테이션을 적용하면 기본키를 직접 할당방식으로 테이블이 생성됩니다.

### IDENTITY 전략

IDENTITY전략은 기본 키 생성 전략을 데이터베이스에 위임하는 방식입니다.

보통 AUTO_INCREMENT같은 자동 키 생성방법을 제공하는 MySQL, Postgresql, DB2등에서 사용합니다. 

**설정방법: 필드에** GeneratedValue 애너테이션, strategy 옵션을 GenerationType.IDENTITY로 설정

```java
@Entity
public class Member{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
}
```

**em.persist(member) → insert query 날리고 → select query(id 포함된 레코드) → 영속성 컨텍스트에 저장**

**주의사항**

영속성 컨텍스트에 저장될때는 필수로 식별자 값이 필요한데, IDENTITY 전략에서는 기본 키를 데이터베이스에서 지정하므로, **식별자를 알 수없다**.

그러므로 IDENTITY전략을 사용하는 엔티티는 **영속되는 시점에 INSERT쿼리를 데이터베이스에 전달**한다. 

따라서 **IDENTITY전략에서는 트랜잭션을 지원하는 쓰기지연이 동작하지 않는다.**

**최적화 방법**

IDENTITY전략에서는 영속 시 INSERT쿼리를 데이터베이스에 전달하고, 식별자를 얻기 위해 추가로 조회작업을 해야해서 총 **2번의 통신이 이뤄진다.**

JDBC3에서 추가된 Statement.getGeneratedKeys()를 사용하면, 데이터를 저장하면서 동시에 생성된 기본 키 값도 얻어올 수 있다. 

### SEQUENCE 전략

데이터베이스에서 시퀀스는 유일한 값을 순서대로 생성하는 데이터베이스 오브젝트입니다. Sequence를 제공하는 Oracle,Postgresql, DB2,H2등에서 사용가능합니다.

SEQUENCE방법은 이를 통해 기본 키를 생성합니다. 

**설정방법:** 

- 엔티티에 @SequenceGenerator 등록: 시퀀스 생성기 등록  옵션은 아래와 같습니다.
    - name : 엔티티에서 갖는 시퀀스생성기 이름(필수)
    - sequenceName : 데이터베이스의 시퀀스 이름
    - initialValue : DDL 생성시 처음 시작하는 숫자
    - allocationSize:시퀀스 호출 시 증가하는 숫자, 기본값 50 (최적화에 사용)
    - catalog, schema: 데이터베이스의  catalog, schema
- @GeneratedValue의 strategy 속성을 GenerationType.SEQUENCE로 설정

```java
@Entity
@SequenceGenerator(
	name="MEMBER_SEQ_GENERATOR",  
	sequenceName="MEMBER_SEQ", 
	initialValue=1, 
	allocationSize=1  
)
public class Member(){
	
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE)
	private Long id;
}
```

@SequenceGenerator의 옵션이 다양하게 존재하는것을 확인할 수 있다.

**참고사항1. 시퀀스 동작구조**

IDENTITY전략과 마찬가지로 ,데이터베이스에서 식별자 값을 가져와야 하지만 IDENTITY전략이 영속성 컨텍스트에서 Insert 쿼리를 날린 뒤 조회를 한것과는 달리, SEQUENCE 전략에서는 데이터베이스 시퀀스만 조회해 식별자값만 가져온다.

```sql
SELECT emp_seq.NEXTVAL
     , emp_seq.CURRVAL
  FROM dual
```

따라서 **SEQUENCE전략은 트랜잭션을 사용하는 쓰기지연 방식을 지원하지만, 시퀀스를 추가적으로 조회한다**.

**참고사항 2. allocationSize의 기본값이 50이다.**

**hibernate.id.new_generator_mappings 설정이 true인 경우, allocationSize**는 **기본적으로 50으로 설정됩니다. 이는 JPA의 시퀀스 접근횟수를 줄이기 위함이고, 아래와 같이 동작합니다.** 

- JPA에서 데이터베이스 시퀀스에 접근
- 시퀀스는 **allocationSize값인 50만큼 시퀀스를 생성**
- JPA는 메모리에 1 ~ 50까지의 시퀀스를 메모리에 할당.
- 50개까지 엔티티가 생성되어도, 시퀀스를 생성하기 위해 DB에 접근하지 않아도 됨.

멀티서버 환경에서는 엔티티가 생성된 순서대로 ID가 증가하지는 않지만, Insert성능 측면에서 가장 훌륭함.

### TABLE 전략

TABLE전략은 키 생성용 테이블을 만들고, 이름과 값으로 사용할 컬럼을 만들어 데이터베이스 시퀀스를 흉내내는 전략입니다. 또한, 테이블을 사용하므로 모든 데이터베이스에서 적용가능합니다.

**설정방법:**

- 필드에 @GeneratedValue 등록, 아래의 속성 추가
    - strategy = GenerationType.Table,
    - generator = 시퀀스 생성테이블 이름(TableGenerator의 name속성 값) 등록
- 엔티티에 @TableGenerator 등록 : 속성들이 많은데, 시퀀스 테이블을 구성하기 위한 이름과 관련된것들이 많습니다. 아래에서 설명합니다.
    - name: 식별자 생성기 이름 (필수)
    - table:  키 생성 테이블명 (기본값 - hibernate_sequence)
    - pkColumnValue:  키로 사용할 이름 [ Default - 엔티티명 ]
    - pkColumnName: 시퀀스 컬럼명 [ Default - sequence_name]
    - valueColumnName: 시퀀스 값 컬럼명 [ Default - next_val ]
    - initalValue: 초기 값 [ Default - 0 ]
    - allocationSize; 시퀀스 한번 호출에 증가하는 숫자(최적화용), [ Default  1 or 50: 최적화 설정 적용여부에 따라 ]
    - catalog, schema: 데이터베이스 catalog, schema 이름
    - uniqueConstraints: 유니크 제약조건

```java
@TableGenerator(
	name="BOARD_SEQ_GENERATOR",
	table="MY_SEQUENCE",
	pkColumnValue="BOARD_SEQ", allocationSize=1)
public class Board{
	@Id
	@GeneratedValue(strategy = GenerationType.TABLE,
		generator = "BOARD_SEQ_GENERATOR")
	private Long id;
}
```

위와 같이 등록 하게 되면, 아래와 같이 시퀀스 이름과 시퀀스 값을 컬럼으로 갖는 테이블을 만들어 시퀀스를 관리합니다

앞서 @TableGenerator의 속성들 중 ~~Column~~ 같은 이름에 사용되는 속성들이 많이 보이는데요, 시퀀스테이블을 구성할 때 사용하는 이름입니다. 

| sequence_name | next_val |
| --- | --- |
| BOARD_SEQ | 102 |
| MEMBER_SEQ | 50 |

**참고사항: 테이블전략 동작구조** 

(시퀀스)테이블의 값을 조회하고, 이 값을 기반으로 Update쿼리를 한번 더 날리기때문에, 시퀀스 전략보다 네트워크 통신을 1회 더 한다는 단점이 있습니다.

이는 SEQUENCE방법과 같이 allocationSize를 통해 최적화할 수 있습니다.

### AUTO 전략

@GeneratedValue.strategy의 기본 설정값인 AUTO전략입니다. 

AUTO 전략은 선택한 데이터베이스 방언에 따라 IDENTITY, SEQUENCE, TABLE중 하나를 자동으로 선택합니다. 

- **데이터베이스가 변경되어도 코드를 수정할 필요가 없습니다.**
- MySQL은 IDENTITY, Oracle은 SEQUENCE방법 선택합니다.

## 매우매우 중요한 뽀인트

JPA에서 **키 생성 전략은 INSERT성능에 중요한 영향을 미친다!!!** 

## 복습질문

- [ ]  자동 키 생성전략: IDENTITY, SEQUENCE, TABLE 방법에서 영속성 컨텍스트에 식별자를 동기화하기 위해 각각은 어떻게 동작하나요?
- [ ]  allocationSize 속성은 어떻게 키 생성 전략에서 최적화를 수행하나요?
- [ ]  AUTO 생성전략은 무엇이고, 어떤 장점이 있나요?

## 챕터에 없지만 알아볼 내용

- [ ]  Table 방식과 Sequence 방식은 근본적으로 어떤 차이점이 있나요? (시퀸스는 테이블과 어떻게 다른가요?)
    
    

### 정답

- 각 방법에 대한 답변
    - IDENTITY의 경우, 데이터베이스에 키 생성전략을 위임한다. AUTO_INCREMENT같이 자동으로 기본 키를 설정해주는 MYSQL등에서 사용한다. (MySQL AUTO_INCREMENT가 적용되었을 때, id없이 insert 쿼리가 가능하다!). [ 삽입/조회 쿼리 발생, 쓰기지연 불가 ]
    - SEQUENCE는 증가하는 값을 생성해내는 객체로, 조회만을 통해 증가하는 값을 할당받아 엔티티의 키로 지정한다. [ 조회쿼리 발생, **allocationSize로** 최적화 가능 ]
    - TABLE은 키 할당 정보를 관리하는 테이블을 생성해 키를 매핑한다. Sequence와 유사하게 동작합니다. [ 조회/수정쿼리 발생, **allocationSize로** 최적화 가능 ]
- Table, Sequence방법에서 사용하는 최적화 전략으로, 키를 allocationSize만큼 할당받아 사용. 식별자를 생성하기 위해 N회 쿼리를 날리는것에서 N/allocationSize 만큼만 쿼리를 날리게 됨.
- AUTO방식은 데이터베이스 방언에 맞는 자동 키 생성방식을 설정합니다. 데이터베이스 벤더가 변경되어도 코드가 변경될 필요가 없다는 장점이 있습니다.

---

- 시퀀스는 select 시퀀스네임.nextval from dual 을 통해 다음 값을 조회하고 자동으로 증가합니다. 따라서 테이블 방식과 달리, Update 쿼리를 사용할 필요가 없어 효율적입니다.