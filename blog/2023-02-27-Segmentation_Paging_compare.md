---
layout: post
title:  "세그멘테이션과 페이징 (+ 비교 )"
date:   "2023-02-27"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---

## 불연속 메모리 할당기법

**세그멘테이션, 페이징**은 대표적인 불연속 메모리 할당기법입니다. 각각 세그먼트, 페이지라는 단위로 프로그램을 나누고 페이지/세그먼트 테이블을 통해 가상/물리 메모리를 매핑, 연속적인 가상 주소공간을 사용할 수 있도록 합니다. 

### 특징 및 연속 할당기법과의 차이

![1](https://user-images.githubusercontent.com/30853787/226093229-eeb1540a-35fd-4f8c-905a-e454c845160a.png)

여전히 명령어는 가상주소를 기반으로 실행됩니다.  

**Segmentation**

프로그램을 의미있는 단위인 Heap, Stack, Code, Data등 프로그램을 구성하는 논리적 단위인 “세그먼트”로 분할해 메모리에 적재하는 방법입니다. 

**Paging**

프로세스를 고정된 크기(intel x86의 경우 4kb)의 page block으로 프로그램을 나눠 물리 메모리에 할당하는 방법

## 물리메모리 매핑 과정

**가상 주소 공간과 실제 메모리 주소의 매핑은 각각 페이지와 세그먼트 매핑 테이블 (PMT, SMT)가 담당합니다.**

### 페이징 기법에서 매핑과정: Direct Mapping

![2](https://user-images.githubusercontent.com/30853787/226093232-74c55ebc-45cb-4529-b1c9-5843031ed337.png)

**기본 가정**

32bit 컴퓨터로 가정합니다 → 하나의 명령이 처리할 수 있는 데이터 양(word)가 32bit, 한 워드에 최대로 표시할 수 있는 메모리 주소는 2^32 byte이므로 최대 메모리가 4GB 입니다.

이 때 페이지 크기를 설정해봅시다. 페이지 크기는 내부 단편화 및 로드 속도를 고려해 정하게 되는데, 윈도우 시스템에서는 4KB로 사용한다고 합니다. 

그렇다면 이론상으로는 4GB(2^32 Byte)의 메모리상에 4KB(2^12 Byte)의 페이지가  2^20개 존재할 수 있습니다. 

**(1) 명령어 실행**

그렇기에 명령어 32bit는 그림 우측 상단처럼 **20bit의 VPN과 12bit의 Offset**(페이지 내 데이터 위치)로 구분할 수 있습니다. 이를 각각 P,D라고 칭합니다.

**(2)PPN(Physical Page Number) 조회**

1에서 얻은 가상 페이지 주소(P)는 페이지 테이블의 행 번호입니다. 페이지 테이블에서는 VPN(가상페이지번호)을 통해 PPN(물리메모리 페이지번호)을 얻을 수 있습니다. 

**(3) 물리 메모리 주소 반환**

2과정에서 얻은 PPN(Z)과 1과정에서 얻은 페이지 내 변위 Offset(D)를 통해 물리 메모리 주소를 정확하게 알 수 있습니다 ( = Z + D ) 해당 주소의 명령은 CPU로 전달됩니다.

가상/물리 메모리에서 Page Number는 바뀌기때문에 PPN, VPN으로 구분하지만 **Offset은 Page 내에서 상대적인 위치이므로 물리메모리에서도 동일하게 사용할 수 있습니다.** 

**단점** 

Page Table은 프로세스별로 하나씩 가지고있으며 이는 **커널 메모리(PCB)에 존재**합니다.

**따라서 메모리 데이터를 얻기 위해 메모리를 2회 접근하는 오버헤드가 발생합니다.** 

### 페이징 기법에서 매핑과정: Associate Mapping  (TLB)

![3](https://user-images.githubusercontent.com/30853787/226093235-7d5b2f89-6936-467f-a74b-5162bdae3305.png)

출처 : [http://slideplayer.com/slide/5823226/](http://slideplayer.com/slide/5823226/)

CPU칩셋 내부에 고속 하드웨어 서포트가 추가됩니다. TLB (Translation Lookaside Buffer)는 Page Table과 비슷한 구조를 띠지만, CPU 내에 위치해 병렬적으로 테이블을 탐색해 VPN → PPN 전환 속도를 더욱 빠르게 해줍니다. 

### 페이징 기법에서 매핑과정: Hybrid (Small TLB)

TLB는 가격이 비싼 하드웨어이므로, 모든 페이지 테이블 정보를 담을만큼 충분한 크기를 가질 수 없습니다. 

시간 및 공간 지역성원리를 활용해, LRU로 교체되는 작은 TLB를 사용합니다. 

TLB 미스가 날 경우 TLB접근시간 + 메모리 접근 및 교체시간이 추가로 소요됩니다. 

### 세그먼테이션 기법에서 매핑 과정

![4](https://user-images.githubusercontent.com/30853787/226093237-af52f4d4-1353-4652-a3e6-f48cb6951695.png)

**페이징 방법과의 차이** 

페이징에서 방법과 많은 부분이 유사합니다. 그러나 의미 단위인 “세그먼트”로 메모리를 나누었으므로 가상주소에서 최상위 N개 비트를 세그먼트 번호로 사용하면 됩니다. 

또한 페이징에서는 페이지가 고정 크기이므로 PPN을 통해 메모리에 접근할 수 있었지만 물리 메모리에서 세그먼트는 시작주소가 일정하지 않습니다. 그러므로 시작 주소를 직접 가지고있고, 세그먼트 길이도 제각각이므로 세그먼트 테이블에서 관리해 허용되지 않는 영역에 접근하는지 체크합니다. 즉, **Offset이 세그먼트 길이보다 크면 Segmentation Fault를 발생시킵니다.** 

**세그먼트 크기**

스택,힙,데이터, 코드의 대표적인 세그먼트 분류로 나누게 되면 최상위 2개 비트만으로 프로세스의 모든 세그먼트를 표현할 수 있습니다. 이를 **대단위 세그먼트** 라고 합니다.

대단위 세그먼트에서는 외부 단편화 문제가 더 두드러지게 나타나고 세그먼트 로드 속도가 느리고 자주 사용되지 않는 데이터도 함께 로드되는 단점이 있습니다. 이를 위해 세그먼트를 더 세부적인 단위로 나누는 방법을 **소단위 세그먼트**라고 합니다. 

소단위 세그먼트는 프로세스당 세그먼트 수가 더 많으므로 세그먼트 테이블이 더 커진다는 단점이 있지만, 미사용 세그먼트를 구분해 메모리 사용률을 높일 수 있다는 장점이 있습니다. 

### 전반적인 비교 : Segmentation Vs Paging

세그멘테이션은 가변 길이의 세그먼트로 가상주소를 분리했으므로 외부 단편화가 발생할 수 있지만 논리 단위의 데이터 공유 및 보호가 용이합니다. 대단위 세그먼트로 분리하는 경우 메모리 사용률이 적어진다는 단점이 있지만, 소단위 세그먼트를 통해 극복할 수 있습니다. ( 세그먼트 테이블 크기와 Trade-Off )

페이징은 고정 크기의 페이지로 가상 주소를 분리했으므로 내부 단편화가 발생할 수 있고 보호/공유 측면에서 복잡성이 존재하지만, 메모리 사용률 측면에서 높은 성능을 보이며 페이지 테이블

## 매핑 테이블로 알아보는 페이지/세그먼트 변환

앞선 그림에서 확인한 세그먼트/페이지 매핑 테이블에는 주소 매핑을 위한 정보 말고도 각각을 설명하는 많은 정보를 담고있고 보호 및 효율을 위해 추가적인 동작을 합니다. 

**공통 구성요소**

- Present Bit : 물리메모리 상에 로드되어있는지 (Swap-in 여부, Swap Device에 존재할 경우 0 )
- Valid Bit : 스택 또는 힙의 미사용 공간은 invalid한 공간으로, 접근할 수 없음. 이를 마킹해 트랩을 통해 잘못된 영역으로의 접근을 막는다.
- Dirty Bit: 페이지/세그먼트가 메모리에 로드된 이후 변경되었는지 체킹해 이 비트가 세팅된 데이터는 주기적으로 메모리로 Flush작업을 한다.
- Protection Bit: 프로세스별로 해당 페이지에 RWX Access 권한을 마킹한 비트, 페이지 공유 및 보호를 가능하게 함.
- Swap Address: Swap device상에서 주소

**페이지 테이블  구성요소**

- PPN: 물리메모리 페이지 번호

**세그먼트 테이블 구성요소**

- Segment Address: 세그먼트 주소
- Segement Length: 세그먼트 크기

### 질문

세그멘테이션에서 가변 데이터인 스택, 힙에 대해 추가공간이 필요하면 어떻게할까?

→ 런타임에서 길이가 증가/감소, 추가적인 빈 공간 리스트에 할당

세그먼트 테이블은 프로세스별로 존재하는가?

→Yes

Valid bit가 Segmentation table 에서도 있는지 확인

### 

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture][(](https://www.youtube.com/watch?v=r1JVA7yOPAM&)**[https://www.youtube.com/watch?v=es3WGii_7mc&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN](https://www.youtube.com/playlist?list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN)**)**

[https://talkingaboutme.tistory.com/entry/Memory-Sample-Memory-System](https://talkingaboutme.tistory.com/entry/Memory-Sample-Memory-System)