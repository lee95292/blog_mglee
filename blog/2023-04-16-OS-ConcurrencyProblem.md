---
layout: post
title:  "OS 독자/저자문제와 생산자/소비자 문제 및 해결"
date:   "2023-04-16"
category: "tech"
tags: ["운영체제",”운영체제 스터디”]
---

이번 글에서는 앞서 공부한 세마포어를 바탕으로, 대표적으로 알려진 동시성 문제를 다룹니다. 세마포어에 대해서는 이전 글을 참고해주세요.

- Producer-Consumer Problem
- Reader-Writer Problem
- //Dinning Philosopher’s Problem

## Producer-Consumer 문제

**배경지식: Ring Buffer**

생산자 소비자 구조에서 자주 사용되는 Ring Buffer구조는 Circular Queue자료구조입니다. 이는 배열과 head, tail에 대한 포인터를 갖고, size를 통해 Ring buffer의 크기를 판별합니다. 

Modular연산을 통해 head, tail 포인터를 정의해 삽입/삭제 시 head/tail 포인터가 배열 범위 안에서 정의되도록 합니다. 

![Producer-Consumer drawio](https://github.com/lee95292/lee95292.github.io/assets/30853787/05f2b93f-4e6b-48bf-aebe-123595689104)


생상자-소비자 문제라고도 불립니다. 이는 컴퓨터와 프린터 관계로 보면 됩니다.

문서를 등록하는 컴퓨터와 프린터는 여러개입니다.

컴퓨터는 프린트해야하는 문서들을 작업 큐에 등록합니다(Produce)

프린터는 작업 큐에 올라온 문서를 차례로 프린트합니다. (Consume)

생산자-소비자 문제는 일반적인 공유변수에서의 동기화 문제와는 달리, 데이터의 삽입/인출부분이 정해져있다는 차이점이 있습니다.

- 그렇기에, Producer가 데이터를 삽입할 때 Consumer가 데이터를 인출하는 작업은 경쟁상태가 발생하지 않습니다.(다른 위치이므로)
- 하지만 데이터가 가득 찼거나, 텅 비었을 때는 head/tail 포인터의 위치가 같습니다. 이를 고려해야 합니다.
- 여전히 Producer끼리, Consumer끼리는 상호배제가 지켜저야 합니다.

이를 바탕으로 Consumer와 Producer 코드를 작성해보겠습니다. 

**세마포어 변수**

MutexP [0,1]: Binary Semaphore로, 프로듀서간 공유자원 상호배제를 달성합니다.

MutexC [0,1]: 마찬가지로, 컨슈머간 상호배제를 달성합니다. 

NEmpty  [0 ~ N] : 링버퍼가 비어있는지에 대한 세마포어입니다.  // P(NEmpty)비어있으면 Blocking

NFull [N ~ 0]: 링버퍼가 가득 차있는지에 대한 세마포어입니다.

```c
// Producer's Code
// repeat this code
P(MutexP) // 2개 이상의 Producer 접근 금지, Producer간 상호배제 달성
P(NFull)  // 데이터가 가득 찬 경우, NFull==0이므로, Blocking
[Data Produce]
V(NEmpty)
V(MutexP)
```

```c
// Consumer's Code
// repeat this code
P(MutexC) // 2개 이상의 Consumer 접근금지, Consumer간 상호배제 달성
P(NEmpty) // 데이터가 없는 경우, NEmpty ==0이르모, Blocking
[Data Consume]
V(NFull)
V(MutexC)
```

위 예시를 살펴보면, head,tail이 겹치는 부분에서 Producer와 Consumer의 실행이 동시에 일어나지 않습니다. 

- 링버퍼에 데이터가 가득 찬 경우 : Consumer만 접근 가능
- 링버퍼가 텅 빈 경우: Producer만 접근 가능

이는 underflow, overflow를 막기 위함도 있지만, 단순히 if문을 사용하지 않고 세마포어 변수를 통해 동시 실행을 제어했으므로, 경쟁상태가 발생하지 않습니다.

(만약, 공유변수인 데이터 개수를 세마포어로 통제하지 않고, 데이터개수가 0일 때 발생하는 문제점을 생각해보면 좋습니다.)

## Reader-Writer문제

Reader-Writer문제는 읽기만 담당하는 스레드와 쓰기만 담당하는 스레드가 나뉜 상황입니다. (이하 Reader, Writer)

Reader-Reader관계에는 상호배제가 필요하지 않지만,  Writer-Writer또는 Reader-Writer간에는 상호배제가 필요합니다. 

**우선권 문제**

만약, Reader가 끊임없이 생성되어 Writer 스레드가 작업할 수 없다면 어떻게될까요? 또는, Writer가 계속 생성되어 Reader가 생성되는 경우도 마찬가지입니다.  이에 Reader,Writer에 대해 우선순위를 주도록 구현할 수 있습니다. 

**Reader Preference Solution**

Reader 스레드 수가 0일때만 Writer가 세마포어를 획득할 수 있음, Writer는 1개의 스레드만 실행할 수 있다.

일반변수: 

- readCount: 읽기스레드의 개수입니다. 만약 1→0이 되면 쓰기 스레드가 접근할 수 있도록 바꿔주고, 0→1이되면 쓰기 스레드를 사용할 수 없도록 잠궈줍니다.

세마포어:

- wMutex [1, 0] : 쓰기 스레드가 1개까지 동작할 수 있습니다.
- rsync [1, 0]: 읽기 스레드가 readCount를 수정합니다.

```c
# Reader's Code
P(rsync)        # 읽기 스레드 카운트를 증가하고, 1이라면 wMutex -> 0
readCount+=1
if readCount == 1:
	P(wMutex)
V(rsync)

[Read Data].    # Reader는 별도의 Mutex 필요없이 여러 스레드가 실행되어도 된다.

P(rsync)        # 읽기 스레드 카운트를 줄이고, 0이라면 wMutex-> 1
readCount-=1
if readCount == 0:
	V(wMutex)
V(rsync)
```

```c
# Writer's Code
P(wMutex)

[Write Data]

V(wMutex)
```

위같이 세마포어를 활용해 독자-저자 문제를 해결할 수 있습니다. readCount와 wMutex를 수정하는 작업만 배타적으로 실행되면 됩니다. 

하지만 Reader가 계속해 추가된다면 Writer가 Starvation에 빠져, 실행될 수 없다는 문제점이 있습니다. 

이외에도 Writer를 우선하는 방법과 공평하게 분배하는 알고리즘이 있습니다.

[https://en.wikipedia.org/wiki/Readers–writers_problem](https://en.wikipedia.org/wiki/Readers%E2%80%93writers_problem)

### Reference

[https://www.youtube.com/watch?v=CitsUz-Dx7A&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN&index=16](https://www.youtube.com/watch?v=CitsUz-Dx7A&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN&index=16)