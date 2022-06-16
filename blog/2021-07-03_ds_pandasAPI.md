---
date: "2021-05-15"
title: "Pandas 기초 사용법"
category: datascience
tags: ['datascience', 'pandas']
banner: "/assets/bg/2.jpg"
---

# 공통코드
```python
import pandas as pd
data = pd.DataFrame([
  {'name':'mglee', 'age': 23},
  {'name':'python', 'age': 23},
  {'name':'pandas', 'age': 23},
  {'name':'datadog', 'age': 23},
  ])

# 아래와 같이 선언할수도 있음
data = pd.DataFrame({
  "name": ["mglee", "python", "pandas", "datadog"],
  "age": [23,23,23,23]
})
```


### loc: label이나 쿼리를 통해 선택하는 방법

label orientied : inclusive of end

> Location
```python

```

### iloc: 행번호로 선택하는 방법

position oriented : exclusive of end

> Index location
```python
data.iloc[0:1]
print(data)

#    name   age
# 0  mglee  23
```

