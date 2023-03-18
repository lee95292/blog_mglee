---
layout: post
title:  "다양한 페이징 기법 [ Hybrid, Multi Level Paging]"
date:   "2023-03-08"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---

### 페이징 기법의 문제점

앞선 글에서 소개한 페이징 기법에서는 페이지의 크기를 4KB로 가정했습니다. 그러나 현대에는 메모리의 크기가 4GB를 넘어 64GB까지도 사용됩니다. 

이런 컴퓨터에서 4KB의 페이지를 사용한다면 페이지 개수가 10^6 ~ 10^7까지도 커지게 됩니다. 

페이지 테이블은 각 프로세스마다 가지는 자료구조이고, **“커널메모리”에 저장**되는 자료이다 보니, **페이지 테이블이 커지면 커질수록** **메모리 가용역역이 작아집니다.** 

또한, Segmentation에서는 해결된 메모리의 보호와 공유가 어렵다는 문제가 남아있습니다. 

### 페이지 테이블 크기 문제 해결방법

**(1) 더 큰 페이지 크기**

단순하게 생각하면 페이지 크기를 더 키우면 페이지 테이블 사이즈는 작아집니다.

이를 통해 **(1)디스크 접근횟수를 줄이고 (2)페이지 테이블크기를 줄이는** 효과를 얻을 수 있습니다.

메모리 크기가 커짐에 따라 페이지 사이즈를 키울수록 이 방법은 몇 가지 **단점**이 있습니다

1. 내부 단편화가 더 크게 발생합니다.
2. 큰 페이지를 로드했지만, 사용되는 비율이 적어 **메모리 사용률이 줄어듭니다**.

**(2) Multi Level Paging 방법**

![1](https://user-images.githubusercontent.com/30853787/226093248-29394fe1-480b-41af-8c30-ed6745922558.png)

Multi Level Paging기법에서는 페이지 디렉터리를 통해 하나의 레벨을 추가합니다. 

또한 페이지 디렉터리 테이블(PDT)에는 valid bit가 존재합니다. 앞선 페이징 방법에서는 Heap공간에서 사용중인 페이지를 valid bit로 판별했던 반면, **PDT에서의 valid bit는 PDE가 가르키는 페이지 테이블의 엔트리들 중 하나라도 유효한지에 대한 여부입니다(중요) → Heap 또는 Stack의 빈공간으로 인해 사용되는 메모리 낭비를 없애줌.**

**장단점**

페이징에서는 페이지 번호를 통해 페이지 테이블에 접근했으므로, 해당 페이지가 스왑 스페이스에 있어도 하나의 페이지  테이블을 가지고있어야 했습니다. 

**Multi Level Paging방법에서는 PDT의 valid bit가 1인 PMT에 대해서만 메모리 공간을 할당하므로 메모리 공간 효율성이 뛰어납니다.** 

그러나 Multi Level로 페이지 테이블이 존재하는 경우 가상주소 변환에 있어 메모리 접근을 N회 해야한다는 단점이 있습니다. (TLB로 완화할 수 있습니다)

이처럼 MultiLevel Paging에는 시간-공간 등가교환이 존재합니다. 

**(번외) Segmentation/Paging Hybrid 방법**

![2](https://user-images.githubusercontent.com/30853787/226093250-bb5c0f90-8f66-4cc1-8b47-ab1a13a3f84b.png)

Hybrid기법은 Segmentattion과 Paging기법을 혼합한 방법입니다. 

가상 메모리를 논리 단위의 세그먼트로 분할한 뒤, 이를 또 다시 페이지로 나눕니다.

그렇기에 (그림 우측 상단의)가상 메모리 주소는 세그먼트 비트, 가상 페이지 번호인 Virtual Page Number,와 페이지 내에서의 Offset으로 이루어져 있습니다. 

즉, (S,P,D)값을 통해 물리 메모리 주소를 얻는것인데요, 방법은 아래와 같습니다.

**1) 세그먼트 매핑 테이블 접근**

세그먼트별로 존재하는 SMT에서 S번째 엔트리를 찾아갑니다. 여기서는 **세그먼트 길이 검증, Protection Bit를 통해 자원의 공유와 보호를 수행**합니다. 

또한 세그먼트에 대한 페이징 정보를 가지고있는 페이지 테이블 주소를 MMU에 전달합니다. 

물리메모리에는 Page 단위로 올라가므로 Residence bit는 존재하지 않습니다.

**2) 페이지 매핑 테이블 접근**

SMT에서 얻은 S(j)의 PMT 주소와 가상 페이지 번호인 VPN을 통해 물리 메모리에서 페이지의 주소를 획득합니다. 

이 때 Residence bit를 확인해 페이지가 존재하는지 확인하고 존재하지 않는다면 Page Fault Trap을 발생시켜 페이지 교체 알고리즘을 수행합니다. 

**3) PFN 획득 및 메모리 접근**

PMT에서는 PFN을 얻었고, 여기에 페이지 크기를 곱하면 물리 메모리상 주소를 알 수 있습니다. 

Hybrid 기법은 페이징을 통해 메모리 사용률을 높혀준다는 장점과 세그멘테이션을 통해 보호와 공유를 용이하게 해준다는 장점이 있습니다. 

그러나 Hybrid방법에도 한계점은 존재합니다. 

1. 여전히 페이지 테이블 크기가 많은 메모리 공간을 차지한다는 단점과 
2. Direct Mapping의 경우 가상 메모리 변환 시, 3회의 메모리 접근이 필요하다는 점입니다.
    1. 이는 TLB 활용으로 극복 가능합니다. 

Fact Check 

- Protection Bit가 세그먼트에서 더 효율적인 이유
    
    → 횟수에따른 용이성일것으로 생각, paging에서는 다음주소 참조시에도 또 확인해야해서
    
- Page Directory Table에서 또는 Page Table에서 Valid bit가 0인경우 swap공간에 있기는 한지?
    - Multi Level Paging에서는 valid 가 0인 경우에 대해서 Page를 할당하지도 않는다! 따라서 swap공간에 있는게 아니라 사용하게되면 페이지를 다시 할당함.

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture][(](https://www.youtube.com/watch?v=r1JVA7yOPAM&)**[https://www.youtube.com/watch?v=es3WGii_7mc&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN](https://www.youtube.com/playlist?list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN)**)**