---
layout: post
title:  "인터럽트와 제한된 직접 실행"
date:   "2023-02-14"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---

OSTEP에서 본문에 해당하는 챕터 제목이 “Limited Directed Execution: 제한된 직접 실행 원리” 입니다. 

책에서는 인터럽트의 한 종류인 trap에 대해서만 다루지만, 인터럽트에 대해 포괄적으로 알기 위해 관련내용도 정리했습니다. 

## 제한된 직접실행 개요

먼저 Limited가 없는 직접 실행이라는 부분에 대해 알아보자면 , 운영체제가 프로그램의 실행에 관여하지 않고 CPU는 사용자 코드에서 진입점을 찾아 직접 실행함을 의미합니다. 이 경우 몇가지 문제가 발생합니다. 

프로세서(CPU)가 프로세스로 자원을 나눠줄 때 고려해야할 부분으로 크게 세 가지 중요한 요소가 있습니다.

1. **제어권**: 운영체제가 **CPU 및 자원에 대한 제어권을 가진 상태로 프로세스를 실행**해야 합니다. 제어권을 상실할 경우 프로세스가 자원을 무기한 점유하는 상황이 발생할 수도 있기 때문이죠.
2. **성능:** CPU앞서 말했듯 CPU는 초당 처리속도가 다른 하드웨어 기기에 비해 월등히 빠릅니다. 메모리 또는 하드디스크에서 데이터를 가져오는동안 CPU는 정말 많은 시간을 기다려야하겠죠. **운영체제가 이런 I/O작업을 하는 프로세스의 제어권을 뺏고 다른 프로세스를 실행해 CPU활용률을 극대화**합니다.
3. **자원 보호:** 제한없이 실행되는 프로세스는 전체 디스크,메모리를 읽고 쓸 수 있으므로, 이 부분에 대한 제어가 꼭 필요하다 **( System Call Interface를 통한 User/Kernal Mode 분기)**

요약하자면, 다른 장치에 비해 빠른 CPU의 **성능**을 최대한 **안전하게** 활용하기 위해 운영체제가 CPU의 제어권을 갖는 개념을 Limited Directed Execution: 제한된 직접 실행이라고 합니다. 

**쉽게 말하자면**

운영체제가 인터럽트를 통해 하드웨어 리소스에 대한 제어권을 가져올 수 있어야 “성능, 자원보호, 제어권 주도” 등의 이점을 가져올 수 있다는 이야기입니다.

다른 장치에 비해 빠른 CPU의 **성능**을 최대한 **안전하게** 활용하기 위해 운영체제가 CPU의 제어권을 갖는 개념을 Limited Directed Execution: 제한된 직접 실행이라고 합니다.

### 인터럽트의 종류

**Hardware Inturrupt : 외부 기기 또는 사용자, 입/출력에 의한 불특정 시간에 발생해 Asynchronous Interrupt라고도 불립니다.** 

- Clock Interrupt: 한 스레드가 프로세스를 과도하게 점유하는것을 막기 위해 지정된 시간마다 발생하는 인터럽트
- I/O Interrupt: 사용자의 입/출력(또는 예상치못한 외부 이벤트)에 의한 인터럽트
- Machine Check Interrupt: 기기 결함이 발견되었을 때 발생하는 인터럽트

**Software Interrupt (or Trap, Synchronous Interrupt): SW의 예외 핸들링 또는 제어권을 얻기 위해 발생시키는 인터럽트입니다.** 

- Supervisor Call(System Call Interrupt): 사용자 프로그램이 하드웨어 자원을 사용하기 위해 유저모드에서 커널모드로 들어갈 때 발생시키는 인터럽트.
- Program Check Interrupt: 0으로 나누기, 스택오버플로/언더플로같은 S.W Exception처리하는 인터럽트.


### 인터럽트의 실행과정

프로세스가 CPU의 제어권을 갖고있는 상태에서 제어권을 얻기 위해선 인터럽트를 통해 제어권을 뺏어와야 합니다. 

인터럽트 발생: MCU(또는 PIC)라는 장비에 IDT(인터럽트 종류, ISR위치, 우선순위)를 전달하면서 시작됩니다. 

