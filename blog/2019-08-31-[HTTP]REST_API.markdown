---
layout : post
title : "REST API 핵심개념 체크"
date : "2019-08-30"
category: web
---
참고 링크

[REST API 제대로 알고 사용하기](https://meetup.toast.com/posts/92)   
[그런 REST API로 괜찮은가(유튜브)](https://www.youtube.com/watch?v=RP_f5dMoHFc)


### REST API란?

다음 조건을 만족하는 분산 하이퍼미디어 시스템(웹)을 위한 아키텍처 스타일의(제약조건) 집합 

즉, 웹을 구현할 떄 사용되는 어떤 [제약조건](https://ko.wikipedia.org/wiki/REST#REST_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%EC%97%90_%EC%A0%81%EC%9A%A9%EB%90%98%EB%8A%94_6%EA%B0%80%EC%A7%80_%EC%A0%9C%ED%95%9C_%EC%A1%B0%EA%B1%B4)들의 집합

1. client - server :클라이언트가 요청하고 서버가 응답하는 구조
2. stateless : 서버가 클라이언트의 상태를 저장하지 않음
3. cache : 캐시(지역성과 공간성에 의존해 데이터 캐싱)
4. uniform interface
5. layered system 
6. code on demand (optional) : 서버에서 클라이언트의 동작 가능하게함 (EX. javascript)


**4.Uniform Interface**가 가장 신경써야하는 제약조건, 구성요소를 살펴보자.

* Identification of resource                       - 자원이 URI로 대표되어야 한다. (대체적으로 잘 지켜짐)
* manipulation of resource through representations - 리소스의 행위를 HTTP 메서드로서 수행해야 한다(잘 지켜짐)
* self-descriptive messages                        - 메시지는 스스로를 설명해야 한다 (잘 지켜지지 않음!)
 * 메시지가 도달하는 경로
 * 응답메시지의 문법(의미전달)
 잘 지켜진 응답메시지 예시를 살펴보자

 ```
 HTTP/1.1 200 OK
 Content-Type: application/json-patch+json
 HOST: example.com

 [ { "op" : "remove", "path": "a/b/c" } ]
```

 [json-patch+json](https://en.wikipedia.org/wiki/JSON_Patch)은 JSON을 문서의 변경을 알리는 웹 표준 포멧이다. op(Operation)에는 add, remove, replace, copy, move, test등의 메서드가 자리할 수 있다.
 * HATEOAS 애플리케이션의 상태는 Hyperlink를 이용해 전이되어야 한다. (잘 지켜지지 않는 경우가 많다.)


### 디자인 특징
* Representational State Transfer - URI가 하나의 Resource를 표헌한다.
* 자원에 대한 행위를 HTTP 메서드로서 표현할 수 있다.
```
DELETE /article/3
```


