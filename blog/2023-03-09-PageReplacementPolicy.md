---
layout: post
title:  "페이지 교체와 정책 (Swap)"
date:   "2023-03-09"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---


물리메모리를 필요로 하는 프로세스가 N개 있다고 가정합시다.
N개의 프로세스는 각각 꽤 큰 크기의 물리메모리를 필요로 해서 프로세스들이 필요한 가상공간의 크기 총 합이 물리메모리의 크기보다 커지면 우리는 N개의 프로그램을 동시에 실행하지 못할 것입니다.

### Swap Space

이러한 물리메모리의 크기 한계를 극복하기 위해 HDD,SSD 등 보조기억장치를 임시 저장공간인 Swap Space로 사용합니다. 이런 Swap Space에는 자주 사용되지 않는 페이지가 위치합니다.  

물리메모리에서 자주 사용되지 않는 페이지가 Swap Space로 옮기는것을 Swap-out, 

반대로 Swap Space에 존재하는 페이지를 사용하기 위해 물리 메모리에 옮기는것을 Swap-in

이라고 합니다.

### 가상 메모리 지원을 위한 방법

이렇듯 스왑 공간까지 사용해 메모리를 더 큰것처럼 사용할 수 있도록 하는 방법을 가상 메모리(VIrtual Memory)라고 합니다. 

가상 메모리를 사용을 지원하기 위해서는 Swap-in 또는 Swap-out 시 참조할 **디스크상 페이지 주소**를 알고있어야 합니다. 두번째로는 **Present Bit**를 알고있어야 합니다. Present Bit는 페이지 테이블 상의 페이지가 실제 물리메모리에 적재되어있는지 여부를 나타내는 데이터입니다. 

**Present Bit가 1인 경우**

물리메모리에 데이터가 존재합니다. 이 경우 일반적인 페이징 방법처럼 PFN을 MMU로 전달해 CPU가 메모리에 접근 할 수 있습니다. 

**Present Bit가 0인 경우**

해당 페이지 엔트리는 물리메모리에 없고 Swap Space에 존재함을 의미합니다. 이를 **Page Fault**라고 합니다. 

이 때 MMU는 인터럽트(Page Fault Trap)을 발생시켜 Page Fault Handler를 동작하고 여기서 페이지 교체 작업이 발생합니다. 

Page Fault Handler는 Page Table Entry의 Present Bit를 1로 변경하고, 디스크 데이터를 물리메모리로 적재하는 I/O작업을 수행합니다. 

![1](https://user-images.githubusercontent.com/30853787/226093270-5092c56f-513e-4842-8bd9-320ed0dc6557.png)

앞서 Page Fault Handler를 통해 디스크에서 물리 메모리에 페이지를 적재한다고 했습니다. 그렇다면 위 그림을 보고 의문점이 생겨야 합니다. 

**Swap out을 언제 실행해야 하는가?** 

프로그램이 언제든 새로 시작될 수 있을 뿐만 아니라 운영체제는 특성상 항상 어느정도의 여유공간을 확보하고 있어야합니다. 이러한 운영체제 특성상 물리메모리가 가득 찼을 때만 Swap out을 하게되면 많은 문제점들이 발생합니다. 

이때문에 운영체제는 메모리 여유공간의 **최댓값(High watermark), 최솟값(Low watermark)**을 가지고있습니다. **여유공간이 최솟값보다 적어지면 여유공간의 크기가 최댓값보다 작을때까지 여유공간을 확보**합니다.  해당 스레드는 페이지 데몬(page daemon), 스왑 데몬(swap daemon)이라고 불리며, 충분한 여유공간이 확보될때까지 동작하다가 확보되면 백그라운드 스레드로 돌아갑니다. 

**Swap-out을 수행하는데, 어떤 페이지를 Swap Out 해야하는가** 

뒤이어 페이지 교체 정책에서 설명합니다.

## 페이지 교체 정책

페이지 교체 정책에 대해 이야기하기 전에 교체 정책의 성능을 측정하는 방법에 대해 알아보아야 합니다.

**AMAT(Average Memory Access Time): 평균 메모리 접근시간 = P(Hit) * T(M) + P(Miss) * T(D)**

설명하자면, 스왑공간을 사용하는 가상 메모리 시스템의 평균 메모리 접근시간은 아래와 같습니다. 

```
P(Hit): 캐시 히트 확률 * T(M): 메모리 접근 시간을 곱해준 값 +
P(Miss):페이지 폴트 확률과 T(D): 디스크 접근 시간
```

### 최적 교체 방식 (Optimal Replacement Policy)

최적 교체방식의 원리는 간단합니다. **“가장 나중에 참조할 페이지를 축출한다”** 입니다. 

최적 교체방식은 이상적인 방법이지만, 가장 나중에 참조할 페이지 찾기라는 **미래를 예측하는 불가능한 과정을 포함**합니다.

최적의 방법은 비교 기준으로만 사용되며, 비교하고자 하는 알고리즘이 정답에 얼마나 가까운지 알 수 있습니다. 

### LRU(Least Recently Used)

LRU방식은 과거 메모리 접근에 대한 정보를 사용합니다. 이름 그대로 **가장 먼 시점에 사용된 페이지를 교체합니다.** 

메모리 접근 정보 중에서 **최근성(recency)**를 사용한 방법입니다. 얼마나 최근에 접근했는지에 대한 정보를 가지고있습니다. 더 최근에 접근한 페이지일수록 가까운 시점에 다시 접근할 확률 이 높다는 특성인 **캐시 지역성의 원칙(Principle of locality)**이라는 특성에 기반을 둡니다. 

이처럼 메모리 접근 정보에는 빈도(frequency)도 있지만, MFU(Most Frequently Used)알고리즘은 캐시의 지역성 특징과 맞지 않으므로 효율적으로 동작하지 않습니다. 

예를들어 100번째 페이지를 5000회 접근한 이후 한번도 접근하지 않는다면 빈도수는 높아서 계속 물리메모리에 남아있지만 사용되지는 않습니다. 

LRU는 메모리 교체 방식중 효율이 가장 좋은 방법으로, 주로 사용되는 페이지 교체 알고리즘입니다. 

### 간단한 방식들( FIFO, Random Select)

**First In First Out : 선입선출**

먼저 들어온것이 먼저 나갑니다. 매우 간단한 알고리즘이지만 성능이 떨어집니다. 

**Ramdom Select: 무작위 선택**

무작위로 Swap out될 페이지를 선택합니다. 해당 방법은 그때마다 수행 결과가 달라집니다. 

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture][(](https://www.youtube.com/watch?v=r1JVA7yOPAM&)**[https://www.youtube.com/watch?v=es3WGii_7mc&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN](https://www.youtube.com/playlist?list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN)**)**