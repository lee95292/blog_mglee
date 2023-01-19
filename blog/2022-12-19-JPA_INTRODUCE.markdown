---
layout: post
title:  "패러다임 불일치 문제와 JPA를 사용하는 이유 "
date:   "2022-12-19"
category: "tech"
tags: ["JPA", "JPA study"]
---

# JPA를 사용하는 이유와 패러다임 불일치 문제

기존 시스템들에서 어떤 방식을 통해 데이터를 접근했는지, 어떤 문제점들이 있었는지 살펴보고, JPA가 이를 어떻게 해결했는지 살펴봅시다.

### 목차

- 주제 1.  JPA 등장 배경
    - SQL을 기반으로 구현했을 때의 문제점
    - 패러다임 불일치 문제
        - 상속,연관관계 참조, 객체그래프 탐색, 비교 불일치
    - JPA란? JPA의 장점

---

# JPA의 탄생 배경: SQL을 직접 다룰 때 생기는 문제점

---

JPA이전 관계형 데이터베이스의 데이터를 가져오기 위해서는 JDBC API를 통해 SQL 쿼리를 직접 날려주는 방식을 사용했습니다. 이는 직관적인것을 떠나 매우 직접적인 방법이고, 여러가지 문제점과 불편함이 존재합니다.

### SQL에 의존적인 개발

```java
public class Member{
	private String memberId;
	private String name;
	private String tel; // 전화번호 필드 추가
}
```

데이터에서 하나의 필드(컬럼) 이 추가될 때, SQL을 직접 매핑해 개발하는 방식에서는 삽입,조회,변경,삭제 시 많은 코드 변경이 필요합니다.

- 생성코드 변경:  SQL 수정 / Prepared Statement에 필드 추가하는 코드

```java
String sql = "INSERT INTO MEMBER(MEMBER_ID, NAME, TEL) values(?,?,?);";
''' 
pstmt.setString(3,member.getTel());
```

- 조회코드 변경 :  SQL수정 / 필드 가져오는 코드 / 필드 설정하는 코드

```java
String sql = "SELECT MEMBER_ID, NAME, TEL from MEMBER WHERE MEMBER_ID = ?";
String tel = rs.getString("TEL");
member.setTel("XXX");
```

- 연관객체 조회: Member가 Team이라는 연관된 데이터를 새로 개발하는 경우, member.getTeam().getTeamName()을 통해 멤버가 속한 팀을 가져오는 마법같은 일은 벌어지지 않습니다. DAO에서 SQL Join을  통해 다른 테이블을 연결해야 가능합니다.

```sql
SELECT M.MEMBER_ID, M.NAME, M.TEL, T.TEAM_ID, T.TEAM_NAME 
	FROM MEMBER M 
	JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID
```

많은 비즈니스 로직에서 데이터 간 연관관계가 존재하는데, 위같이 SQL에 의존하는 개발을 하는 경우, “진정한 계층 분할이 어렵다”는 문제가 있습니다.

DAO를 통해 데이터에 접근하는 로직만 분리했을 뿐이지, 필드를 추가할때만 해도 SQL과 CRUD와 관련된 코드를 추가해야하기 때문이다. 이때문에 엔티티를 신뢰할 수 없게됩니다.

### JPA와 문제 해결

JPA는 위에서 소개한 문제들을 효율적으로 해결합니다.

- 조회기능: 객체의 필드를 바탕으로 SELECT SQL 을 생성하고, 그 결과를 Member객체로 생성해 반환합니다.

```java
String memberId = "MyeonggGyu Lee";
Member member = jpa.find(Member.class, memberId);
```

- 수정기능: “영속상태”에 있는 엔티티의 변경을 감지해, 트랙잭션이 커밋될 때 Update SQL문을 전달합니다.
    - “변경감지”란 EntityManager에서 엔티티를 영속할 때 Snapshot을 저장하고 트랜잭션 커밋 시 이와 비교하므로서 변경을 감지하는 동작이 가능합니다.  (CH3에서 본격적으로 다룬다.)

```java
member.setName("Changed_Name");
```

