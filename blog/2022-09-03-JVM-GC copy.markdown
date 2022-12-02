---
date: "2022-09-23"
title: "JVM의 Garbage Collector 동작방법"
category: computer science
tags: ['java', 'jvm','garbage collector']
banner: "/assets/bg/3.jpg"
---

운영체제 Heap 메모리 영역에 접근해 **사용하지 않는 Object를 정리**해주는 JVM의 구성요소입니다. 개발자가 직접적으로 메모리 해제를 C/C++과 달리, JVM에서는 GC를 제공해 개발에만 집중하고, Memory Leak을 신경쓰지 않아도 됩니다. 

> (JVM은 아래 4가지 구성요소로 이뤄져있다)
* 자바 인터프리터(interpreter)  
* 클래스 로더(class loader)  
* JIT 컴파일러(Just-In Time compiler)  
* **가비지 컬렉터(garbage collector)**  (오늘 알아볼 내용)



# GC의 동작 과정 

대부분의 객체는 생성되고 얼마되지 않아 Unreachable Object가 됩니다. JVM에서 Heap에 Object를 적재할 때, 생성시기와 생존기간을 고려해 크게 **Young Generation, Old Generation**으로 구역을 나누어, GC를 위한 데이터 접근을 효율적으로 수행합니다.

> Unreachable Object: 메서드가 종료되거나 참조가 사라져 사용할 수 없는 객체.

 또한, JVM을 설계할 때, 객체는 금방 Unreachable 상태가 된다는 것을 가정하고 시작하므로 Young Geneartion 영역이 Old Generation 영역보다 작고, GC도 더 자주 수행됩니다. 

YG,OG영역에서 수행되는 GC를 각각 Minor GC, Major GC 라고 하며 수행방법또한 차이가 있지만, 모두 **Stop-the-world, Mark&Sweep동작**이 기본이 됩니다.

### **Stop the world**동작은
---
**Stop the world**동작은 GC를 수행하는 스레드를 제외한 모든 스레드를 중지하면서 GC과정을 Thread-safe하게 수행하도록 하는 과정입니다.

### **Mark & Sweep**동작은 
---
**Mark & Sweep**동작은, 전역변수와 현재 scope의 로컬 변수를 루트로 시작해 참조하고 있는 Object를 탐색하며 mark bit를 true로 변경해줍니다.

이후 Mark되지 않은 Object(회색부분)를 삭제해주며, GC과정을 수행합니다.  