→ **(하드웨어)프로세스 중단** 

- Context Saving 발생: CPU register를 **커널 스택**에 대피시킨다.
- 커널모드로 이동.

→ **(운영체제)인터럽트 처리(Interrupt Handling)**

- 인터럽트를 요청한 장치 또는 메모리 주소, 인터럽트의 원인을 확인하고 ISR 주소로 이동해 ISR을 실행한다.

**인터럽트 서비스 루틴 실행** : 예를들어 마우스로 음악 프로그램을 더블클릭 해 인터럽트가 발생했다면, 해당 프로그램을 프로세스 레디 큐에 등록하는 작업을 한다. 

→ **(하드웨어)상태 복구: 커널 스택에 저장된 CPU레지스터들을 불러오고**, 복구한 PC레지스터로 이동해 원래 프로세스 실행

→ (프로그램): 복구한 PC레지스터부터 다시 실행하므로, 기존 실행시점에서 다시 동작합니다.

### Interrupt로 Context Switch가일어나는 경우

만약 Timer Interrupt가 발생하고 그로인해 ISR에서 스케쥴러로 분기 →  Process A의 버스트 시간이 끝나 Ready상태로 바꾸는 상황을 가정해보겠습니다. 

(아직 스케줄러에 대해 배우지 않았지만 참고로, 스케쥴러 알고리즘은 매 타임 퀀텀마다, I/O로 인한 블록마다 동작하도록 ISR에 정의되어있습니다.  새로운 프로세스가 등록될때에도 비교를 위해 동작합니다. ) 

![Interrupt_And_ContextSwitch drawio](https://user-images.githubusercontent.com/30853787/226093145-c874af7d-2608-4373-97ec-94798ef0ea46.png)

인터럽트가 동작하는 구조는 같지만, 내부에서 동작하는 스케쥴링 처리로 인해 ISR이후 Process(j)로 실행됩니다. 

**(하드웨어)**

- Process(i)를 중단하고 Process(i)실행시점의 **레지스터를 커널 스택으로 대피**합니다.
- 커널모드로 변경합니다.

**(운영체제의 Timer Interrupt에 대한 ISR 동작)**

- 커널 스택에 있는 Process(i)의 레지스터를 Process(i)의 PCB에 저장해줍니다.
- j의 PCB에 저장된 Process(j)의 레지스터를 커널스택으로 옮깁니다.
- j프로세스의 실행주소(PC)로 return from trap합니다.

**(하드웨어)** 

- Process(j)의 커널스택에 있는 레지스터를 CPU로 복구합니다.
- 유저모드로 변경합니다.

**(프로그램)**

Process(j)를 실행

### 인터럽트의 우선순위

**전원 이상(Power fail) > 기계 착오(Machine Check) > 외부 신호(External) > 입출력(I/O) > 명령어 잘못 > 프로그램 검사(Program Check) > SVC(SuperVisor Call)**

만약 우선순위가 낮은 인터럽트를 수행하는 중에 우선순위가 높은 인터럽트가 발생하면 우선적으로 처리한 뒤 다시 낮은 순위의 ISR로 돌아가 처리합니다. (재귀적 우선순위 처리) 

### 질문목록

Interrupt, Trap, Exception의 차이를 시스템 관점에서 

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture CH.4 Process Management](**[https://www.youtube.com/watch?v=jZuTw2tRT7w](https://www.youtube.com/watch?v=jZuTw2tRT7w) **)**

(sub reference)

[https://raisonde.tistory.com/entry/인터럽트Interrupt의-개념과-종류](https://raisonde.tistory.com/entry/%EC%9D%B8%ED%84%B0%EB%9F%BD%ED%8A%B8Interrupt%EC%9D%98-%EA%B0%9C%EB%85%90%EA%B3%BC-%EC%A2%85%EB%A5%98)

[https://justzino.tistory.com/4](https://justzino.tistory.com/4)

[https://wiki.osdev.org/Interrupt_Service_Routine](https://wiki.osdev.org/Interrupt_Service_Routine)

커널의 메모리구조 - [https://kariskan.tistory.com/52](https://kariskan.tistory.com/52)