---
layout: post
title:  "데이터베이스 인덱스"
date:   "2022-10-17"
category: database
---
이 글에서 소개하는 내용...
> 인덱스 개념, InnoDB의 인덱스 구성 및 성능, Clustered/Non-Clustered Index, 멀티인덱스
# 데이터베이스 인덱스 

데이터베이스에서 인덱스란, 자료에 빠르게 접근하기 위해서 존재하는 데이터베이스 자료구조입니다. Index는 한국말로 색인,목차라는 의미를 가지는데, 두거운 책에서 원하는 내용을 찾기 위해 목차를 찾는것과 비슷하게 동작합니다. 

Index는 원하는 자료를 빠르게 찾기 위해서 여러 방법으로 구현할 수 있지만, 가장 많이 사용되는 MySQL의 InnoDB 기준으로 설명해보도록 하겠습니다.

# Clustered Index

Clustered Index는, Primary Key에 주로 사용되며 실제 데이터가 정렬된 상태로 존재합니다. 어떤 칼럼을 Clustered Index Key로 지정하는 경우 하나의 키만이 Clustered Index Key로 지정될 수 있으며, 지정 시 모든 데이터를 정렬해야하므로 많은 시간이 필요합니다.

### 인덱스 구조
![Clustered Index drawio](https://user-images.githubusercontent.com/30853787/200777748-1cdb21e0-8f9d-4220-b542-583272432b22.png)

클러스터드 인덱스의 경우 인덱스 키값과 데이터페이지 주소가 저장되며, 두 번의 페이지 조회만에 데이터를 찾을 수 있습니다. 

# Non Clustered Index
InnoDB는 B+Tree 자료구조를 통해 인덱스 데이터를 관리합니다. B+Tree는 자식이 2개 이상인 m-ary 균형(Balanced) 트리입니다. 


* N개 데이터에 대한 조회에 O(Log(N))의 시간복잡도를 가집니다.  
이는 데이터가 일정수준 이상일 때, Full Scan 방식인 O(N)에 비해 월등히 빠른 속도입니다.
* 삽입,삭제는 인덱스 트리에 대한 수정과 더불어 , 불균형 있는 경우 Rebalancing과정까지 추가되어 인덱스를 적용하기 전보다 느려집니다.
이는 B+Tree가 깊이를 일정하게 하기 위한 rebalancing과정에서 소요되는 시간입니다.
* 인덱스 트리를 저장하기 위해 전체 데이터의 10%정도에 해당하는 추가 저장공간을 사용합니다.

### 인덱스 구조 
![Non Clustered Index drawio](https://user-images.githubusercontent.com/30853787/200777762-504433d0-48d2-4609-9bb4-a3f1a580f9ea.png)

트리의 루트 및 브랜치 노드에는 키값과 인덱스 페이지의 주소가 담겨있고, 인덱스 키값으로 정렬된 모습을 확인할 수 있습니다.  
트리의 리프 노드에는 키값과 데이터 페이지의 주소와 슬롯이 담겨있어 루트노드에서 리프노드까지 트리를 탐색하며 키에 해당하는 데이터를 가져올 수 있습니다.  
(*추가적으로, 부모/자식노드간 키가 중복으로 들어가며, 리프노드들이 링크드 리스트 형태로 연결되었다는 특징이 있습니다. InnoDB는 여기서 조금 더 발전해 같은 레벨의 노드들이 더블 링크드 리스트로 연결되어 있습니다.)*



## 페이지란? 
데이터베이스는 디스크에 페이지라는 단위로 데이터를 저장합니다. InnoDB에서는 16KB로 고정된 크기를 가지기 때문에, 인덱스를 구성하는 키가 커질수록 페이지에 저장할 수 있는 키가 적어지고, B+Tree의 깊이가 깊어져 성능 저하를 가져오게 됩니다.

극단적으로 말했을 때, 페이지 주소가 12Byte이고 Varchar(1024)인 1KB 사이즈의 게시글 내용을 인덱스 키로 지정한다면,  
한 페이지에 (16 * 1024) / (12 + 1024) = 15.xx로, 15개의 키밖에 저장할 수 없습니다. 


# Reference

[위키피디아 https://en.wikipedia.org/wiki/Database_index](https://en.wikipedia.org/wiki/Database_index#Index_concurrency_control)

[향로님 블로그](https://jojoldu.tistory.com/m/243)

[인파님 블로그, 인덱스 총정리](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%EC%9D%B8%EB%8D%B1%EC%8A%A4index-%ED%95%B5%EC%8B%AC-%EC%84%A4%EA%B3%84-%EC%82%AC%EC%9A%A9-%EB%AC%B8%EB%B2%95-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC#B-Tree_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)