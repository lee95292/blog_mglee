---
layout: post
title:  "JPA 연관관계 매핑 기초"
date:   "2022-01-17"
category: "tech"
tags: ["JPA", "JPA study"]
---
테이블과 객체 사이에는 많은 패러다임 불일치가 있다고 앞선 챕터에서 설명했습니다. 그 중 가장 간극이 크다고 여겨지는 불일치중 하나는 **연관관계의 참조**에 대한 불일치 문제입니다. 

JPA가 이런 연관관계 참조 불일치 문제를 어떤 방식으로 해결하는지 살펴보겠습니다. 

이번 챕터에서는 객체 연관관계 매핑의 기초적이고 개념적인 부분을 체크합니다. 실제 프로덕트에 개발을 고려하고있다면, [다음 글 링크] 를 확인하세요!

**JPA의** **연관관계 매핑을 공부하기 전, 알아야할 내용!** 

- 방향성: 양방향, 단방향이 있습니다. [팀 → 멤버] 참조 [멤버 → 팀]으로참조하는 하나의 방향만 있는 경우 단방향, 두 방향 모두 참조가 가능하다면 양방향이라고 합니다. **단방향 관계는 객체에만 존재하고, 테이블은 항상 양방향 관계이므로 단방향 관계가 존재하지 않습니다.** Foreign key와  Join을 통해 양쪽 테이블을 참조할 수 있기 때문입니다.
- 다중성: [다대일(N:1), 일대다(1:N), 일대일(1:1), 다대다(N:N)] 관계가 있습니다. 여러 회원이 하나의 팀에 속하므로 다대일 관계이고, 팀은 여러 회원이 소속될 수 있으므로 일대다 관계입니다.
- 연관관계의 주인: 객체는 단방향 참조 두 개를 통해 양방향 관계를 만듭니다. 따라서, 연관관계의 주인을 정하고 이를 통해서 연관관계를 관리해야 합니다. ( 추후 설명 )

**RDBMS의 외래 키**

RDBMS에서는 외래 키는 다른 테이블의 Primary Key를 참조하는 컬럼을 말합니다. 여기에 RDBMS에서 제공하는 외래 키 제약조건(Foreign Key Constraint) DDL을 선언해주면 , **참조 무결성을 보장합니다.**

참조 무결성은 보통 삭제동작에서 검증하며, 부모 레코드가 삭제되어 고아 레코드가 되는것을 방지하고, 

![1](https://user-images.githubusercontent.com/30853787/226088579-d6d0d2ee-1508-4fee-8f78-6179a0462961.png)

먼저 팀과 멤버가 갖는 **객체, 테이블** 각각에서의 연관관계를 확인하며 연관관계가 갖는 특성을 살펴보겠습니다.

- 객체에서의 연관관계
    - Member.team필드로 참조를 통한 연관관계를 갖습니다.
    - 이는 **단방향 관계**입니다. member.getTeam()을 통해 팀을 알 수 있지만, team.getMembers()를 통해 멤버 정보를 알 수 없기 때문입니다.
- 테이블에서의 연관관계
    - TEAM_ID라는 외래 키를 통해 연관관계를 맺습니다.
    - TEAM_ID를 통해 Member를 기준으로 Join할 수도 있고, Team을 기준으로 Join할수도 있습니다.

- 객체와 테이블 연관관계의 가장 큰 차이점: 객체는 [member → team], [team → member] 로 참조를 두 개 만들어도, 양방향 관계가 아니다!
    - 만약 두 방향의 참조가 모두 있다고 가정해보자.  team에 member들이 소속되어있고, member도 team 필드를 가지고있다.
    - 만약 멤버가 팀을 옮겨서 member.setTeam(anotherTeam); 으로 팀을 옮겼다고 해도, **team 객체에는 옮긴 멤버의 참조가 남아있다.**  단방향 관계 두 개를 따로 관리해야하는 것이다. (연관관계의 주인, mappedby가 필요한 이유)
    - 하지만 테이블은 Foreign Key를 통해 Join하므로, 멤버의 TEAM_ID필드가 변경된 경우, Team테이블에서도 Join을 통해 멤버를 조회했을 때 정상적으로 확인된다(옮긴 멤버가 조회되지 않는다)

### JPA에서의 객체 매핑

Member와 Team엔티티가 연관관계를 맺는 예시입니다. 아래에서는 해당 엔티티를 통해 연관관계 매핑을 설명합니다. 

Member 엔티티 

```java
@Entity
public class Member{
	@Id
	@Column(name="MEMBER_ID")
	private String id;

	@ManyToOne
	@JoinColumn(name="TEAM_ID")
	private Team team;

	private String username;
}
```

Team엔티티

```java
@Entity
public class Team{
	@Id
	@Column(name="TEAM_ID")
	private String id;

	private String name;

}
```

- @ManyToOne: 다대일관계라는 정보를 갖는 매핑 애너테이션입니다. 매핑 시 **연관관계의 주인 엔티티에** 필수적으로 사용해야합니다. 양방향의 경우, 연관관계를 갖는 각 필드에 알맞는 애너테이션을 추가합니다.
- @JoinColumn: 외래키를 name속성의 컬럼에 매핑합니다. 생략 가능하며, 생략 시 [필드이름  + 연관 엔티티 식별자 이름] 으로 기본값을 갖습니다. (따라서 위의 경우는 “team_id” 컬럼!)

### 연관관계 저장

엔티티를 저장할 때는, 연관관계 엔티티를 저장하려 하는 경우, **연관 엔티티 역시 영속상태여야 한다.**

 > 이것을 보고 궁금해서 직접 실험해봤는데, 영속하지 않은 상태에서 setTeam한 후, 영속시켜도 정상적으로 동작하는것을 확인했다.  내부적으로 어떤 차이가 있는지는 확인이 필요하다.

### 조회

- 객체 그래프 탐색을 통한 조회(프록시를 이용)
    - 객체지향적인 방법!
- 객체지향 쿼리 사용(JPQL: SQL 방언으로 변환)
    - 파라미터를 쿼리에 바인딩하는 전통적 방법과 유사하다.
    - 연관 엔티티는 Join문을 통해 조회한다.

### 수정

 **연관 엔티티 수정**은 특별한 방법 없이 엔티티를 수정하면 플러시 시점에 변경감지가 작동한다.

### 삭제

연관 엔티티를 제거할 때는, **연관관계의 주인이 먼저 삭제될 수 없다(외래 키 제약조건) 이 경우, 데이터베이스에서 참조 무결성 오류가 발생한다.** 

따라서, 외래키를 가지고있는 부모 엔티티의 연관관계를 삭제하거나, 자식 엔티티를 삭제해 연관관계를 지운 후 부모 엔티티를 삭제할 수 있다.

### 복습질문

- [ ]  테이블이 양방향 참조를 할 수 있는 이유는 무엇인가요? (객체와 참조 방향성 측면에서 어떤 차이가 있나요?)
- [ ]  영속되지 않은 엔티티를 영속상태의 엔티티에 연관객체로 지정할 수 있나요?
    - [ ]  비영속상태의 team와 영속상태의 member에서, member.setTeam(team)
    - [ ]  영속상태의 team와 비영속상태의 member에서, member.setTeam(team) 후 member 영속

### Reference

[MS learn - 외래 키 제약조건]([https://learn.microsoft.com/ko-kr/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver16](https://learn.microsoft.com/ko-kr/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver16))