- 연관객체 조회:  JPA는 연관객체를 조회하는 시점에 적절한 SELECT문을 실행합니다. JPA에서는 단순히 객체그래프를 탐색하는것만으로 수행할 수 있는데, 이를 위해 실제 객체의 참조를 저장하는 프록시를 반환하고, 이를 지연로딩이라 합니다. (H2에서 지연로딩은 프록시와 바이트코드 수정을 통한 방법이 있고, CH8에서 본격적으로 다룬다.)

```java
Team team = member.getTeam();
String teamName= team.getName();
```

# 패러다임 불일치 문제

---

 관계형 데이터베이스와  객체지향 프로그래밍 언어는 그 목적이 다른만큼 데이터의 기본 단위인 레코드와 객체의 기능과 표현 방법이 다릅니다. 따라서, 개발자가 이를 중간에서 해결해주어야 하지만, 이를 일일히 해결하는것은 너무 많은 리소스를 투입해야하는 작업입니다.

 이같은 패러다임 불일치로 생기는 문제 또한 여러가지가 있으며, JPA가 어떤 방법으로 이를 해결하는지 살펴보겠습니다. 

## 상속

객체의 경우 상속이라는 기능을 통해 다형성을 제공하지만, 대부분의 데이터베이스는 상속 기능이 없습니다. 

아래 그림과 같이 서브타입과 슈퍼타입을 사용하면 그나마 해결이 가능하지만, 이는 많은 불편함을 초래합니다. 

