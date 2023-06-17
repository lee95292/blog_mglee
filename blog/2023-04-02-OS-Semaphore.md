---
layout: post
title:  "운영체제 세마포어 원리"
date:   "2023-04-02"
category: "tech"
tags: ["운영체제",”운영체제 스터디”]
---

앞서 TAS를 통한 Atomic한 락 설정 방법을 공부했습니다. Atomic한 락 설정을 통해 Preemption으로 인한 이상현상 없이 임계구역을 보호하기 위해 운영체제는 몇가지 방법들을 사용합니다.

# 세마포어

세마포어란, 다익스트라가 제안한 알고리즘으로, Busy Waiting으로 인한 성능저하 문제를 해결합니다.

**기본적인 동작방법**

1. 세마포어는 세마포어변수 S와 P,V연산으로 이뤄집니다. 
    1. 세마포어 변수인 S변수는 공유자원에 접근할 수 있는 자원의 개수를 의미합니다.
    2. P연산은 임계구역에 접근하기 전 진입가능한지를 검사하며, 가능하지 않다면 Wait Queue에 들어갑니다.
    3. V연산은 임계구역에서 나올 때 사용합니다. S변수를 원복하고, Wait Queue에서 임계구역으로 진입하려는 프로세스를 깨웁니다.
2. 각 P,V연산은 하나의 instruction cycle에서 수행되어 Interrupt로 인해 끊기지 않습니다. (이를 Indivisable, 또는 Atomic하다고 합니다.)

```c
Init(initS){
	S = initS
}

P(){
if S > 0:
	S-=1
else:
	sleep()
}

V(){
	if Waiting Process in Queue:
		wakeup() # 다른 프로세스가 임계구역으로 접근하므로, S변수는 그대로!
	else:
		S+=1
}

Action(){
	P()
	//Critical Section
	V()
}
```

**세마포어의 특징: 임계구역 제한방식의 차이**

Busy Waiting와과 Sleep-Wakeup을 통한 임계구역 제한에는 분명한 차이가 있습니다. 

프로세스와 상태변화([https://blog.mglee.dev/blog/프로세스의-개념과-상태-변화/](https://blog.mglee.dev/blog/%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4%EC%9D%98-%EA%B0%9C%EB%85%90%EA%B3%BC-%EC%83%81%ED%83%9C-%EB%B3%80%ED%99%94/) 참고)에 대해 이해하고 있어야합니다.

![1](https://github.com/lee95292/lee95292.github.io/assets/30853787/65ab6312-f58f-4a4b-b8ed-7d49180d44d0)


Semaphore의 **Sleep-Wakeup에서는 블로킹된 프로세스는 CPU를 잡아먹지 않습니다.** 

- Sleep을 하면 프로세스의 상태가 Running → Asleep(이하 Waiting)상태가 됩니다.
- Wakeup동작은 프로세스 상태를 Waiting → Ready로 바꿔줍니다. (But, 이 과정은 순서를 보장하지 않아, 공정성 문제가 발생합니다)

**Spin Lock 방식은 블로킹된 프로세스가 CPU를 점유하며 아무동작도 하지 않습니다.** 

- 블로킹된 프로세스는 Ready ↔ Running상태를 오가며 락을 획득할때까지 기다립니다.

**Busy Waiting Vs Sleep Wakeup ?** 

Sleep Wakeup 방법에서는 락을 획득하지 못해 대기하는 스레드가 Running state로 들어가는 일이 없으므로, Blocking으로 인한 CPU IDLE상태가 되지 않습니다. 따라서 **일반적으로 성능이 더 좋은 Sleep-Wakeup방식을 사용합니다.** 

**이진 세마포어와 카운팅 세마포어**

세마포어에는 이진 세마포어, 카운팅 세마포어로 나뉩니다. 

**이진 세마포어는** 세마포어변수가 1이므로, 하나의 스레드만 임계구역에 접근할 수 있어 임계구역에 대한 상호배제를 지켜주기 때문에, Mutex라고도 불립니다. (Mutual Exclusion의 약자)

**카운팅 세마포어는** S(>1)개의 스레드가 임계구역에 접근할 수 있습니다. 카운팅 세마포어는 그 자체만으로 상호배제를 달성하지는 못합니다. 그러나 카운팅 세마포어를 적절히 사용하면 운영체제에서 발생하는 여러 동시성 문제를 해결할 수 있습니다. (Producer/Consumer 문제, 식사하는 철학자 문제 등)

### 세마포어: Summay

- 세마포어는 Busy Waiting으로 인한 성능 저하를 해결한 동시성 제어 방법입니다.
- P를 통해 세마포어변수 S(S>0)를 줄여 락을 획득,임계구역으로 접근하고
- V를 통해 S를 증가, 락을 반납하고 Wait상태의 스레드를 깨워주고 임계구역에서 나갑니다.
- S==0일 때, 임계구역에 진입할 수 없어  Blocking된 스레드는 Wait상태에 접어들고, 다른 스레드의 V연산을 통해 Wakeup 합니다.
- Counting Semapore는 세마포어변수가 1보다 커, 많은 스레드가 접근할 수 있고, S를 접근가능한 스레드 수로 정의했을 때, 상호배제가 지켜지지 않습니다. 하지만 아래와 같이 다양한 용도로 사용할 수 있습니다.
    - 이는 실행하는 스레드 수를 제한하는 Thread Throttling에 사용됩니다.  세마포어 변수를 통해 S개를 초과하는 스레드에 대해 Blocking해주면, 자주 사용되는 페이지 집합이 메모리 크기를 초과해 발생하는 Thrashing을 방지할수도 있고, 과도한 Context Switch로 인한 캐시 미스도 방지할 수 있습니다.
    - 다음 글에서 소개할 Producer/Consumer 문제에서 Buffer의 사용량을 체크하는 용도로 사용되기도 합니다.