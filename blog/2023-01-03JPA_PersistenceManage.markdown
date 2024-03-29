---
layout: post
title:  "JPA의 엔티티 매니저와 영속성 관리 "
date:   "2023-01-03"
category: "tech"
tags: ["JPA", "JPA 스터디"]
---

# JPA의 엔티티매니저와 영속성 관리
JPA의 엔티티매니저가 1차캐시, 쓰기지연, 영속성 관리 등의 역할을 하기 위해 어떻게 동작하는지 살펴보자

## 엔티티 매니저 팩토리, 엔티티 매니저

엔티티 매니저 팩토리는 엔티티 매니저를 생성하는 클래스입니다. 일반적으로 하나의 데이터베이스를 사용하는 애플리케이션은, 하나의 엔티티 매니저 팩토리를 생성하고 이를 통해 엔티티 매니저를 생성합니다.

엔티티 매니저 팩토리는 생성시 매우 큰 비용을 지불해야 하므로, 애플리케이션당 하나를 사용하면 되고, **Thread-safe**하므로 다른 스레드와 공유해도 괜찮습니다.

반면 엔티티매니저의 경우, 생성 비용이 거의 들지 않지만 여러 스레드가 동시에 접근할 경우, **동시성 문제**가 발생하므로, 스레드간 공유하면 안됩니다.

<img width="473" alt="JPA_3_1" src="https://user-images.githubusercontent.com/30853787/210956641-10027f43-7206-4d82-96d1-25c6d304035e.png">

또한, 엔티티 매니저는 데이터베이스 연결이 필요한 시점까지 커넥션이 없는 상태로 유지하다가, 트랜잭션이 시작되는 등, 데이터베이스 연결이 필요한 시점이 되면 커넥션을 획득합니다. 

## 엔티티의 생명주기

엔티티는 영속성 컨텍스트라는 엔티티 저장소에 영속되어 관리됩니다.  엔티티는 영속 상태에 따라 4가지의 상태가 있고, 생명주기는 아래와 같습니다.

