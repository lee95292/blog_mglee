---
layout: post
title:  "gRPC의 동작원리와 기본 개념"
date:   "2023-01-23"
category: "tech"
tags: ["gRPC", "gRPC 스터디"]
---
# gRPC 개요

## gRPC 소개, Pros & Cons

MSA와 같은 분산 서비스 시스템에서 느슨한 결합과 효율적인통신을 위해 고안된 방법입니다.

- [+]gRPC는 Protocol Buffer 기반 바이너리 프로토콜을 사용해 기존 REST등에서 사용된 JSON,XML포맷의 text기반 통신 비효율을 해결합니다.
- [+] 아래의 HTTP/2 특징 위에서 구현되어 통신속도가 빠릅니다.
  - **Binary framing layer**: 데이터를 **바이너리로 이뤄진 프레임으로 전달, 송/수신 레이어에서 다시 재조립**하는 기능을 제공하는 HTTP2에서 도입된 계층
  - **Multiflexing**지원: Binary framing을 통해 가능해짐. 여러 스트림에서 양방향으로 frame을 통신. **비동기, 양방향 데이터 통신**
  - 이외에도 서버 푸시, 스트림 우선순위 등의 특징과 함께 성능이 대폭 개선됨.
- [-] 데이터 스키마 수정 시 서버 및 클라이언트 코드를 모두 변경해야합니다.
- [-] human readable하지 않습니다.

![1](https://user-images.githubusercontent.com/30853787/215021105-c50f8ef0-6537-4060-98dc-f42dd517319c.png)
[그림] - Soap, REST, gRPC의 기본 데이터 전송 포멧의 장단점 비교

## 간단하게 요약해보는 gRPC 매커니즘
![2](https://user-images.githubusercontent.com/30853787/215021110-d92e6249-993d-4055-a541-de3e9bdf957d.png)
- 서버는 클라이언트 호출을 핸들링하고, 클라이언트는 서버와 같은 메서드를 실행하는 Stub을 작성한다.
- gRPC는 서로 다른 **다양한 언어**로 작성된 서버/클라이언트 사이에서 통신할 수 있다.
- gRPC는 **서버의 메서드를 로컬 객체인것처럼 호출한다.**

## Protocol Buffer를 통해 동작

Protocol Buffer란, gRPC에서 구조화된 데이터를 직렬화하기 위한 오픈소스 메커니즘입니다. 언어와 플랫폼에 중립적으로 동작합니다. (영향을 받지 않습니다)

자세한 스펙은 [https://protobuf.dev/](https://protobuf.dev/) 를 참고해주세요!

```protobuf
message Person {
    string name = 1;
    int32 id = 2;
    bool has_ponycopter = 3;
}
```

gRPC는 서버와 클라이언간 이진 바이트 통신을 하기 위해 Protocol Buffer를 기본 전략으로 사용합니다.

*.proto파일에 데이터 구조를 정의합니다. 직렬화하고싶은 데이터를 위와 같이 key-value필드로 매핑해 *.proto 파일로 작성합니다.

## 컴파일 및 메시지 인코딩

**protoc**은 프로토콜 버퍼 컴파일러입니다.

이는 *.proto 파일에서 정의한 내용으로 **특정 언어가 데이터에 접근할 수 있는 클래스파일을 생성**합니다.

name(), set_name()과 같은 메서드를 통해 **raw bytes에서 메시지로 직렬화하거나 그 반대로 파싱**할 수 있습니다.

## 동작

- 서버 측에서 서버는 서비스에서 선언한 메서드를 구현하고 gRPC 서버를 실행하여 클라이언트 호출을 처리합니다. gRPC 인프라는 들어오는 요청을 디코딩하고 서비스 메서드를 실행하며 서비스 응답을 인코딩합니다.
- 클라이언트에는 메시지를 서버와 동일한 방식으로 바라보는 **stub**이라는 객체를 통해 메시지와 파라미터를 인코딩해 rpc를 수행하고, 서버가 처리한 결과를 디코딩해 처리합니다.

![3](https://user-images.githubusercontent.com/30853787/215021107-2b48721b-bd09-421a-bd36-72ea21d11cc0.png)
> 출처 Geeks for geeks

## gRPC 요청 타입

![4](https://user-images.githubusercontent.com/30853787/215021109-7b7dacd0-f65d-45cc-b5b0-af7188288e7e.png)

stream을 통해 대량 데이터가 전달될 수도 있습니다. 그래도 gRPC의 프로그래밍 API에서는 대부분 비동기 처리를 지원하므로, stream data 및 단일 요청에 대해서도 Blocking없이 비동기적으로 처리 가능합니다.

**Unary RPC**

클라이언트에서 단일 요청을 보내고, 서버가 단일 응답을 보낸다.

```protobuf
rpc SayHello(HelloRequest) returns (HelloResponse);
```

**Server Streaming RPC**

클라이언트가 단일 요청을 보내고, 서버가 스트림을 통해 여러개의 메시지로 응답한다.

```protobuf
rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
```

**Clinet Streaming RPC**

클라이언트가 스트림을 통해 여러게의 메시지를 보내고, 서버가 단일 메시지로 응답한다.

```protobuf
rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
```

**Bidrectional Streaming RPC**

클라이언트와 서버가 독립적인 스트림을 주고받으며

```protobuf
rpc BidiHello(stream HelloRequest) returns (stream HelloResponse);
```

## 질문

- server와 client의 stub간 동기화가 필요하지 않나?
  - → 그렇다. protocol buffer를 사용하는 경우, 스키마를 공유하기 위해 스키마 정보를 가진 proto파일을 동기화해 컴파일하거나, 컴파일된 protob파일을 동기화해서 사용해야 한다.
- stub을 웹 브라우저에 올릴 수 없는 이유?
  - → 기술적으로는 가능하다. but 엄격한 타입 정의를 통해 통신이 이뤄지는데,만약 스키마 변경 시 end-user에게는 전달되지 않아 장애가 발생할 수 있음.
- 기존 RPC와는 어떤 차이가 있나?
  - gRPC의 경우 HTTP2을 통해 통신한다고 가정하고 구현했으므로, protocol buffer를 통해 binary data로 컴파일하고, binary frame으로 통신해 오버헤드가 적다. (기존 RPC에서는 주로 XML같은 text 기반으로 통신했으므로, 비효율적이다)
- text기반 통신이 binary기반 통신에 비해 비효율적인 이유는 무엇인가?
  - 문자를 제외한 number, boolean을 표현할 때, 사용하는 데이터 공간이 더 크고, 이는 통신 속도에도 영향을 미친다.

## keyword

gRPC, Protocol Buffer, Multiflex, Data access object, Binary framing, Async

## Reference

[https://grpc.io/docs/what-is-grpc/introduction/](https://grpc.io/docs/what-is-grpc/introduction/)

[https://web.dev/performance-http2/](https://web.dev/performance-http2/) - (Refer:HTTP2 spec, binary framing, multiflexing)

[https://learn.microsoft.com/ko-kr/aspnet/core/grpc/comparison?view=aspnetcore-7.0](https://learn.microsoft.com/ko-kr/aspnet/core/grpc/comparison?view=aspnetcore-7.0) (refer: pros&cons of gRPC)

[https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system/](https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system/)

[https://codingffler.tistory.com/28](https://codingffler.tistory.com/28)