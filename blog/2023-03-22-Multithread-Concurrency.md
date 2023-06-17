---
layout: post
title:  "운영체제 멀티스레드와 동시성 문제"
date:   "2023-03-22"
category: "tech"
tags: ["운영체제",”운영체제 스터디”]
---

# Thread와 동작원리

<img width="768" alt="멀티스레드/프로세스 메모리 구조" src="https://github.com/lee95292/lee95292.github.io/assets/30853787/72ccb320-559b-4d78-8c05-766cbd01904c">

<이미지 출처 [https://github.com/remzi-arpacidusseau/ostep-translations/tree/master/korean](https://github.com/remzi-arpacidusseau/ostep-translations/tree/master/korean) > 

Thread는 Process 내에서 분기하는 또 다른 실행 흐름입니다.

**주소공간**

멀티스레드 환경에서 프로세스의 주소공간은, 스레드의 개수만큼 스택 공간이 필요합니다. 이를 **Thread-local**, 또는 **Thread-stack**이라고 합니다.

멀티스레드 모델에서 주소공간 배치의 안정성이 떨어졌지만, 일반적으로 Thread-local공간은 크기가 매우 작으므로, 주소 침범으로 인한 문제가 발생하는 경우는 거의 없습니다. (Recursion을 과도하게 많이 사용할 경우를 대비해 Recursion Limit을 설정합니다. )

**문맥교환(Context Switch)**

PC(Program Counter)가 프로세스별로 한 개였던 단일 스레드 기반 동작과 달리, 멀티스레드 방식에서는 각 스레드마다 PC를 가지고있습니다. PC레지스터 뿐만 아니라 실행시 스레드의 정보를 담고있는 다양한 레지스터를 TCB(Thread Control Block)에 저장합니다. 이는 PCB와 마찬가지로 커널 메모리영역에 저장됩니다. 

스레드간의 문맥 교환은 TCB 에 있는 데이터를 CPU 레지스터로 로드하면서 시작됩니다. TCB를 독자적으로 가졌던것과 달리, 주소공간은 공유하므로 Page Table은 그대로 사용합니다. 

**멀티스레드의** **장점** 

---

**응답성** 측면에서는 병렬실행을 통한 장점을 가져올 수 있습니다. 일부 스레드가 I/O작업을 처리할때 다른 스레드가 사용자 요청을 처리합니다.  

**캐시친화적** 측면에서는 가장 큰 공간을 차지하는 힙 영역을 공유하므로, 캐시 히트 확률이 올라갑니다. 

**자원 활용율** 측면에서, 멀티프로세서(CPU)로 구동 시 프로세서 활용률이 높아집니다. 

## 멀티스레드의 동시성 관리

앞서 살펴본것처럼 멀티 스레드는 성능측면에서 많은 장점이 있습니다. 높은 성능을 가져오는 주된 이유는 “자원 공유”이지만, 자원을 공유해 사용할때는 **동시성 문제**에 대한 관리를 적절히 해주어야 합니다.

**동시성 문제란?**

스레드는 **비동기적**으로 동작합니다. 이들은 다른 스레드의 동작과 무관하게 동작하고, 다른 스레드가 어떤 자원을 변경하는지 모릅니다. 

그렇기에 경쟁상태(race condition)에 있는 스레드들의 실행 결과는 **비결정적**입니다. Timer Interrupt로 인해 프로그램 입장에서 랜덤한 시간에 발생하는 스케쥴링 때문입니다. 

**경쟁상태의 스레드들이 비결정적으로 동작하는 예시**

간단하게 설명하자면, A,B 스레드가 money값(100)을 읽어(Read) 200을 더하고(Add) 저장하는(Save) 과정을 수행한다고 합시다. 여기에서 동작하는 Read, Add, Save과정은 일괄적으로 처리되지 않습니다. 

앞서 설명했듯, 스레드의 동작과는 상관없이 동작하는 Scheduling으로 인해 Atomic하지 않습니다. 아래와 같이 동작할 수도 있습니다.

→ A스레드의 Read(100), Add(300),

**→ A에서 B스레드로 Context Switch(Scheduled)** 

→ B스레드의 Read(100), Add(300), Save(400)

**→ B에서 A스레드로 Context Switch(Scheduled)**

→ A 스레드의 Save(400)

위 과정에서 A,B 두 스레드가 100인 money값을 각각 300씩 더해주었지만, 저장된 값은 400으로, **스케줄링 타이밍에 따라 공유자원인 money를 수정하는 스레드의 동작을 예측할 수 없습니다.**

이를 동시성이 보장되지 않은 상태라고 합니다. 

**동시성을 보장하는 방법**

아래 조건을 만족하면 동시성이 보장되었다고 합니다. 

1. **상호배제(Mutual Exclusion): 임계구역에는 단 하나의 실행흐름만이 동작할 수 있다.**
    
    임계구역이란, 공유자원을 수정하는 코드 영역을 일컫습니다. 상호배제는 동시성 프로그래밍의 가장 기본조건으로, 임계구역에서 공유자원을 수정하는 스레드는 하나여야함을 말합니다.
    
2. **진행(Progress): 임계구역에 존재하는 실행흐름만이 임계구역으로의 접근을 막을 수 있다.**  
    
    에를 들어, 임계구역에 아무 프로세스도 존재하지 않는데 진입하지 못하는 경우가 있을 수 있습니다. 
    
3. **한정대기(Bounded Waiting, for Fairness) : 임계구역에 접근하기 위해 대기하는 시간은 한정적이어야 한다.**  
    
    다른 스레드의 임계구역 접근때문에 무한히 대기하는 스레드가 생길 수 있습니다. 
    

동시성 프로그래밍의 구체적인 에시를 살펴보겠습니다. 

### 변수를 통한 동시성 보장 방법

Thread-safe하게 동작하는것은 굉장히 복잡합니다. 아래 예시들을 통해 동시성이 보장된것같지만 그렇지 않은 예시들을 살펴보겠습니다. 

1. turn을 통한 할당

```c
# [Thread 0]
while turn = 1: repeat
//critical section //
turn = 1

# [Thread 1]
while turn = 0: repeat
//critical section //
turn = 0
```

**Progress조건을 위배합니다**. 하나의 스레드가 두 번 임계영역에 접근하고자 할 때, 임계구역에 어떤 스레드도 없지만 진입할 수 없습니다.

1. flag를 통한 할당

```c
# [Thread 0]
flag[0] = True
while flag[1] = True: repeat
//critical section //
flag[0] = False

# [Thread 1]
flag[1] = True
while flag[0] = True: repeat
//critical section //
flag[1] = False
```

(여기부터 스케쥴링이 등장)

**한정대기 조건을 위배**합니다. flag[x] = True 이후 **preemption**된다면, 두 스레드 모두 flag를 할당받기 때문에, 무한대기 상태에 빠집니다.

```c
# [Thread 0]
while flag[1] = True: repaet
flag[0] = True
//critical section //
flag[0] = False

# [Thread 1]
while flag[0] = True: repaet
flag[1] = True
//critical section //
flag[1] = False
```

이를 방지하기 위해 flag[x]=True구문을 while구문 아래에 넣게 된다면, while구문 이후에 preemption되었을 때,  두 스레드 모두 임계구역에 들어올 수 있어 **상호배제 조건을 위배합니다.** 

# 동시성 문제의 해결방법: HW support

1. Dekker’s, Dijkstra’s 알고리즘 등 앞선 SW 해결 방식에서는 preemption으로 인해 동시성 보장이 확실시되지 않으며, 
2. Spin Lock(Busy Waitting)기반으로 자원 점유를 기다리기때문에 효율성 측면에서 오버헤드가 발생합니다. 
3. 구현이 복잡합니다. 

이에 HW또는 OS측면에서 동시성 보장을 보장하기도 합니다. 

### TAS ( TestAndSet Instruction )

```c
boolean TestAndSet(boolean* lock){
	boolean old = *lock;
	*lock = true;
	return old;
}
```

TAS(Test And Set Instruction) CPU level에서 구현되어, 기계적으로 Atomic하게 수행하는것을 보장하는 명령집합입니다. 불특정 시간에 Preemption되는 상황에서도 상호배제가 지켜집니다!

```c
while(TAS(lock)): break
end while
'''
CRITICAL SECTION
'''
lock = false
```

**TAS를 통해 상호배제를 보장하는 방법**

TAS는 현재 값을 출력함과 동시에 Flag값을 True로 변경합니다.

lock 전역변수에는 False,True가 들어있으며, **False의경우 대기, True의 경우 점유**라는 의미를 갖습니다. 

스레드들 중, TAS가 수행되는 동안 lock변수가 True여서 점유할 수 있게 되면, TAS명령어는 Atomic하게 True를 리턴함과 동시에 전역 Lock변수를 False로 바꿔줍니다. 

TAS명령은 Interrupt를 받지 않아 선정당하지 않고 Atomic하게 동작하고, 앞선 SW를 통한 해결방법보다 간단합니다. 

**TAS를 통한 동시성 제어의 제한점**

이 방법은 상호배제와 진행을 충족하지만, 여러 스레드에서 동작할 때 **공정성 측면의 한정대기는 지켜지지 않습니다.**

Lock을 요청한 순서가 고려되어있지 않기 때문에 특정 스레드가 Lock을 계속 획득하지 못해 응답시간이 지연되는 starvation이 발생하기 때문입니다. 

 또한 여러 개 스레드의 동시성을 제어하기 위해서는 추가적인 제어가 필요하며, Spin Lock기반이라는 점은 SW방법과 크게 다르지 않습니다. 

(++)

---

세마포어 방식에서 사용하는 Sleep Wakeup:
Sleep 상태에서 락에 블로킹당하면 Wait큐로 들어갔다가 Ready Queue로 가기때문에, 실행순서 보장 안됨

Yield의 경우, Ready Queue로 돌아가기때문에, 스케줄링 순서 보장 (공정한 스케줄링 보장)

스케줄링 효율성과 공정성에 대한 등가교환 존재

---

Thread throttling vs Thread pool

Thread throttling과 thread pool은 모두 다중 스레드 환경에서 효율적인 자원 관리를 위해 사용되는 기술입니다.

Thread throttling은 작업 수행에 필요한 리소스(보통은 CPU)를 효율적으로 활용하기 위해 작업의 실행을 지연시키는 것입니다. 예를 들어, 일정 시간 동안 특정 수의 작업만 허용하는 방식으로 스레드를 제어할 수 있습니다. 이렇게 하면 실행 중인 작업의 수가 일정하게 유지되므로 CPU 사용률이 향상되고 전체 시스템 성능이 향상될 수 있습니다.

Thread pool은 스레드를 사전에 생성하고 작업을 처리할 때마다 사용 가능한 스레드 중 하나를 선택하여 할당하는 것입니다. 이렇게 하면 작업 수행에 필요한 스레드 생성 및 삭제의 오버헤드를 줄일 수 있습니다. Thread pool은 일반적으로 대규모 애플리케이션에서 사용되며, 많은 양의 요청을 처리할 때 유용합니다.

따라서, Thread throttling은 실행중인 작업의 수를 제어하여 CPU 사용률을 조절하고 전체 시스템 성능을 향상시키는 반면, Thread pool은 스레드 생성 및 삭제 오버헤드를 줄이고 작업 처리를 더 효율적으로 처리할 수 있도록 돕습니다.

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture][(](https://www.youtube.com/watch?v=r1JVA7yOPAM&)**[https://www.youtube.com/watch?v=es3WGii_7mc&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN](https://www.youtube.com/playlist?list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN)**)**