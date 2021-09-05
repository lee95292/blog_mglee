---
layout: post
title: "웹훅 (webhook)이 뭐야?, HTTP/2.0 Webpush 스펙 요약"
date: "2020-05-10"
category: http
---

# Intro

오늘 소개할 주제는 **webhook** 입니다.

서비스를 배포하거나 관련 공부를 해보셨다면,  
github과 Jenkins같은 CI도구를 연동하며 github에서 푸쉬를 비롯한 특정 이벤트를 jenkins로 전달해주기 위해 연동해본 경험이 있습니다.

이때 github서버는 Jenkins가 별다른 요청을 하지 않아도 서버 내에서 특정 이벤트가 일어났을 때 Jenkins로 관련 정보들을 보내줍니다.  
이것은 "웹훅"이라고 불리는 과정인데요, 일반적으로 클라이언트가 서버에게 정보 또는 행위를 요청하는 방식과는 다릅니다.

오늘은 위에서 설명한 웹훅이 어떻게 가능한지 간단하게 공부하려합니다.

---

클라이언트에서 서버의 자원을 이용하기 위해, 또는 서버를 동작하기 위한 인터페이스로 Web API를 사용합니다.

이와 반대로 **역방향 API, 서버에서 발생하는 이벤트를 처리하기 위해 Webhook을 사용한다는 것을 알게되었습니다.**

웹 API를 통해 클라이언트의 요청을 처리하는 방식은 일상적인 방법이기에 무리없이 관련 동작을 이해하고 개발에 사용했지만,  
 서버에서 발생하는 이벤트를 클라이언트로 전달하는 과정은 쉽사리 이해되지 않았습니다.  
 또한 순수하게 이것이 어떤 원리로 가능한지 궁금하기도 했습니다.

# Principle

핵심적인 원리에 접근하는것은 어렵지 않았습니다.

webhook은 언제부턴가 익숙한 개념이 되어있었고, RFC문서가 존재할것이라 생각해서 [rfc webhook](https://tools.ietf.org/html/rfc8030)으로 검색한 결과 HTTP/2.0 부터 지원하는 **Web push**스펙을 확인할수 있었습니다.

```bash

    +-------+           +--------------+       +-------------+
    |  UA   |           | Push Service |       | Application |
    +-------+           +--------------+       |   Server    |
        |                      |               +-------------+
        |      Subscribe       |                      |
        |--------------------->|                      |
        |       Monitor        |                      |
        |<====================>|                      |
        |                      |                      |
        |          Distribute Push Resource           |
        |-------------------------------------------->|
        |                      |                      |
        :                      :                      :
        |                      |     Push Message     |
        |    Push Message      |<---------------------|
        |<---------------------|                      |
        |                      |                      |

                      Figure 1: WebPush Architecture
```

RFC 8030에 소개된 overview에 소개된 webpush의 구조입니다. (UA: user agent)

사실 이 그림을 보자마자 웹훅을 위한 Push service가 따로 존재하는구나! Push sevice가 메시지 브로커 역할을 하는군! 이라고 이해하시면 웹훅을 사용할때 큰 문제가 없습니다.

발행/구독 구조에서 확인할 수 있는 push, monitor, message를 이해하신다면

Subscriber : UA (user agent)  
Publisher : Application Server  
Broker : **Push Service**

라고 생각하시면 됩니다.

이는 아래와 같이 동작합니다.

1. UA가 Application Server의 push service를 구독하고, push service를 모니터링합니다.
2. 이후 Application Server에서 UA가 원하는 동작이 발생하고 trigger를 통해 이벤트 메서드를 호출합니다.
3. Application server는 발생한 Action에 대한 정보를 담은 메시지를 Push service에 전달하고,
4. Push service는 구독 정보를 참조해 관련있는 Subscripbers에게 메시지들을 전달합니다.

<img src="https://www.researchgate.net/profile/Ashwin_Makwana/publication/301350598/figure/fig1/AS:352171422961666@1460975618330/Publish-Subscribe-Model.png"/>

<그림: 발행/구독 모델>

---

### Features

발행/구독구조의 특징과 함께 Webpush에 존재하는 몇가지 특징이 있습니다.

User Agent(이하 UA)가 구독을 시작하며 Webpush 시나리오가 시작됩니다.  
구독은 UA와 Push server, Application server간 연결을 뜻하며, HTTPS(port:443)위에서만 동작합니다.

구독과 관련된 정보는 push service에 저장되며, 이 정보를 UA와 Application server가 각각 사용합니다.

---

_실제 API 문서와 RFC의 overview에 소개된 내용을 위주로 특징들을 리스트해보았습니다._

- UA는 모든 incomming messages를 모니터링하기 위해 구독정보를 사용합니다.

- Application server는 trigger가 발생한 Action 관련 정보들을 push service에게 던지는 과정을 위해 구독 정보를 사용합니다.

- Push API는 클라이언트와 서버 간 비동기적 통신을 지원합니다

  - Push service는 UA가 비활성 상태이더라도 메시지를 전달하기 위해 활성상태가 될때까지 메시지를 저장합니다.

  - 마찬가지로 Push service는 Application Server가 비활성 상태이더라도 저장된 Push message를 UA에게 전달합니다

  - (WebPush API의 이러한 특징과 Notification API를 이용해 Chrome에서는 알림 API를 지원합니다!)

- UA와 Application server가 통신중일때도 push service는 동작합니다.  
  하지만 fetch, websocket등의 직접통신 API들에 비해 리소스가 많이 소요되고 지연현상이 많아 UA와 Application server가 활성연결 상태가 아닐 때 사용하는것을 권장하고 있습니다.

# Ending

W3C의 API 스펙과 RFC8030의 Overview탭을 위주로 작성했습니다.

설명한 특징 이외에도 다양한 동작 시나리오 / 특징들이 있습니다.  
아래 그림에서는 User Agent를 webpage와 service worker까지 추가해서 설명하고있습니다.

저처럼 WebPush에 대한 호기심이 생기셨다면, 추가로 읽어보시는것도 추천드립니다..!

<img src="https://www.w3.org/TR/push-api/sequence_diagram.png" />

<그림 Webpush API 메서드 동작 시나리오 (WC3)>

# Reference

[http1,2 차이점](https://medium.com/@shlee1353/http1-1-vs-http2-0-%EC%B0%A8%EC%9D%B4%EC%A0%90-%EA%B0%84%EB%8B%A8%ED%9E%88-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0-5727b7499b78)

[RFC8030 Web push](https://tools.ietf.org/html/rfc8030)

[W3C Webpush API spec](https://www.w3.org/TR/push-api/#application-server)