![Untitled](https://user-images.githubusercontent.com/30853787/210951775-582b7a16-6641-4a51-862f-11148a8f158b.png)

위의 경우, 만약 ALBUM 객체를 저장하기 위해서는 두 개의 INSERT문이 필요합니다. 

```sql
INSERT INTO ITEM(ITEM_ID, NAME, PRICE, DTYPE) VALUES(?,?,?);
INSERT INTO ALBUM(ITEM_ID,ARTIST) VALUES(?,?);
```

만약 데이터베이스를 사용하지 않고 자바 컬렉션(Ex, ArrayList)에 저장한다면, **list.add(album)**처럼  부모 객체에 대해 고려하지 않고도 데이터를 저장할 수 있습니다.

이처럼 상속으로 인한 자바 객체와 관계형 데이터베이스 사이의 패러다임 불일치문제는 분명히 존재하는것을 알아보았습니다 .

JPA에 상속하는 객체를 저장하면 상속에 의한 패러다임 불일치문제를 개발자 대신 해결해줍니다. 

JPA의 EntityManager에 객체를 저장하면, ITEM,ALBUM 테이블에 데이터를 각각 나누어 저장합니다.

```java
jpa.persist(album);
```

```sql
INSERT INTO ITEM(ITEM_ID, NAME, PRICE, DTYPE) VALUES(?,?,?);
INSERT INTO ALBUM(ITEM_ID,ARTIST) VALUES(?,?);
```

이후 album 객체를 찾고자 할 때, ITEM, ALBUM 테이블을 조인해서 데이터를 조회하고, 그 결과를 반환합니다 .

```sql
SELECT I.*, A.* 
		FROM ITEM I 
		JOIN ALBUM A ON A.ITEM_ID = I.ITEM_ID;
```

### 연관관계

객체는 **참조**를 통해서 다른 객체와 연관관계를 가지고, **참조에 접근**을 통해 연관관계의 객체를 조회합니다. 반면 관계형 데이터베이스의 테이블은 **외래 키**를 통해 다른 테이블과 연관관계를 가지고, **JOIN**을 통해 연관된 테이블을 조회합니다.

```java
class Member{
	Team team;

	...

	Team getTeam(){
		return team;
	}
}

member.getTeam();
```

```sql
SELECT M.*, T.* 
	FROM MEMBER M 
	JOIN TEAM T ON M.TEAM_ID = T.TEAM_ID
```

위에서 다룬 상속에서의 패러다임 불일치문제는 서브타입/슈퍼타입을 통해 객체지향적으로 데이터를 다룰 수 있었지만, 연관관계로 인한 패러다임 불일치 문제는 객체지향적으로 풀어내기에 꽤 복잡합니다.

객체는 다른 연관관계를 조회하고자 할 때, 외래키 대신 참조만 있으면 되고, RDB의 테이블에서는 참조 대신 외래키만 있으면 조회가 가능합니다. 

또한, 객체는 member.getTeam()을 통한 member → team 으로의 단방향 조회만 가능하지만, team에서 member에 대한 참조가 없으므로, team.getMember()을 통한 team → member 조회가 불가능합니다. 

(RDB에서는 외래키를 통해 양방향으로 연관관계를 Join할 수 있습니다)

- 저장 시

(직접구현) 개발자는 객체에서의 연관관계만 지정해주면, team의 참조를 외래키로 변환해 INSERT SQL문을 데이터베이스에 전달합니다. 

(JPA 사용)JPA에서는 이런 연관관계로 인한 패러다임 문제 역시 해결해줍니다.

```java
member.setTeam(team);
jpa.persist(member);
jpa.flush();
```

- 조회 시

(직접구현) 조회시에는 TEAM_ID 외래 키 값을 Member 객체의 team 참조로 변활해 객체로 저장합니다. 

```java
	public Member find(String memberId){
		Member member = new Member();
		//SQL 실행 후, 멤버 데이터 입력

		Team team = new Team();
		// team 외래키를 통해 팀 정보 조회 후, 팀 관련 정보 입력

		member.setTeam(team);
		//팀 연관관계 생성

		return meber;
}
```

(JPA 사용) 마찬가지로  jpa entitymanager를 통해 find하면, 위의 과정을 간단하게 수행할 수 있습니다. 

```java
Member member = jpa.find(Member.class, memberId);
Team team. = member.getTeam();
```

### 객체 그래프 탐색

실제 데이터의 연관관계가 복잡하게 얽혀있는 구조를 생각해보자. 예를 들어 아래와 같다고 해보자.

![jpabook-48 drawio](https://user-images.githubusercontent.com/30853787/210951768-9a789a7c-579a-4a1b-b571-fa684e3cab82.png)


만약 DAO를 통해 SQL을 직접 조작한다고 해보자. 아래와 같은 자유로운 객체그래프 탐색이 가능할끼?

```java
member.getOrder.getOrderItem().get….
```

만약 member을 조회하는 기능에서 order까지 참조로 저장하였다면, getOrder까지는 성공할 것이다. 하지만 그 이후부터는 데이터가 존재하지 않으므로 탐색할 수 없다. 

비즈니스 로직에 따라 객체 그래프를 자유롭게 탐색할 수 있어야하지만, DAO내부에서 실행하는 SQL에 따라 객체 그래프를 어디까지 탐색할 수 있는지가 정해집니다. 결국 객체 그래프를 탐색할때마다 새로운 메서드와 SQL을 만들어야하는 복잡하고 불편한 상황이 연출됩니다.

```java
memberDAO.getMember();
memberDAO.getMemberWithOrderWithDelivery();
...
```

앞서 해결했던 문제들과 달리, 객체 그래프 탐색 문제는 소스코드 몇줄을 추가한다 해서 해결될 수 없습니다.  member와 관련된 모든 객체들을 메모리에 올려놓으면, 엄청난 메모리 낭비가 발생하기 때문이죠. 

JPA는 실제 객체 사용 시점까지 데이터베이스 조회를 미루는 **지연로딩**을 통해 해당 문제를 해결합니다. 

```java
Member member = jpa.find(Member.class, memberId);

Order order = member.getOrder();
order.gerOrderDate(); // Order객체를 사용하는 시점에 SELECE Order 쿼리를 날림. 
```

### 비교 불일치

데이터베이스에서는 기본 키(PK)를 통해 데이터를 비교합니다. 반면 객체는 동일성과 동등성을 통해 데이터를 비교합니다. 

**동일성** 비교는 “==”을 통해 비교합니다. 객체의 주소값을 비교하는 비교방법입니다. 

**동등성** 비교는 “equals()”메서드를 통해 비교합니다.  객체 내부 값을 비교합니다. 

SQL을 통해 Java에서 데이터베이스 레코드를 여러 번 불러왔을 때, 비교과정에 대해 살펴보겠습니다.

```java
String memberId = "12";
Member m1 = memberDAO.getMember(memberId);
Member m2 = memberDAO.getMember(memberId);

if(m1 == m2) System.out.println("Equal");
else System.out.println("Not Equal");

// ouput : Not Equal
```

m1과 m2는 같은 member id를 통해 조회했으므로 그 내용은 같겠지만, 동일한 객체는 아닙니다. equals메서드를 통해 내용만 비교하면 되지 않나 라는 생각을 할 수 있지만, 만약 두 객체가 다른 스레드에서 각각 생성되고, 변경된다고 가정하면, 예상하지 않은 결과를 가져올 것입니다. 

JPA에서는 같은 트랜잭션일 때, 같은 객체가 조회되는 것을 보장한다. 이는 엔티티메니저의 식별자를 통해 가능하다. 

# JPA란 무엇인가

Java Persistence API의 약자로, 자바 진영의 ORM 기술.

### ORM이란?

Object Relational Mapping으로, 객체와 관계형 데이터베이스를 매핑하는 기술로, 앞서 설명했던 패러다임 불일치 문제를 해결해준다.

### JPA를 사용해야하는 이유?

- **생산성**: JPA를 사용하면 자바 컬렉션 객체에 저장하듯 엔티티메니저에 저장하면, JDBC API를 사용하는 반복적인 SQL 작성은 JPA가 대신 처리해준다
- **유지보수성**: SQL을 직접 매핑하면 필드가 추가될 때마다 많은 양의 코드가 추가되었지만, JPA에서는 필드가 추가/삭제되더라도 변경되는 코드가 줄어든다.
- **패러다임 불일치 해결**: 앞서 살펴본 상속, 연관관계, 객체그래프 탐색, 비교 불일치 등으로 인한 패러다임 불일치 문제를 해결해준다
- **성능:** 엔티티메니저의 1차캐시는 앞서 살펴본것같이 동일성을 보장해주기도 하지만, 캐시의 역할과 쓰기지연 저장소 역할도 수행한다.
- **벤더 독립성:** 데이터베이스는 같은 기능이어도 벤더마다 사용법이 다른 경우가 많다. JPA는 다른 데이터베이스 벤더들을 하나로 통합한 방언(Dialect)을 제공해 데이터베이스 기술을 추상화하고, 특정 기술에 종속되지 않도록 한다.


---


### 복습질문
- [ ]  1. SQL을 직접 다뤄서 생기는 문제점에는 어떤것이 있는가?
- [ ]  2. 객체지향 프로그래밍과 관계형 데이터베이스의 데이터의 패러다임 불일치에는 어떤 문제들이 있는가?
- [ ]  3.JPA를 사용해 얻을 수 있는 이점은 무엇인가?
### 챕터에 나오지 않지만 알아야하는 부분들

- [ ]  1. member.setName()만으로 데이터를 수정할 수 있는 개념인 “변경감지” 란 무엇인가?
- [ ]  2.member.getTeam()을 통해 연관객체를 불러올 수 있는 원리는 무엇인가?
- [ ]  3.JPA 구현체인 H2에서는 지연로딩을 구현하는 방법으로 무엇들이 있는가?
- [ ]  4.JPA에서 같은 레코드에 대한 동일성을 보장하는 방법은 무엇인가?

	정답
    1. 패러다임 불일치 문제 → 계층분할 힘듦 → 코드 작업량 증가,
    2. 상속, 연관관계 참조, 객체그래프 탐색,  비교 방법 불일치 문제 
    3. 생산성,유지보수, 성능, 벤더 독립성 
    
	
    1. 엔티티매니저에서 객체 영속 시 스냅샷을 저장하고,commit, JPQL등으로 인한 커밋 시, 스냅샷과 엔티티를 비교하는 방법
    2. 지연로딩. 프록시객체를 가지고있다가 해당 객체가 사용되는 시점에 SQL 실행
    3. 바이트코드 수정, 프록시
    4. 엔티티매니저 1차캐시에 식별자 비교를 통해서 동일성 보장


## Referecnce

* [자바 ORM 표준 JPA 프로그래밍](http://www.yes24.com/Product/Goods/90439472)