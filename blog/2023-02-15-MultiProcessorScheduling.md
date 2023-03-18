---
layout: post
title:  "멀티프로세서 스케줄링과 동기화"
date:   "2023-02-15"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---

현대에는 4 또는 8코어 등 멀티코어를 통해 성능을 극대화하는 시도들이 성공을 거두면서, 다중 코어 시스템을 쉽게 찾아볼 수 있게 되었습니다. 

명령어를 실행하는 코어가 여러개라니 다다익선이라고 생각할 수 있습니다.

- 병렬화의 한계: 병렬화 할 수 있는 작업이 한정적이고, 많은 수의 작업을 병렬화하더라도 이를 병합하는데 오버헤드가 발생합니다.
    
    **하지만  병렬화에도 한계가 존재합니다. (컴퓨터구조론에서 자세히 다룹니다)**
    
- 캐시/메모리 병목: 공유자원인 캐시 및 메모리의 특정 자원에 여러 코어가 접근하면 Lock등을 사용해 동시성을 확보해야 합니다.
    
    Lock에 의해 프로세서가 대기하는것을 Blocking이라고 하는데, 코어 수가 높을수록 같은 자원에 접근할 확률이 높아져 Blocking시간이 길어집니다.  
    
    잘못된 동기화 알고리즘을 사용할 경우 성능이 급격하게 안좋아질 수 있습니다.
    

## 멀티프로세서의 문제점

앞서 언급한 병렬화의 한계에서는 코어가 늘어날수록 성능이 비례하지 않는 이유에 관한 내용이었습니다. 

아래의 멀티프로세서 구조를 참고해 어떤 치명적인 문제가 있을지 알아보겠습니다. 

