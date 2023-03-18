---
layout: post
title:  "JPA 연관관계 매핑 기초"
date:   "2022-01-17"
category: "tech"
tags: ["JPA", "JPA study"]
---
# JPA 다대일, 일대다 매핑

이글에서는 **다대일, 일대다 매핑**과 **연관관계의 주인**에 대해 알아보겠습니다. 

### 일대다, 다대일 관계

JPA의 일대다, 다대일에서는 항상 연관관계의 주인이 “다” 쪽이고, 외래키 역시 “다”쪽에서 관리합니다. 예를들어 Member와 Team이 있다면, 항상 Member가 Team을 참조할 수 있는 외래키를 가지고있는 것이죠. 

RDBMS의 레코드는 컬럼에 하나의 값만 들어가는 [원자성]([https://ko.wikipedia.org/wiki/제1정규형#원자성(Atomicity)](https://ko.wikipedia.org/wiki/%EC%A0%9C1%EC%A0%95%EA%B7%9C%ED%98%95#%EC%9B%90%EC%9E%90%EC%84%B1(Atomicity)))을 가지고있으므로, 일대다 관계에서 “일” 쪽이 “다”의 외래키를 들고있을 수 없기 때문이죠.

하지만 객체는 다릅니다. 하나의 객체가 List를 가지고있을 수도 있기때문에, “일”쪽에서 연관관계의 주인이 되고싶어할 수 도 있습니다. 이런 경우, JoinTable을 통해 제 3의 테이블이 Member와 Team의 연관관계를 관리하게되고, Team객체에서도 외래키를 수정할 수 있게 되죠. 하지만, 이는 잘 사용하지 않습니다.

## 연관관계의 주인

연관관계의 주인이란, 연관관계에서 외래키의 등록/수정/삭제 권한을 갖는 엔티티를 의미합니다. 

외래키를 통한 양방향 관계인 데이터베이스 테이블과 달리, **양방향 매핑 관계**에서 객체는 두 개의 단방향 참조로 이루어져있으므로 **외래 키를 관리할 주체를 mappedby를 통해 설정**해야 합니다. (연관관계의 주인이 아닌 쪽에 mappedBy를 설정한다)

## 다대일 단방향
![2](https://user-images.githubusercontent.com/30853787/226089333-f4316b73-a8d9-4317-b6a1-0378f10bc01e.png)

**다대일 단방향관계에서는 항상 연관관계의 주인은 “다” 쪽**입니다. 아래 예시에서도 멤버와 팀의 경우, 멤버에서 외래키를 들고있으며, 테이블에서도 외래키를 가지고있는것을 확인할 수 있습니다. 

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

```java
@Entity
public class Team{
	@Id
	@Column(name="TEAM_ID")
	private String id;

	private String name;

}
```

Team객체에서는 Member로의 참조가 없습니다.하지만 Member는 Team의 id 컬럼을 TEAM_ID로 매핑해 사용합니다. 

또한, ManyToOne같은 다대일, 일대다 관계에서는 “다”측이 자동으로 연관관계의 주인이 되어 외래키를 관리합니다. 

## 일대다 단방향

![1](https://user-images.githubusercontent.com/30853787/226089331-adbb4ebb-c020-42ca-9fd3-2daa425141af.png)

일대다 단방향 매핑은 많이 사용되지 않는 매핑입니다. Team, Member관계에서 Team이 연관관계를 가지고있기 위해서는 JoinTable이라는 제 3의 테이블이 등장합니다. 이를 통해 Team에서 JoinTable에 있는 외래키를 관리해, Team이 외래키를 관리하는것 “처럼” 보이게 해주죠. 

보통은 일대다 단방향 관계에서도 JoinColumn을 통해 “다”쪽에서 외래키를 관리합니다.

일대다 단방향 관계에서 JoinColumn, JoinTable이 어떻게 생성되는지 실험해봤으니, 궁금하다면 [실험 리포지토리]([https://github.com/lee95292/jpa-tests/blob/main/documents/AsscociateTest.md](https://github.com/lee95292/jpa-tests/blob/main/documents/AsscociateTest.md))에서 확인해보시길 바랍니다.

## 다대일, 일대다 양방향



앞선 단방향 관계에서 점선 하나가 추가되었습니다. (연관관계의 주인이 아닌 방향 참조) 다대일 양방향 연관관계는 신경쓸 것이 많습니다. 두 객체가 서로에 대한 참조를 가지고있기에**, 데이터의 불일치가 발생**할 수 있습니다.

 먼저 코드를 살펴보고, 고려해야할 사항을 뒤따라 살펴보겠습니다.  

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

	public void setTeam(Team team){
		this.team = team;
		//중복, 무한루프에 빠지지 않도록 체크
		if( !team.members.contain(this) ){

			team.members.add(this);
		}
	}
}
```

```java
@Entity
public class Team{
	@Id
	@Column(name="TEAM_ID")
	private String id;

	private String name;

	@OneToMany(mappedBy="team")
	private List<Member> members;

	public void addMember(Member member){
		members.add(member);
		if(member.getTeam() != this){
			member.setTeam(this);
		}
	}

}
```

앞선 다대일 단방향 관계와 달라진 점들이 있습니다. 양방향 관계에서 특히 주의해야할 부분입니다.

### 편의 메서드 작성 (중복, 불일치 및 무한루프  방지)

위에서 연관관계를 설정할 때, 기본 setter를 사용하는것이 아닌, 편의 메서드를 작성한 부분을 확인할 수 있습니다. (addMember, setTeam에 해당)

앞서 말했듯 객체의 양방향은 두 개의 단방향이므로, 팀이 멤버를 추가했어도 멤버는 팀을 설정하지 않아 데이터 불일치가 발생하므로, 팀 → 멤버 추가, 멤버 → 팀 추가에 대한 코드를 함께 작성하고, 이를 팀,멤버 엔티티 모두에 작성하는것이 좋습니다. 이를 통해서 데이터의 불일치를 방지할 수 있습니다.

- 데이터 삽입 시에는 중복삽입이 발생할 수 있습니다.
- toString문에서는 무한루프가 발생합니다. 이를 순환참조라고 합니다.
    - member. toStirng → member.Team.toString→ member.Team.members.toString() ….
    - 이를 방지하기 위해, DTO를 사용하거나, Mapper, Json관련 애너테이션을 사용합니다.
    - [순환참조 문제 해결 방법들]([https://dev-coco.tistory.com/133](https://dev-coco.tistory.com/133))을 참고해주세요. 저는 mapper 라이브러리를 사용해 DTO에서 데이터를 관리하는 방법을 사용합니다.

### 연관관계의 주인 설정

**앞선 단방향 관계에서는 연관관계를 매핑하는 필드가 멤버에 존재했으므로 외래키의 관리하는 쪽(=연관관계의 주인)은 멤버였습니다.**

하지만 양방향 연관관계는 멤버, 팀 모두가 참조를 가지고있으므로, 연관관계의 주인을 **직접 설정**해야합니다.

**mappedBy속성은 연관관계의 주인을 어디로할지(외래키를 어디서 수정할지)에 대해서 명시합니다. (@OneToMany(mappedBy="team")에 해당)**

참고로, ManyToOne은 연관관계의 주인인 Many쪽에서 외래키 필드를 관리하므로,  mappedBy속성이 없습니다.

### 복습질문

- mappedBy속성은 어느 경우에 어디에 사용하는가?
- 편의메서드를 작성하는 이유는?
- [백기선님의 “이것도 모르면 JPA쓰지마라(다시 공부하거나) ”]([https://www.youtube.com/watch?v=brE0tYOV9jQ&t=135s](https://www.youtube.com/watch?v=brE0tYOV9jQ&t=135s))

### 추가질문

- OneToMany 단방향 관계에서 외래키 관리는 어떻게 동작하는가?

### 복습 및 추가질문 정답

## Reference

책 -  김영한 저 Java ORM 표준 JPA 프로그래밍 (에이콘 출판, 2015)