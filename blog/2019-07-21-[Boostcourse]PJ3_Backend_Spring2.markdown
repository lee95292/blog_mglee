---
layout : post
title : "[BoostCourse] PJ3 BackEnd 강의 정리(Spring MCV 실습 및 레이어드 아키텍쳐)"
date : "2019-07-21"
category: boostcourse
---

*작성중인 포스트입니다*

---

실습을 따라하는 과정을 포스팅하는 것은 의미없다고 생각했습니다.

내용이 많아 강사님이 자세히 설명하시지 않았지만 스프링을 처음 접하는 입장에서 그냥 넘어가기에는 찝찝한 부분들이 꽤나 있는것 같습니다.  

능동적으로 코드를 작성하기 위해 소스코드를 분석해보고, 관련 정보들을 기록하려 합니다.

(레이어드 아키텍처 실습부분은 따라가기만으로도 벅차서, 완성도 있는 정리할 여유가 있을지 모르겠습니다..)

### 애너테이션

---

* @Datasource
* @Bean

bean을 정의하는 어노테이션

* @ComponentScan

@Controller, @Service, @Repository, @Component 어노테이션이 붙은 클래스를 찾아 컨테이너에 등록

* @Component

컴포넌트 스캔의 대상이 되는 애노테이션 중 하나로써 주로 유틸, 기타 지원 클래스에 붙이는 어노테이션

* @Autowired

주입 대상이되는 bean을 컨테이너에 찾아 주입하는 어노테이션