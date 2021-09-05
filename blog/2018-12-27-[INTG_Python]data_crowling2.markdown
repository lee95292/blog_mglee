---
layout: post
title: "[INTG Project] 웹 데이터 크롤링 총정리(셀레니움, requests,bs4)"
date: "2018-12-26"
category: intg
---

>웹 크롤링 및 데이터분석 자동화에 관한 함수들을 나열해놓은 포스팅입니다.

>기록용이므로, 참고에 불편하실 수 있습니다. 

>선수지식 : HTML/CSS ,python, HTTP 





<br><br>

# 1. requests 모듈 기초
---
<br>
```python
import requests

#get 대신 post를 사용할 수 있으며, 두 번째 인자부터 parameter를 지정할 수 있다.
r = requests.get('https://www.naver.com',headers=[])  

# html 메시지의 상태코드 e.g 200 OK, 404NotFound 등
print(r.status_code)    

# 헤더를 딕셔너리로 받아옴.
print(r.headers['content-type']) 

print(r.text)      #html 코드를 텍스트로 받아옴

#응답내용을 출력. 가끔 상태코드 416과 함께오류를 발생. 보안상 문제인것으로 추측됨.
# 416코드 : 서비스범위를 벗어난 요청일 경우의 상태코드.
print(r.content)   
```
<br><br>

# 2. Selenium 모듈 기초
---

[크롬 웹드라이버](https://sites.google.com/a/chromium.org/chromedriver/)를 통해 진행합니다.

저같은 경우는, 최신버전에서 오류가 발생해 2.31버전으로 진행하였습니다.

```python
from selenium import webdriver
import time

#크롬 드라이버 위치 참조.
driver = webdriver.Chrome("Driver:\\Local_Position\\chromDriver\\chromedriver.exe")
driver.get('https:/kin.naver.com/index.nhn')     
a= driver.find_element_by_xpath('//*[@id="main_content"]/div[2]/div[1]/div/div[2]/div[2]/div[2]/div[1]/a/span[2]')

print(a.text)
time.sleep(10)
driver.quit()

```

<br><br>
# 3. Beautiful Soup, bs4 기초
---
<br><br>
네이버 홈페이지 **Atag 요소**들을 50개 출력해줍니다.
```python
from bs4 import BeautifulSoup
import requests

url='https://www.naver.com'
resp = requests.get(url)

#html파일을 직접 열거나, reqests 모듈에서 얻은 html 코드를 인자값으로 넣는다. 
soup = BeautifulSoup(resp.text,'html.parser')

# 태그 이름을 기준으로 모든 문서의 해당 태그 리스트 데이터를 리턴한다.
anchors = soup.find_all('a')
i=0

#네이버의 a태그 텍스트를 모두 출력해주기
for anchor in anchors:
    print(anchor.text)
    print('')
    i+=1
    if i >50 :
        break

```


## 합법성과 윤리

---

<div style="text-align:right">출처 - 라이언 미첼_ web crawling with pyhton</div>

**저작권**

*** 저작권 관련 법조항은, 엔지니어가 아니라 법률가와 상담하라고 명시하고 있다. 

(참고용으로만 쓰도록 하자!)

&COPY;(저작권) TM(상표, 또는 , &reg;) 마크는 지적 재산권을 의미하는 마크이다. 

이와 더부어 "상표"와 같은 마크, 브랜딩 이미지(심지어는 의미를 가진 색깔까지) 지적 재산권의 범위는 넓다.

* 특허권 침해하기는 쉽지 않다! 특허에 포함되는 것은 그 기술을 구현하는 개념이고, 크롤링은 그에 해당하는 텍스트이기 때문이다. 

* 이에반해, 상표권은 문맥에 따라 크게 달라질 수 있다! 크롤링한 결과 내용을 다른 이미지에 붙여서 사용하거나, 창작물인것 처럼 하는 경우가 해당한다.

* 저작권법은, 이미지, 텍스트, 음악 등에, 자신이 창작한것은 즉시, 자동으로 저작권법의 대상이 된다.
 - 저작물에 대한 직접적인 인용은 저작권법에 위배될 수 있지만, 특정 단어 사용횟수, 문단 수 측정 등의 통계적인 내용은 위배되지 않는다고 한다.

 **robots.txt**

 모든 대형 웹사이트가 루트경로 바로 옆에 robots.txt경로를 가지고 있다. (naver.com/robots.txt)

이는, De facto standard(사실상 표준) 로봇제어 명시방법으로 사용되고 있지만, 권고사항일 뿐, 법적 강제력을 가지지는 않는다.

대부분의 경우, 웹사이트 footer에 관련 조항을 명시한다!



>>> *최종 업데이트 : 190423*

>> 0423 저작권 관련내용 추가