![1](https://user-images.githubusercontent.com/30853787/226093159-1d3965f3-a3fd-4b46-95b5-4b02559d09a0.png)

- 일반적인 Personal Computer에서는 L3캐시까지 사용되는게 일반적입니다.
- L2캐시까지만 존재하는 경우도 있으며 Intel칩셋 역시 몇몇 모델에 공유 캐시가 존재함을 확인할 수 있습니다.
    - ([https://en.wikipedia.org/wiki/Intel_Core](https://en.wikipedia.org/wiki/Intel_Core))

### **캐시 일관성 문제 (Cache coherance problem)**

캐시는  메인 메모리에서 자주 사용되는 정보를 저장해놓는 데이터의 복사본입니다.

각각의 코어는 근처에 L1, L2코어가 있고 L3 코어부터는 메모리 주변에 위치해있습니다.

**프로세서에서 데이터 조회**는 L1캐시에서 데이터를 조회하고 존재하지 않을 시 L2 ~ Main Memory까지 조회하는 방법을 사용하고,

**프로세서가 데이터를 저장**할때는 위치가 가까운 L1, L2캐시에는 쉽게 데이터를 저장할 수 있지만 L3캐시나 메인 메모리에는 쓰기 비용이 많이 들어 한번에 작성합니다. 

만약 Core 1이 A라는 데이터를 A’로 수정했다면, L1,L2캐시에 반영될 것입니다. 그런데 이 때 Core2가 A의 위치에서 데이터를 가져오고자 한다면 수정된 A’이 아니라 이전 데이터인 A를 가져오게 됩니다. 

이를 **캐시 일관성 문제** 라고 합니다.

이는 데이터 버스를 모니터링하는 MESI등의 프로토콜을 사용해 캐시 접근을 감시해 캐시 불일치를 잡아내고, 무효화(캐시에서 삭제)하거나 원본 캐시 플러시를 통해 해결합니다.

이를 **버스 스누핑이라고 합니다. (**[https://en.wikipedia.org/wiki/Bus_snooping](https://en.wikipedia.org/wiki/Bus_snooping)) ****

### 원자성 보장 문제 (Atomicity problem)

(캐시 일관성 문제가 해결되어, 캐시에 있는 정보는 믿을 수 있다고 가정합니다)

CPU는 병렬적으로 실행되므로 같은 데이터에 대해 접근하는 스레드가 여러개일 수 있습니다. 

이로 인한 동시성 문제가 생길 수 있고, 이는 운영체제 레벨에서 Lock을 제공해야 해결할 수 있습니다.

또한 앞서 말했듯 프로세서 수가 많아질수록 Lock의 Blocking으로 인한 오버헤드가 발생합니다.

### 캐시 친화성 문제 (Cache affinity problem)

캐시의 기본 원리는 “더 자주 사용하는 소수의 데이터를 더 가까이 둔다” 입니다.

또한  다수의 일반적인 프로그램은 어떤 경향성을 보입니다.

- **시간 지역성: 최근에 사용한 데이터를 다시 참조할 가능성이 높음(예시:반복문에서 동일변수 참조)**
- **공간 지역성: 최근에 사용한 데이터의 주변에 있는 데이터를 참조할 가능성이 높음(예시: 배열 순회)**

위 가정들 때문에 캐시에는 다음에 참조할 데이터가 존재할 확률이 높은것이죠.

 만약 다수의 프로세서(CPU)에게 레디 큐에 있는 프로세스를 무작위로 실행한다면, 

A프로세스를 실행하기 위해 로드한 캐시들이 B 프로세스를 사용한다면 또다시 B 프로세스를 위한 캐시들을 로드해야 할 것이고, 심각한 성능 하락으로 이어집니다. (이를 Cache warm up이라고 합니다)

## 멀티프로세서에서의 스케줄링

### 단일 큐 멀티프로세서 스케줄링 SQMS

단일 큐 멀티프로세서 스케줄링 SQMS ( Single Queue Multiprocessor Scheduling )은 이름 그대로 **프로세서가 여러개더라도 하나의 스케줄링 큐를 사용하는 것입니다.** 

이는 간단하게 생각해도 여러가지 문제가 있습니다.

1. Ready Queue도 공유자원입니다. 여러 프로세스가 동시에 하나의 프로세스를 실행하고자 큐에서 빼면, 실제로는 하나의 프로세서만 동작하게 되기에, **락을 걸어서 Queue를 임계구역으로 설정**해야 합니다.
2. Ready Queue를 임계구역으로 설정해 Lock을 적용하면, 심각한 성능 저하가 발생합니다. 
3. 캐시에 친화적이지 않습니다. 

### 멀티 큐 스케줄링 MQMS

멀티 큐 스케줄링 MQMS (Multi-Queue Multiprocessor Scheduling)은 **CPU별로 Ready Queue를 두고, 프로세서별 스케줄링 큐에 작업을 균등하게 할당하는 방식입니다.**

![2](https://user-images.githubusercontent.com/30853787/226093162-d1eed259-c233-4529-9df5-c59d8b7b740a.png)

**해결된 문제**

- SQMS에서는 Ready Queue가 공유자원이었는데, 이제 프로세서별로 하나의 큐가 있으므로 Lock에 의한 오버헤드가 사라졌습니다.
- 프로세서는 무작위의 프로세스를 실행하지 않고 특정 프로세스만을 실행하므로 캐시 친화성이 떨어지는 문제가 해결되었습니다.

**새로운 문제점과 해결방법**

**워크로드 불균형**: 만약 CPU 1에 할당된 프로세스 A가 엄청나게 오래 동작한다면? CPU1의 Ready Queue에는 많은 프로세스가 쌓이는 반면, CPU0은 큐에 프로세스가 없어 놀아버리는 사태가 발생합니다.

### 질문 목록

(진짜 질문) 워크로드 불균형 문제는 작업 할당 시 할당된 작업이 적은 프로세서에게 할당하면 해결되는것 아닌가? 

(진짜질문) 데드락을 발생시키지 않는 Locking 방법이 있는지? ( 아직 진도 안나갔지만, Spin Lock이 멀티프로세서에서 어떻게 동작할지 생각해오기)

싱글코어에서는 운영체제가 동기화를 위해 락을 사용하지 않아도 될까?

- 정답
    
    싱글코어 컨텍스트 스위칭 역시 인터럽트 기반으로 동작하고, 인터럽트는 실행중이던 마이크로 오퍼레이션까지만 실행한다. 마이크로 오퍼레이션이란, CPU Instruction이 포함하는 Fetch Decode Excecute Memory WriteBack보다 더 작은 단위이다. 
    
    [https://ko.wikipedia.org/wiki/마이크로_오퍼레이션](https://ko.wikipedia.org/wiki/%EB%A7%88%EC%9D%B4%ED%81%AC%EB%A1%9C_%EC%98%A4%ED%8D%BC%EB%A0%88%EC%9D%B4%EC%85%98)
    
    → 당연히 동시성을 보장해주지 않는다
    

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture CH.5 Lecture 5. Process Scheduling][(**https://www.youtube.com/watch?v=jZuTw2tRT7w](https://www.youtube.com/watch?v=r1JVA7yOPAM&) [](https://www.youtube.com/watch?v=r1JVA7yOPAM&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN&index=9)**)**

### Sub Reference

TLB [https://wpaud16.tistory.com/304](https://wpaud16.tistory.com/304)