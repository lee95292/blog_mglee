---
layout : post
title : "Junit 기초 사용법"
date : "2019-08-30"
category: TDD
---

[박재성님 Junit 강좌](https://www.youtube.com/watch?v=tyZMdwT3rIY) 정리

# Junit 기본 사용법
---

(setup)
* STS에 J**unit 라이브러리가 추가되어 있어야 함**. build path에서 추가.
* Junit Test 버튼 클릭으로 테스트 클래스 생성
* Test Annotation을 추가한 메서드 내에서 단위테스트 진행

(using)
* 하나의 메서드만 테스트를 원할경우, 메서드 이름에 커서를 올린 상태로, Ctrl + f11 
* 결과값 확인은, assertEquals(기댓값,결과값), assert류 메서드를 사용해 확인한다. 이 메서드가 false를 반환하면, testcase가 실패하게 된다.
* 인스턴스의 테스트간 독립성을 보장하기 위해 @Before 애너테이션을 통해 초기화 진행하자. 테스트케이스별로 인스턴스 초기화 작업 수행

```java
  ... import...

 ...class 

    @Before
    public void setup(){
        cal = new Calculator();     //후에 수행되는 모든 TestCase에 대해 해당 초기화작업 진행
    }
``` 

* 자원 반납과 같은 후처리 작업의 경우, @After 애너테이션을 사용한다 