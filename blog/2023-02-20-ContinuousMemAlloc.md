---
layout: post
title:  "연속메모리 할당과 주소 공간"
date:   "2023-02-20"
category: "tech"
tags: ["운영체제", "운영체제 스터디"]
---

프로세스에게 메모리를 할당해주는 방식의 발전과정과, CPU가 안전하게 메모리에 접근하기 위해 주소공간을 가상화하는 방법을 설명합니다. 

# 주소공간

![1](https://user-images.githubusercontent.com/30853787/226093193-30acf0ce-093c-41b6-aacd-b9b791c2ff85.png)

컴퓨터공학 수업들을 들으며 수없이 봐왔던 주소공간입니다. 

이는 프로세스 **하나가 실행될때 만들어지는 가상의 주소공간**이고, 프로그램 코드 영역에서는 **0을 기준**으로 주소를 참고합니다.  이같은 주소공간은 물리메모리상에 프로세스의 개수만큼 존재합니다. 

현대의 컴퓨터들은 메모리 영역을 가상화하기 위해 “주소공간”이라는 개념을 만들어 명령어를 실행할 때 명령어의 물리메모리상 실제 위치를 알고있지 않아도 되도록 구성했습니다. 

운영체제에서 프로세스를 실행할 때 **주소변환을 통한 가상화**로 다른 프로세스로부터 **보호와 고립**이 가능하도록 합니다. 

## 주소변환: base/limit 방법 (연속할당 방법에서 사용)

![2](https://user-images.githubusercontent.com/30853787/226093194-a99d68fe-1d74-4b80-b0c5-6dc4006860e4.png)

주소변환을 통해 명령어를 실행할 때 물리메모리 주소에 대해 생각하지 않아도 되는 메모리 가상화가 가능해집니다.

CPU는 base, limit레지스터를 가지고있어 **가상주소가 limit을 넘어갈 경우** 예외를 발생시켜 **프로세스를 보호**합니다. **base레지스터는 physical address로 접근 시 주소를 변환**하는데 사용합니다. 

또한 Context Switch시에는 base/limit을 PCB에서 불러와 갱신합니다. 

# 연속 메모리 할당 방법

연속 메모리할당 방법이란: 프로세스가 필요로 하는 데이터를 메모리에 연속적으로 할당하는 방식으로, 이후에 배울 발전된 방식인 “불연속 메모리 할당”과 대비되는 개념입니다. 

(관계 정리)

Continuous Memory Allocation: 연속 메모리 할당

- Uni Programming
- Multi Programming
    - Fixed Allocation: 고정 할당
    - Variable Allocation: 가변 할당

![3](https://user-images.githubusercontent.com/30853787/226093195-92e059e3-2461-4979-92c9-60e0ebfb77a2.png)

### Uni Programming

**Uni Programming**은 운영체제 개발 초기에 단일 사용자가 단일 프로그램을 사용하는 모델에서 개발된 할당방식입니다. 

하나의 PC에서 하나의 프로그램만 메모리를 할당받을 수 있었죠. 아래와 같은 문제점이 있습니다.

- CPU활용도 낮음
- 메모리 활용도 낮음(공간의 낭비가 큼)

### Multi Programming

Uni Programming은 위같은 문제점들과 다중 사용자 니즈에 맞춰 점차 사라졌습니다.

이후 여러 프로세스를 메모리에 할당할 수 있는 방법인 Multi Programming이 등장하고, CPU를 시분할 방식으로 사용해 다양한 프로세스를 동시에 사용하는것처럼 동작할 수 있게 되었습니다.

**Multi Programming: Fixed Allocation (고정 할당 방법)**

여러 프로세스가 사용할 수 있는 공간을 고정된 크기로 나누는 방법입니다. 

- **내부 단편화가 발생합니다**:  5kb만큼 필요한 프로세스가 있더라도 고정된 크기(예를 들어 10MB)를 할당받아, 파티션 내부에서 낭비하는공간이 발생합니다.
- 프로세스가 고정 파티션 크기보다 클 수 있습니다.

**Multi Programming: Variable Allocation (가변 할당 방법)**

프로세스가 사용할 공간을 프로세스의 크기에 맞춰 나누는 방법입니다.  프로세스가 시작할때, 종료할때 Allocation Table을 변경하면서 파티션을 관리합니다. 

**가변 할당 정책**에 따라 운영체제에서 관리하는 가용공간 리스트를 탐색해 메모리를 할당합니다.

Best-fit: 가용 공간을 탐색 후 프로세스가 필요한메모리와 가장 차이가 적은 파티션에 할당

First-fit: 메모리 크기만큼 할당할 수 있는 첫 파티션에 할당 

Worst-fit: 메모리 크기를 할당할 수 있는 가장 큰 파티션에 할당

속도: First > Best, Worst

공간효율: Best > First, Worst

Fixed Allocation의 문제점들을 다소 극복했지만 아직 문제점이 남아있습니다.

- **외부 단편화가 발생합니다:** 크기가 작은 프로세스가 종료해 메모리에서 해제되면 사용중인 파티션 사이에 사용하지 못하는 공간이 발생
- Allocation Table을 순회해야하는 오버헤드 발생

### 연속 메모리할당 방법의 문제점

앞서 설명한 여러 **연속 메모리 할당 방법들에는 공통적인 문제**가 남아있습니다. 

- 프로세스가 필요한 메모리를 시작하는 시점에 알 수 없음
- 프로세스가 새로 시작할 때 프로그램 데이터를 모두 디스크 → 메모리로 데이터를 옮겨야하는데, 이는 상당히 느린 방법
- 내/외부 단편화로 인한 메모리공간 낭비가 어떤 방식으로든 남아있음

이런 문제점들은 이후 페이징, 세그멘테이션을 공부하며 해결할 수 있습니다.

### Reference

[OSTEP: Operating Systems: Three Easy Pieces]([https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/))

[**HPC Lab. KOREATECH, OS Lecture][(](https://www.youtube.com/watch?v=r1JVA7yOPAM&)**[https://www.youtube.com/watch?v=es3WGii_7mc&list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN](https://www.youtube.com/playlist?list=PLBrGAFAIyf5rby7QylRc6JxU5lzQ9c4tN)**)**