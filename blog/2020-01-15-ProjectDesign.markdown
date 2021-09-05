---
layout: post
title: "ProjectDesign"
date: "2020-01-15"
category:
---

# Project Beta 화면 및 구현설계

## 기능개요

> 키워드 등록을 통한 타겟 알림 시스템 (ElasticSearch 활용)

> 등록한 키워드와 관심분야 설정을 통한 문서 추천 시스템 ( [Collaborative Filtering](https://yeomko.tistory.com/6?category=805638)활용 )

---

### 1. 키워드 등록을 통한 타겟 알림 시스템

크롤링 시나리오

- 크롤링할 호스트에 대한 설정파일 참조
- graph,linked list 형식으로 링크 관계 저장 / 리스트에 존재하는 문서 크롤링
  - 1 Search Process : 그래프 refresh를 통해 새로운 문서가 있는지 판별
  - 2-1. 새로운 문서가 있다면 문서의 메타정보를 그래프에 저장
  - 2-2. 문서의 Topic판별, 단어 추출 등, Elastic에 저장하기 위한 구성 설정

* Elastic 쿼리 전송

키워드 등록 시나리오

- 여러개의 호스트에 여러개의 키워드 등록 가능하도록 설정
  - Create: 여러개의 키워드를 한번에 요청한경우 어근 추출을 통해 압축 (만들기,만들어 ->만들다)