![JPA_4](https://user-images.githubusercontent.com/30853787/210956646-f95a5164-e574-4b35-a23b-988c0e0780da.png)

- 비영속: 영속성 컨텍스트와 전혀 관계가 없는 상태
    - New를 통해 엔티티를 생성해, 엔티티와 영속성 컨텍스트가 아무 관련이 없는 상태이다.
- 영속: 엔티티가 영속성 컨텍스트에 의해 관리되는 상태
    - **em.persiste(member)** 또는, **em.find(Member.class, “memberId”);** 로 SQL을 통해 데이터 조회 시, 영속상태가 된다
    - 영속된 엔티티는 식별자를 통해 관리된다.
- 준영속: 영속성 컨텍스트에 저장되었다가 분리된 상태
    - em.close()로 영속성 컨텍스트를 닫거나 em.clear()를 호출해 영속성 컨텍스트를 초기화하는 경우, 엔티티들이 준영속 상태가 된다
    - **em.detach(member)**같이 특정 엔티티를 준영속시킬수도 있다.
    - 개발자가 엔티티를 준영속 상태로 만드는 일은 흔치않은 일입니다.
- 삭제: 삭제된 상태
    - em.remove(member); 를 통해 영속성 컨텍스트 및 데이터베이스에서 삭제됩니다.

## 영속성 컨텍스트란?

**엔티티를 영구 저장하는 환경**으로, 엔티티 매니저를 통해 엔티티를 저장하거나 조회했을 때, 엔티티 매니저는 엔티니를 영속성 컨텍스트에 보관 및 관리합니다. 객체와 관계형 데이터베이스 사이의 패러다임 불일치 문제나 성능 개선을 위해 아래와 같은 특징을 갖습니다.

### 엔티티 조회 시 1차캐시 제공

영속성 컨텍스트 내부에는 Map 자료구조가 존재합니다. @Id로 매핑한 값을 Key로 사용하고, 엔티티 인스턴스를 Value로 합니다. 

만약 멤버 인스턴스가 생성되어 **영속성 컨텍스트에 영속된 상태**라면, 해당 엔티티에 대해 식별자로 조회했을 때 동일성이 보장되는 멤버 인스턴스를 **데이터베이스 조회 없이** 조회해주는 **캐싱 기능**을 제공합니다. 이를 **1차캐시**라고 합니다.

```java
String memberId = "member1";
Member member = new Member();
member.setId(memberId);

em.persist(member);

Member emMember = em.find(Member.class, memberId);

//동일성 보장, Insataces has same identity 출력
if(emMember == member) System.out.println("Insataces has same identity");
```

1차캐시에 엔티티가 저장되어있는경우의 workflow입니다. 

![JPABook_97 drawio](https://user-images.githubusercontent.com/30853787/210956653-ad82cf2d-7e52-48f9-b3f0-785f73a587c5.png)


위의 경우와 달리, 멤버 **엔티티가 1차캐시에 등록되어있지 않다면**, SQL문으로 데이터를 조회하고, 엔티티를 생성한 뒤 1차캐시에 저장해 이를 반환한다. 

```java
//데이터베이스에 존재하지만, 영속상태가 아닌 엔티티 조회 
Member emMember = em.find(Member.class, "member2");
```

![JPABook_97 drawio_(1)](https://user-images.githubusercontent.com/30853787/210956650-60b80152-5734-4d92-a11a-3028a9178bf8.png)

따라서 영속성 컨텍스트는 1차캐시 기능을 통해 총 두 가지의 이점을 얻습니다.

- 엔티티의 동일성 보장
- 캐싱을 통한 성능 향상

### 트랜잭션을 지원하는 쓰기지연 (Transactional write-behind)

엔티티 매니저는 트랜잭션을 커밋하기 직전까지 데이터베이스에 엔티티를 전달하지 않고, 쓰기지연 저장소에 쌓아놓고, 트랜잭션이 커밋되는 순간 데이터베이스에 쿼리를 전달합니다. 이것을 트랜잭션을 지원하는 쓰기지연이라고 합니다. 

(1) Commit 전까지 영속성 컨텍스트에 쿼리 저장, 1차캐시에 엔티티 저장

(2) 트랜잭션 커밋 시, DB에 flush.

![JPABook-100 drawio](https://user-images.githubusercontent.com/30853787/210956659-2e9b80db-b21d-4ed8-8694-3561dfbff315.png)

### 엔티티 수정

SQL을 사용한 엔티티 수정 작업은 많은 양의 쿼리 반복과 SQL의존성을 갖게됩니다.

JPA는 역시 트랜잭션을 지원하는 쓰기지연을 이용해 객체지향적인 방법으로 해결합니다.

이 때, 스냅샷이라는 새로운 개념이 등장하는데요, **스냅샷**은 엔티티가 영속성 컨텍스트에 **처음 저장될 때의 값**을 기억해놓은 것입니다.  영속성 컨텍스트는 이를 기반으로, 플러시가 호출되었을 때 엔티티와 스냅샷을 비교해 Update 쿼리를 생성하고, 데이터베이스에 전송, 커밋합니다.   

- 1) flush 호출 시, Entity와 Snapshot 비교해 변경 감지
- 2) 변경된부분이 있다면, 쓰기지연 저장소에 Update Query 추가
- 3) DB에 Update Query 전달 후 커밋

![JPABook-100 drawio_(1)](https://user-images.githubusercontent.com/30853787/210956656-6dec4769-15cb-4516-a35b-debf65f1a6c9.png)


JPA 변경감지의 특징 : **JPA가 생성하는 Update Query는  기본적으로 엔티티의 모든 필드를 업데이트합니다.**

왜 이렇게 하는걸까요? 책에서는 **재사용 측면**에서 두 가지 정도의 장점을 설명합니다.

- 수정쿼리가 항상 같아, 이를 애플리케이션 로딩 시점에 미리 로드해서 재사용할 수 있음
- 데이터베이스는 동일한 쿼리를 받았을 때, 이전에 파싱된 쿼리를 재사용할 수 있음

수정된 필드만을 이용해 쿼리를 전송하고 싶다면, @DynamicUpdate어노테이션을 사용하면 됩니다. 

```java
member.setName("Mklee");
em.flush();
```

```sql
# Name 필드만 변경할것으로 예상
UPDATE MEMBER
	SET NAME = ?,
	WHERE ID = ?;

#모든 필드를 수정
UPDATE MEMBER
	SET 
		NAME=?
		AGE=?
		ADDRESS=?
		...
	WHERE 
		ID=?;
```

### 엔티티 삭제

```java
Member memberA = em.find(Member.class, "memberA");
em.remove(memberA);
```

앞선 생성/수정과정과 마찬가지로, 삭제쿼리 역시 쓰기지연 저장소에 추가됩니다. 

영속성 컨텍스트에서 즉시 엔티티가 삭제되고, 삭제쿼리가 플러시되면 데이터베이스에서도 삭제됩니다.

### 플러시

플러시는 영속성 컨텍스트의 변경내용을 데이터베이스에 반영합니다.( 동기화 )

**동작과정**
- 변경감지 동작, 변경된 엔티티에 대해 수정쿼리를 만들어 쓰기지연 저장소에 저장
- 쓰기지연 저장소에 쿼리를 데이터베이스에 전달( 여기는 삽입,수정,삭제 쿼리 포함입니다)

**플러시를 일으키는 방법**
- 직접호출: em.flush()를 통해 직접 플러시를 호출하는 방법 ( 실무에서 잘 쓰지 않습니다)
- 트랜잭션 커밋: 플러시 없이 트랜잭션만 커밋하면, 데이터베이스에 변경한 데이터가 반영되지 않고, 서버가 종료되는 등의 상황에서 Durability가 보장되지 않는다.
- JPQL 사용: JPQL은, 뒤에서 다루지만 조회쿼리 시 1차캐시를 사용하지 않고 SQL문으로 변환합니다. 이 경우 1차캐시에 저장된 내용이 누락되므로, flush 이후 JPQL이 수행되어야 합니다.

**플러시 모드 옵션**
- FlushModeType.AUTO: 커밋이나 쿼리 실행 시 플러시
- FlushModeType.COMMIT: 커밋 실행시 플러시, 최적화를 위한 옵션입니다.

## 준영속 상태

엔티티가 준영속”detached” 상태라는 것은, 영속성 컨텍스트에서 분리되어 관리대상에서 벗어남을 의미하며, 앞서 설명한 영속성 컨텍스트의 기능들을 활용할 수 없음을 의미합니다.

영속성 컨텍스트에서 분리되는 방법: 준영속 엔티티를 만드는 방법

* em.detach(entity);  → 특정 엔티티만을 준영속상태로 만듦
* em.clear(); → 영속성 컨텍스트를 비워, 내부에 있던 엔티티를 준영속상태로 만듦.
* em.close(); → 엔티티매니저를 닫힘.

준영속과 비영속은 매우 가까운 상태입니다. 하지만, 준영속 상태는 이미 영속된적이 있는 엔티티로, 식별자 값이 존재합니다.

 또한 준영속 → 영속상태로 가는 동작을 merge라고 합니다. 책에서는 길게 설명하지만, 짧게 요약하자면,

 “merge 와 persist는 매우 비슷하지만, merge는 식별자 값을 제외한 값을 영속성 컨텍스트에 복사 후 리턴한다” 입니다.


### 복습질문

- [ ]  1.엔티티 매니저와 엔티티 매니저 팩토리란? 각각의 역할, 특징은 무엇인가?
- [ ]  2. 1차캐시의 장점은 무엇인가?
- [ ]  3. 쓰기지연은 무엇이고, 어떤 장점이 있는가?

### 챕터에 나오지 않지만 알아야하는 부분

- [ ]  1.엔티티 매니저가 커넥션을 맺는 시점과 끊는 시점
- [ ]  2.준영속 상태가 되면, 데이터베이스에는 남아있는가?

**복습질문 정답**

1.  엔티티 매니저 팩토리는 엔티티 매니저를 생성하는 객체, DB 커넥션 풀을 관리하고,  
	JPA의 **엔티티메니저**는 엔티티를 저장/수정/삭제/조회 하는 등, 엔티티와 관련된 많은 일을 처리하는 엔티티 관리자입니다(이름과 같은 역할).  
	또한 **영속성 컨텍스트에 엔티티를 저장하면서 캐싱/변경감지/쓰기지연 등, CRUD의 성능을 개선합니다.**

2. 성능상의 이점과 엔티티 간 동일성을 보장해주는 장점이 있습니다.
3. 트랜잭션을 커밋할때까지 엔티티를 1차캐시에 저장해놓고, 쓰기지연 SQL저장소에 쓰기 SQL을 저장해놓는다. 이후 트랜잭션이 커밋되면 flush작업과 함께, 쓰기 SQL을 데이터베이스에 전달하는것을 쓰기지연이라고 하고,  

**더 알아보기 정답**
1.  엔티티매니저는 데이터가 변경되는 시점에 트랜잭션을 시작합니다.  앤티티메니저의 메서드를 호출 할 때, 트랜잭션 상태가 아니면 [TransactionRequiredException](https://docs.oracle.com/javaee/7/api/javax/persistence/TransactionRequiredException.html)을 발생시킵니다. 
2. 데이터베이스에는 남아있지만, 1차캐시에는 존재하지 않는 상태가 됩니다.

## Referecnce

* [자바 ORM 표준 JPA 프로그래밍](http://www.yes24.com/Product/Goods/90439472)
* [Oracle Java Docs(javax.persistence)](https://docs.oracle.com/javaee/7/api/javax/persistence/)
