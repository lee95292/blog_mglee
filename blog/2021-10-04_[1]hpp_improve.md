---
date: "2021-10-04"
title: "[Kaggle 커널분석 notebook] House price prediction"
category: howto
tags: ['kaggle','datascience', 'machinelearning']
banner: "/assets/bg/2.jpg"
---


[House price prediction (top4% kernel)](https://www.kaggle.com/serigne/stacked-regressions-top-4-on-leaderboard) 참고.

## House price prediction 분석

아래는 캐글 집값예측 샘플데회에 대한 나의 코드이다. 보시다시피 EDA도 안하고 무작정 전처리 / 모델링이 끝이며, 스코어도 발산하는 코드이다.

House price prediction 분석 -2 부터는 나의 기본코드를 개선할 것이다.

[House price prediction (top4% kernel)](https://www.kaggle.com/serigne/stacked-regressions-top-4-on-leaderboard) 에서는 정규화, 대체, 인코딩 등의 전처리 과정을 사전 학습하고 상위 4%의 모델을 만드는 과정이 담긴 커널이다. 이 커널에서 참조된 레퍼런스들을 집중적으로 참고할 것이다.


[집값예측문제 개선과정](https://github.com/lee95292/houseprice-prediction-improve)을 git commit을 통해 남길 예정이니, 어떤 과정을 통해 개선했는지 궁금한 캐글러들은 확인해봐도 좋을듯 하다.


아래는 나의 베이스라인 커널이다.

## House price prediction [My_kernel.ipynb]

House Pr
```python
%matplotlib inline
```

## House price prediction, exercise #1


```python
import pandas as pd
import numpy as np
import xgboost
import sklearn
import seaborn as sb
import math
import matplotlib.pyplot as plot

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, LabelEncoder
from sklearn.model_selection import cross_val_score, train_test_split, GridSearchCV, KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error
from xgboost import XGBRegressor

train = pd.read_csv('./data/train.csv')
test = pd.read_csv('./data/test.csv')

train_y = train['SalePrice']
train.drop('SalePrice',axis=1, inplace=True)

```

## Exploratory Data Analysis


```python

```

## Preprocessing
* (1) 1460개 행 중에서 1000개 이상의 결측값을 가진 열 삭제 
* (2) 수치형 변수와 범주형 변수로 나누어서 결측치 대체
* (3) 범주형 데이터는 카디널리티 10 기준으로 나누어서 각각 Oridinal, OneHot으로 인코딩


```python
# (1)
loss_cols  = [col for col in train if train[col].isnull().sum() > 1000]
train_f = train.drop(loss_cols, axis=1)


# (2)
train_num_cols = [col for col in train_f if train_f[col].dtypes !='object' ]
sim = SimpleImputer()
train_num = pd.DataFrame(sim.fit_transform(train_f[train_num_cols]), columns=train_num_cols)

train_cat = train_f.select_dtypes(include='object')
cat_sim = SimpleImputer(strategy='most_frequent')
train_cat = pd.DataFrame(cat_sim.fit_transform(train_cat), columns=train_cat.columns)

# (3)
high_cardinal_cols = [col for col in train_cat.columns if train_cat[col].nunique() >= 10]
low_cardinal_cols = [col for col in train_cat.columns if train_cat[col].nunique() < 10]

ore = OrdinalEncoder()
train_ohe = pd.get_dummies(train_cat[low_cardinal_cols],  prefix=low_cardinal_cols, prefix_sep='_') #pd.DataFrame(ohe.fit_transform(train_cat[low_cardinal_cols]))
train_ore = pd.DataFrame(ore.fit_transform(train_cat[high_cardinal_cols]), columns = high_cardinal_cols)

# # of joined dataframe's col is 223
print('====Validation====')
print(len(train_cat.columns), len(train_num.columns))
print(len(train_ohe.columns), len(train_ore.columns), len(train_num.columns))
print("Valid : " ,((len(train_ohe.columns)+len(train_ore.columns)+len(train_num.columns)) == 223))

# concatenation
train_f.drop(train_cat.columns, axis=1, inplace=True)
train_f.drop(train_num.columns, axis=1, inplace=True)

train_f = pd.concat([train_num, train_ohe, train_ore], axis=1)

```

    ====Validation====
    39 37
    183 3 37
    Valid :  True


## Modeling
*  #1. train_test_split
*  #2. Cross_val_score
*  #3. Kfold
*  #3. KFold + hyperparameter tuning(GCV)


```python
flag = 1
if flag == 1: # error : 
    train_x, valid_x, train_y, valid_y = train_test_split(train_f,train_y, train_size=0.8, test_size=0.2)

    model = XGBRegressor(eta=0.1, colsample_bytree=0.75, max_depth= 3, min_child_weight=3)
    model.fit(train_x,train_y)

    pred = model.predict(valid_x)

    score = mean_squared_error(pred, valid_y, squared=False)
    print("mean_squared_error: ",score)
    
elif flag == 2:  
    model = XGBRegressor()

    scores = -1*cross_val_score(model, train_f, train_y, cv=5, scoring='neg_mean_squared_error')
    print("mean_squared_error mean: ",scores.mean())
elif flag == 3:
    pass
elif flag == 4:
    train_x, valid_x, train_y, valid_y = train_test_split(train_f, train_y, train_size=0.8, test_size = 0.2)
    
    model = XGBRegressor()
    kf = KFold(random_state=30, shuffle=True, n_splits=10)
    params = {'eta':[0.05, 0.1, 0.15],'max_depth':[5,7], 'min_child_weight':[1,3], 'colsample_bytree':[0.5,0.75]}
    
    gcv = GridSearchCV(estimator=model, cv=kf, n_jobs=10, scoring='neg_mean_squared_error', verbose=True, param_grid=params)
    
    
    gcv.fit(train_x, train_y)
    print(gcv.best_params_)
    
    best_model = gcv.best_estimator_
    pred = best_model.predict(valid_x)
    score = mean_squared_error(pred, valid_y, squared=Fasle)
    
    print("mean_squared_error: ",score)
#     Fitting 10 folds for each of 8 candidates, totalling 80 fits
#     {'colsample_bytree': 0.75, 'max_depth': 5, 'min_child_weight': 3}
#     Mean_absolute_error:  17648.85913420377
```

    mean_squared_error:  25757.824396836273


```