![GC drawio (6)](https://user-images.githubusercontent.com/30853787/192480693-1eaf6928-40bb-43e1-8d12-a7159829dd2e.png)


* 이 때, 메모리에서 데이터가 부분적으로 존재하는 파편화 문제가 발생하며, Compaction 알고리즘을 통해 이를 해결합니다. 

 

 

## Young Generation과 Minor GC
---

Young Generation(YG)영역의 경우, 처음 생성한 객체를 저장하는 Eden영역과, Eden영역에서 살아남은 객체가 저장되는 Survival영역이 두 개 존재합니다. 
동적으로 할당된 메모리 영역(Heap)에서 **Unreachable Object를** 찾아 삭제하는 역할 수행합니다.


### 기본 프로세스

1. 새로 생성된 객체들이 YG의 Eden영역에 할당되고, 곧 가득 찹니다.
![GC drawio](https://user-images.githubusercontent.com/30853787/192445234-d42612cd-6d71-4b67-bb1b-85ae5ef0c53b.png)
<br>

2. Eden영역이 가득 찼으면, Minor GC를 수행합니다. 그 결과 , Eden에서 살아남은 Object가 Survival1에 위치합니다. 이 때부터, Object는 Age라는 변수를 가지며, **자신의 생존 기간을 기록합니다.**  
![GC drawio (1)](https://user-images.githubusercontent.com/30853787/192445223-b080df35-f96d-41f3-8a7b-37b9e245949f.png)
<br>

3. 또 다시 Eden 영역이 가득 찼습니다. 이번에는 Eden영역과 Survival0영역에도 Object가 있으므로, 이에 대해 Minor GC를 수행합니다.  
![GC drawio (2)](https://user-images.githubusercontent.com/30853787/192445232-b81745cd-bdaf-40a6-b405-37715a2b69db.png)
<br>

4. Eden영역과 Survival0영역에서 살아남은 Object는 Survival1영역으로 이동합니다. 
Survival0,1 두 개의 영역은 서로의 역할을 번갈아가며 3번과 4번 과정이 여러번 반복됩니다. 이때, Eden영역에서 살아남은 Object는 Age값이 초기값이지만, Survival0(또는 1) 영역의 객체들은 살아남은 기간만큼의 Age값을 갖습니다.  

![GC drawio (4)](https://user-images.githubusercontent.com/30853787/192446180-d9496029-1f76-4dd2-95a0-82143bde39fe.png)

<!-- ![GC drawio (3)](https://user-images.githubusercontent.com/30853787/192445233-4de84416-ccba-45e6-9cab-0264da936c57.png) -->

<br>

5. Survival0(또는 1)영역에서, JVM에 설정된 Max age값에 도달한 객체가 있다면, Old Generation영역으로 이동합니다. 이를 Promotion이라고 합니다.
![GC drawio (5)](https://user-images.githubusercontent.com/30853787/192446711-9e79557e-c7b1-4fc0-a920-674e26812e44.png)


* 추가적으로, YGd에서의 MinorGC에서 Mark되지 않은 Object를 OG영역이 참조할 경우, OG영역이 YG영역을 참조할 때마다 카드 테이블에 정보를 기록해, OG에서 YG로의 참조를 기록합니다. 이를 통해 OG에서 참조하는 YG의 객체가 mark되지 않는 문제를 해결합니다.
## Old Generation에서의 GC
---

Old Generaion(OG)영역의 경우, YG영역에서 특정기간 이상 살아남은 객체들이 존재하는 영역입니다. 데이터가 가득 차면 GC를 수행하므로 그만큼 GC실행빈도는 적고, Stop the wolrd(STW)시간은 약 10배 이상 깁니다.

GC의 STW시간은 애플리케이션 실행 성능에 큰 영향을 미칩니다. STW를 줄이는것이 GC의 역사라고 해도 과언이 아닐 정도로, GC에서 중요한 지표로 사용됩니다.

여러가지 GC 알고리즘이 있지만, JDK8 이하 버전에서 사용된 SerialGC, ParallelGC JDK9이상 버전에서 사용중인 G1GC, JDK15에서 Production버전으로 준비되어 좋은 성능을 내고있는 ZGC에 대해서 Reference탭에 있는 링크를 통해 확인해주세요.


## Serial GC (-XX:+UseSerialGC)
---
YG영역에서는 앞부분 에서 설명한 GC를 그대로 수행하지만, OG 영역에서는 mark&sweep 이후 각 객체들이 연속되게 쌓이도록 Compaction 과정을 수행합니다. JDK 8버전 이하에서, 클라이언트 애플리케이션을 위한 GC 기본값으로 사용했습니다.


## Parallel GC (-XX:+UseParallelGC)
SerialGC와 기본 알고리즘은 같지만, GC를 처리하는 스레드의 수가 여러개라는 차이가 있습니다. JDK8버전 이하에서, 서버 애플리케이션을 위한 GC 기본값으로 사용됩니다. 



# Reference
[Naver D2,  Java Garbage Collection](https://d2.naver.com/helloworld/1329)

[[10분 테코톡] 👌던의 JVM의 Garbage Collector](https://www.youtube.com/watch?v=vZRmCbl871I&list=PLgXGHBqgT2TvpJ_p9L_yZKPifgdBOzdVH&index=219)

[Oracle ZGC](https://docs.oracle.com/en/java/javase/11/gctuning/z-garbage-collector1.html#GUID-A5A42691-095E-47BA-B6DC-FB4E5FAA43D0)

[Oracle G1GC Tuning](https://docs.oracle.com/en/java/javase/11/gctuning/garbage-first-garbage-collector-tuning.html#GUID-90E30ACA-8040-432E-B3A0-1E0440AB556A)

[코딩팩토리, [Java] 가비지 컬렉션(GC, Garbage Collection) 총정리](https://coding-factory.tistory.com/829) 

[고귀양이 노트, Mark & Sweep](https://nobilitycat.tistory.com/entry/Mark-and-Sweep)

[느리더라도 꾸준하게, [Java] G1 GC의 동작 과정](https://steady-coding.tistory.com/590)

