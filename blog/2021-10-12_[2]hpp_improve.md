---
date: "2021-10-12"
title: "[Kaggle 커널분석 notebook] House price prediction -2"
category: howto
tags: ['kaggle','datascience', 'machinelearning']
banner: "/assets/bg/2.jpg"
---

[kaggle house price prediction EDA](https://www.kaggle.com/pmarcelino/comprehensive-data-exploration-with-python) 필사.


```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from scipy.stats import norm
from sklearn.preprocessing import StandardScaler
from scipy import stats
import warnings
warnings.filterwarnings('ignore')
%matplotlib inline
```


```python
df_train = pd.read_csv('../data/train.csv')
```


```python
df_train.columns
```
    Index(['Id', 'MSSubClass', 'MSZoning', 'LotFrontage', 'LotArea', 'Street',
           'Alley', 'LotShape', 'LandContour', 'Utilities', 'LotConfig',
           'LandSlope', 'Neighborhood', 'Condition1', 'Condition2', 'BldgType',
           'HouseStyle', 'OverallQual', 'OverallCond', 'YearBuilt', 'YearRemodAdd',
           'RoofStyle', 'RoofMatl', 'Exterior1st', 'Exterior2nd', 'MasVnrType',
           'MasVnrArea', 'ExterQual', 'ExterCond', 'Foundation', 'BsmtQual',
           'BsmtCond', 'BsmtExposure', 'BsmtFinType1', 'BsmtFinSF1',
           'BsmtFinType2', 'BsmtFinSF2', 'BsmtUnfSF', 'TotalBsmtSF', 'Heating',
           'HeatingQC', 'CentralAir', 'Electrical', '1stFlrSF', '2ndFlrSF',
           'LowQualFinSF', 'GrLivArea', 'BsmtFullBath', 'BsmtHalfBath', 'FullBath',
           'HalfBath', 'BedroomAbvGr', 'KitchenAbvGr', 'KitchenQual',
           'TotRmsAbvGrd', 'Functional', 'Fireplaces', 'FireplaceQu', 'GarageType',
           'GarageYrBlt', 'GarageFinish', 'GarageCars', 'GarageArea', 'GarageQual',
           'GarageCond', 'PavedDrive', 'WoodDeckSF', 'OpenPorchSF',
           'EnclosedPorch', '3SsnPorch', 'ScreenPorch', 'PoolArea', 'PoolQC',
           'Fence', 'MiscFeature', 'MiscVal', 'MoSold', 'YrSold', 'SaleType',
           'SaleCondition', 'SalePrice'],
          dtype='object')



# 1. 무엇을 해야할까?

아래의 값을 엑셀 스프레드시트에 저장하자.

* Variable: 변수명
* Type: 변수의 타입값, 컬럼의 값들이 수치를 나타내는 'numerical'타입과, 범주형 변수를 나타내는 'categorial' 값 두개만 들어갈 수 있음
* Segment: 변수의 구분값. building, space, location값이 들어갈 수 있음
* Expectation: SalePrice에 영향을 미치는 변수들 예측, 상/중/하로 구분
* Conclusion : 데이터 탐색 후 예측한 데이터의 중요도. 상/중/하로 구분
* Comments: 일반적인 주석

스프레드시트를 채우기 전에 변수에 대한 설명을 다 읽어보고, 이런 질문들을 해본다면 어떨까.

* 이 변수는 내가 실제 집을 살 때 고려하는 부분인가?
* 그렇다면 얼마나 중요하게 고려하는가?
* 이와 연관된 컬럼은 무엇인가? (강한 결합요소 찾기)

# SalePrice 분석


```python
df_train['SalePrice'].describe()
```




    count      1460.000000
    mean     180921.195890
    std       79442.502883
    min       34900.000000
    25%      129975.000000
    50%      163000.000000
    75%      214000.000000
    max      755000.000000
    Name: SalePrice, dtype: float64




```python
sns.displot(df_train['SalePrice'])
```




    <seaborn.axisgrid.FacetGrid at 0x7f78dc9ac280>




![png](/assets/211012/output_6_1.png)



```python
print("Skewness: %f" %df_train['SalePrice'].skew())
print("Kurtosis: %f" %df_train['SalePrice'].kurt())
```

    Skewness: 1.882876
    Kurtosis: 6.536282


## 수치형데이터와의 관계를 알아보자


```python
# Above grade (ground) living area square feet
var = 'GrLivArea'
data = pd.concat([df_train['SalePrice'], df_train[var]], axis=1)
data.plot.scatter(x=var, y='SalePrice', ylim=(0,800000))

```




    <AxesSubplot:xlabel='GrLivArea', ylabel='SalePrice'>




![png](/assets/211012/output_9_1.png)



```python
#Total square feet of basement area
var = 'TotalBsmtSF' 
data = pd.concat([df_train['SalePrice'], df_train[var]], axis=1)
data.plot.scatter(x=var, y='SalePrice', ylim=(0,800000))
```




    <AxesSubplot:xlabel='TotalBsmtSF', ylabel='SalePrice'>




![png](/assets/211012/output_10_1.png)


## 범주형 변수와의 관계를 알아보자


```python
#Rates the overall material and finish of the house
var = 'OverallQual'
data=pd.concat([df_train['SalePrice'], df_train[var]],axis=1)
f, ax = plt.subplots(figsize=(8,6))
fig=sns.boxplot(x=var, y="SalePrice", data=data)
fig.axis(ymin=0, ymax=800000)
```




    (-0.5, 9.5, 0.0, 800000.0)




![png](/assets/211012/output_12_1.png)



```python
var = 'YearBuilt'
data = pd.concat([df_train['SalePrice'], df_train[var]], axis=1)
f, ax = plt.subplots(figsize=(16, 8))
fig = sns.boxplot(x=var, y="SalePrice", data=data)
fig.axis(ymin=0, ymax=800000)
plt.xticks(rotation=90);
```


![png](/assets/211012/output_13_0.png)


4개의 변수들에 대한 상관관계를 알아보았다. 모두 양의 상관관계를 나타내고 있으며, OverallQual같은 경우, 강한 양의 상관관계를 나타냈다.

## Work smart

위 방식들은 우리의 직감을 통해 연관있는 피쳐들을 뽑아내는 과정이었지만, 우리가 알아내야하는 정보는 이에 그치지 않는다

전체를 탐험하기 위해 아래 과정을 거쳐야한다
* 히트맵 스타일의 상관관계 행렬
* Zoon heatmap 스타일의 'SalePrice' 상관관계 행렬
* 연관된 변수들 사이의 산점도 그래프


```python
corrmat = df_train.corr()
f, ax= plt.subplots(figsize=(12,9))
sns.heatmap(corrmat, vmax=.8, square=True)
```




    <AxesSubplot:>




![png](/assets/211012/output_16_1.png)


SalePrice와 연관된 변수와의 산점도행렬


```python
sns.set()
corr = df_train.corr()
mycols = [col for col in corr if abs(corr['SalePrice'][col]) > 0.6]
cols = ['SalePrice', 'OverallQual', 'GrLivArea', 'GarageCars', 'TotalBsmtSF', 'FullBath','YearBuilt']

sns.pairplot(df_train[mycols],size=2.5)
plt.show()
```


![png](/assets/211012/output_18_0.png)


## 4. 결측치

* 얼마나 많은 결측치가 있는지?
* 결측데이터에 관계가 있는지? 무작위성인지

결측치는, 표본크기가 줄어든다는 의미이기 때문에, 위 질문에 대한 대답은 중요한 의미를 갖는다. 
또한 15% 이상의 결측률을 보이는 변수는 이를 채우기 위한 어떤 방법도 사용하지 않고 지운다. (집을 구매하는데 큰 영향을 미치는 변수가 아닌 경우가 대부분이므로)


```python
total = df_train.isnull().sum().sort_values(ascending=False)
percent = (df_train.isnull().sum()/df_train.isnull().count().sort_values(ascending=False))
missing_data = pd.concat([total, percent], axis=1, keys=['Total', 'Percent'])
missing_data.head(20)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Total</th>
      <th>Percent</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>PoolQC</th>
      <td>1453</td>
      <td>0.995205</td>
    </tr>
    <tr>
      <th>MiscFeature</th>
      <td>1406</td>
      <td>0.963014</td>
    </tr>
    <tr>
      <th>Alley</th>
      <td>1369</td>
      <td>0.937671</td>
    </tr>
    <tr>
      <th>Fence</th>
      <td>1179</td>
      <td>0.807534</td>
    </tr>
    <tr>
      <th>FireplaceQu</th>
      <td>690</td>
      <td>0.472603</td>
    </tr>
    <tr>
      <th>LotFrontage</th>
      <td>259</td>
      <td>0.177397</td>
    </tr>
    <tr>
      <th>GarageYrBlt</th>
      <td>81</td>
      <td>0.055479</td>
    </tr>
    <tr>
      <th>GarageCond</th>
      <td>81</td>
      <td>0.055479</td>
    </tr>
    <tr>
      <th>GarageType</th>
      <td>81</td>
      <td>0.055479</td>
    </tr>
    <tr>
      <th>GarageFinish</th>
      <td>81</td>
      <td>0.055479</td>
    </tr>
    <tr>
      <th>GarageQual</th>
      <td>81</td>
      <td>0.055479</td>
    </tr>
    <tr>
      <th>BsmtFinType2</th>
      <td>38</td>
      <td>0.026027</td>
    </tr>
    <tr>
      <th>BsmtExposure</th>
      <td>38</td>
      <td>0.026027</td>
    </tr>
    <tr>
      <th>BsmtQual</th>
      <td>37</td>
      <td>0.025342</td>
    </tr>
    <tr>
      <th>BsmtCond</th>
      <td>37</td>
      <td>0.025342</td>
    </tr>
    <tr>
      <th>BsmtFinType1</th>
      <td>37</td>
      <td>0.025342</td>
    </tr>
    <tr>
      <th>MasVnrArea</th>
      <td>8</td>
      <td>0.005479</td>
    </tr>
    <tr>
      <th>MasVnrType</th>
      <td>8</td>
      <td>0.005479</td>
    </tr>
    <tr>
      <th>Electrical</th>
      <td>1</td>
      <td>0.000685</td>
    </tr>
    <tr>
      <th>Id</th>
      <td>0</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
#dealing with missing data
df_train = df_train.drop((missing_data[missing_data['Total'] > 1]).index,1)
df_train = df_train.drop(df_train.loc[df_train['Electrical'].isnull()].index)
df_train.isnull().sum().max() #just checking that there's no missing data missing...
```




    0



## 이상치

### 일변량 분석
이상치의 임계점을 찾는게 가장 근본적인 문제이다. 이를 위해 데이터를 표준화한다. 여기서 표준화란, 평균을 0, 표준편차를 1로 만드는 작업이다


```python
saleprice_scaled = StandardScaler().fit_transform(df_train['SalePrice'][:,np.newaxis])
low_range = saleprice_scaled[saleprice_scaled[:,0].argsort()][:10]
high_range = saleprice_scaled[saleprice_scaled[:,0].argsort()][-10:]

print('outer range (low) of the distribution: ')
print(low_range)
print('\nouter range (high) of the distribution')
print(high_range)
```

    outer range (low) of the distribution: 
    [[-1.83820775]
     [-1.83303414]
     [-1.80044422]
     [-1.78282123]
     [-1.77400974]
     [-1.62295562]
     [-1.6166617 ]
     [-1.58519209]
     [-1.58519209]
     [-1.57269236]]
    
    outer range (high) of the distribution
    [[3.82758058]
     [4.0395221 ]
     [4.49473628]
     [4.70872962]
     [4.728631  ]
     [5.06034585]
     [5.42191907]
     [5.58987866]
     [7.10041987]
     [7.22629831]]


## 이변량분석 


```python
var = 'GrLivArea'
data =pd.concat([df_train['SalePrice'], df_train[var]], axis=1)
data.plot.scatter(x=var, y='SalePrice', ylim=(0,800000))
```

    *c* argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with *x* & *y*.  Please use the *color* keyword-argument or provide a 2D array with a single row if you intend to specify the same RGB or RGBA value for all points.





    <AxesSubplot:xlabel='GrLivArea', ylabel='SalePrice'>




![png](/assets/211012/output_25_2.png)



```python
df_train.sort_values(by = 'GrLivArea', ascending=False)[:2] # result: [1298, 523]
df_train.drop(df_train[df_train['Id']==1299].index)
df_train.drop(df_train[df_train['Id']==524].index)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }

    .dataframe td {
      padding: 0;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Id</th>
      <th>MSSubClass</th>
      <th>MSZoning</th>
      <th>LotArea</th>
      <th>Street</th>
      <th>LotShape</th>
      <th>LandContour</th>
      <th>Utilities</th>
      <th>LotConfig</th>
      <th>LandSlope</th>
      <th>...</th>
      <th>EnclosedPorch</th>
      <th>3SsnPorch</th>
      <th>ScreenPorch</th>
      <th>PoolArea</th>
      <th>MiscVal</th>
      <th>MoSold</th>
      <th>YrSold</th>
      <th>SaleType</th>
      <th>SaleCondition</th>
      <th>SalePrice</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>60</td>
      <td>RL</td>
      <td>8450</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2</td>
      <td>2008</td>
      <td>WD</td>
      <td>Normal</td>
      <td>208500</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>20</td>
      <td>RL</td>
      <td>9600</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>FR2</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>5</td>
      <td>2007</td>
      <td>WD</td>
      <td>Normal</td>
      <td>181500</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>60</td>
      <td>RL</td>
      <td>11250</td>
      <td>Pave</td>
      <td>IR1</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>9</td>
      <td>2008</td>
      <td>WD</td>
      <td>Normal</td>
      <td>223500</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>70</td>
      <td>RL</td>
      <td>9550</td>
      <td>Pave</td>
      <td>IR1</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Corner</td>
      <td>Gtl</td>
      <td>...</td>
      <td>272</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2</td>
      <td>2006</td>
      <td>WD</td>
      <td>Abnorml</td>
      <td>140000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>60</td>
      <td>RL</td>
      <td>14260</td>
      <td>Pave</td>
      <td>IR1</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>FR2</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>12</td>
      <td>2008</td>
      <td>WD</td>
      <td>Normal</td>
      <td>250000</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>1455</th>
      <td>1456</td>
      <td>60</td>
      <td>RL</td>
      <td>7917</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>8</td>
      <td>2007</td>
      <td>WD</td>
      <td>Normal</td>
      <td>175000</td>
    </tr>
    <tr>
      <th>1456</th>
      <td>1457</td>
      <td>20</td>
      <td>RL</td>
      <td>13175</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2</td>
      <td>2010</td>
      <td>WD</td>
      <td>Normal</td>
      <td>210000</td>
    </tr>
    <tr>
      <th>1457</th>
      <td>1458</td>
      <td>70</td>
      <td>RL</td>
      <td>9042</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2500</td>
      <td>5</td>
      <td>2010</td>
      <td>WD</td>
      <td>Normal</td>
      <td>266500</td>
    </tr>
    <tr>
      <th>1458</th>
      <td>1459</td>
      <td>20</td>
      <td>RL</td>
      <td>9717</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>112</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>4</td>
      <td>2010</td>
      <td>WD</td>
      <td>Normal</td>
      <td>142125</td>
    </tr>
    <tr>
      <th>1459</th>
      <td>1460</td>
      <td>20</td>
      <td>RL</td>
      <td>9937</td>
      <td>Pave</td>
      <td>Reg</td>
      <td>Lvl</td>
      <td>AllPub</td>
      <td>Inside</td>
      <td>Gtl</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>6</td>
      <td>2008</td>
      <td>WD</td>
      <td>Normal</td>
      <td>147500</td>
    </tr>
  </tbody>
</table>
<p>1458 rows × 63 columns</p>
</div>




```python
var = 'TotalBsmtSF'
data = pd.concat([df_train['SalePrice'], df_train[var]], axis=1)
data.plot.scatter(x=var, y='SalePrice', ylim=(0,800000))
```

    *c* argument looks like a single numeric RGB or RGBA sequence, which should be avoided as value-mapping will have precedence in case its length matches with *x* & *y*.  Please use the *color* keyword-argument or provide a 2D array with a single row if you intend to specify the same RGB or RGBA value for all points.





    <AxesSubplot:xlabel='TotalBsmtSF', ylabel='SalePrice'>




![png](/assets/211012/output_27_2.png)


## 더 세부적인 내용들.

SalePrice가 어떤 값인지 이해하기 위해선다변량 분석에 대한 통계적인 기초 아래의 추정이 필요하다.이미 SalePrice에 관한 몇몇 데이터를 정리하고 탐색해보았으니, 다변량 분석을 가능하게하는 통계적 추정이 어떻게 SalePrice를 경정하는지 알아보아야 한다.

4개의 통계적 추정값을 살표보자. 

* Normality - 정규성
  정규분포를 따르는지에 대한 특성. 하나의 변수에서 Saleprice가 정규한지를 체크할 것이다.
  하나의 변수에서의 정규성이 다변수에서의 정규성을 띄도록 도와주지만, 다변수에서의 정규성을 보장하지는 않는다는것을 기억하자.  
  
  하나 더 고려해야할 것은, 보통 200개 이상의 큰 샘플에 대해서는 정규성이 그다지 큰 이슈가 아니지만 정규성 문제를 해결하면 heteroscedacity를 포함한 많은 문제를 우회할 수 있다. 


* Homoscedasticity - 등분산성
  등분산성은 '종속 변수가 예측 변수 범위에 걸쳐 동일한 수준의 분산을 나타낸다는 가정'을 나타낸다.
  등분산성은 독립 변수의 모든 값에서 오차 항이 동일하기를 원하기 때문에 바람직하다. 
  
  
  
* Linearlity - 선형성
  선형성을 평가하는 가장 쉬운 방법은 산점도가 선형성을 나타내는지 체크하는것이다. 만약 선형적이지 않은 패턴이라면 데이터를 변환하는게 바람직하다. 



* Absence of correlated errors - 상관오류의 부재 
  상관오류라는 정의가 보여주듯, 하나의 오류가 다른 부분에 상관될 때 발생한다. 예를들어 긍정 오류가 대칭적으로 부정 오류를 만든다면, 이 변수들 사이에는 상관관계가 있는 것이며 이는 시계열 데이터가 시간과 관련있는 패턴일때 종종 발생한다. 

## 정규성 찾기
SalePrice 에 대한 정규성을 깔끔한 방법으로 찾아보자

* 히스토그램을 통해 첨도와 왜도 구하기
* 정규확률분포: 데이터 분포가 정규 분포를 의미하는 대각선에 근사하는지 찾기.


```python
sns.distplot(df_train['SalePrice'], fit=norm)
fig = plt.figure()
res = stats.probplot(df_train['SalePrice'], plot=plt)
```


![png](/assets/211012/output_30_0.png)



![png](/assets/211012/output_30_1.png)


SalePrice는 정규성을 따르지 않는다. 그래프가 너무 뾰족하고 확률분포가 대각선을 따르지 않는다.  

그러나 간단한 데이터 변환으로 문제를 해결할 수 있다. 통계학 책에서 배울 수 있는 신기한 방법은 **로그**를 취해서 양의 왜도를 조정할 수 있다.


```python
df_train['SalePrice'] = np.log(df_train['SalePrice'])
```


```python
sns.distplot(df_train['SalePrice'],fit=norm)
fig = plt.figure()
res = stats.probplot(df_train['SalePrice'], plot=plt)
```


![png](/assets/211012/output_33_0.png)



![png](/assets/211012/output_33_1.png)



```python
df_train['GrLivArea'] = np.log(df_train['GrLivArea'])
```


```python
#histogram and normal probability plot
sns.distplot(df_train['GrLivArea'], fit=norm);
fig = plt.figure()
res = stats.probplot(df_train['GrLivArea'], plot=plt)
```


![png](/assets/211012/output_35_0.png)



![png](/assets/211012/output_35_1.png)


다음으로 아래 변수에 대한 정규화를 해보자


```python
sns.distplot(df_train['TotalBsmtSF'],fit=norm);
fig = plt.figure()
res=stats.probplot(df_train['TotalBsmtSF'], plot=plt)
```


![png](/assets/211012/output_37_0.png)



![png](/assets/211012/output_37_1.png)


위 그래프에서 얻을 수 있는 것들?
* 왜도
* 값이 0인 많은 수의 관측치
* 0값은 로그변환으로 근사시킬 수 없다는점

로그 변환을 적용시키기 위해  basement(?)를 가지는지 아닌지를 나타내는 변수를 하나 만들어, 0이 아닌관측치에 대한 로그 변환을 할 것이다.


```python
df_train['HasBsmt'] = pd.Series(len(df_train['TotalBsmtSF']), index=df_train.index)
df_train['HasBsmt'] =0
df_train.loc[df_train['TotalBsmtSF'] > 0, 'HasBsmt'] = 1
```


```python
df_train.loc[df_train['HasBsmt'] ==1, 'TotalBsmtSF'] = np.log(df_train['TotalBsmtSF'])
```


```python
sns.distplot(df_train[df_train['TotalBsmtSF'] > 0 ]['TotalBsmtSF'], fit=norm);
fig=plt.figure()
res = stats.probplot(df_train[df_train['TotalBsmtSF'] >0]['TotalBsmtSF'], plot=plt)
```


![png](/assets/211012/output_41_0.png)



![png](/assets/211012/output_41_1.png)


## 한번의 시도로 공분산성 찾기

그래프를 통해 두 변수의 공분산성을 검증하는 방법은 그래프이다. 콘 또는 다이아몬드 형태의 모양은 두 변수가 등분산성을 나타내는 시작입니다.




```python
plt.scatter(df_train['GrLivArea'],df_train['SalePrice'])
```




    <matplotlib.collections.PathCollection at 0x7f78cbf04cd0>




![png](/assets/211012/output_43_1.png)


이전버전의 GrLivArea는 원뿔모양이지만 더이상 그렇지 않다.
(원뿔모양 산점도가 동질성을 떨어뜨린다는 말이었을까? 헷갈린다)


```python
plt.scatter(df_train[df_train['TotalBsmtSF']>0]['TotalBsmtSF'], df_train[df_train['TotalBsmtSF']>0]['SalePrice']);
```


![png](/assets/211012/output_45_0.png)


## 마지막으로 중요한 dummy variables



```python
df_train = pd.get_dummies(df_train)
```


```python
df_train.head(10)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Id</th>
      <th>MSSubClass</th>
      <th>LotArea</th>
      <th>OverallQual</th>
      <th>OverallCond</th>
      <th>YearBuilt</th>
      <th>YearRemodAdd</th>
      <th>BsmtFinSF1</th>
      <th>BsmtFinSF2</th>
      <th>BsmtUnfSF</th>
      <th>...</th>
      <th>SaleType_ConLw</th>
      <th>SaleType_New</th>
      <th>SaleType_Oth</th>
      <th>SaleType_WD</th>
      <th>SaleCondition_Abnorml</th>
      <th>SaleCondition_AdjLand</th>
      <th>SaleCondition_Alloca</th>
      <th>SaleCondition_Family</th>
      <th>SaleCondition_Normal</th>
      <th>SaleCondition_Partial</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>60</td>
      <td>8450</td>
      <td>7</td>
      <td>5</td>
      <td>2003</td>
      <td>2003</td>
      <td>706</td>
      <td>0</td>
      <td>150</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>20</td>
      <td>9600</td>
      <td>6</td>
      <td>8</td>
      <td>1976</td>
      <td>1976</td>
      <td>978</td>
      <td>0</td>
      <td>284</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>60</td>
      <td>11250</td>
      <td>7</td>
      <td>5</td>
      <td>2001</td>
      <td>2002</td>
      <td>486</td>
      <td>0</td>
      <td>434</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>70</td>
      <td>9550</td>
      <td>7</td>
      <td>5</td>
      <td>1915</td>
      <td>1970</td>
      <td>216</td>
      <td>0</td>
      <td>540</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>60</td>
      <td>14260</td>
      <td>8</td>
      <td>5</td>
      <td>2000</td>
      <td>2000</td>
      <td>655</td>
      <td>0</td>
      <td>490</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>6</td>
      <td>50</td>
      <td>14115</td>
      <td>5</td>
      <td>5</td>
      <td>1993</td>
      <td>1995</td>
      <td>732</td>
      <td>0</td>
      <td>64</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7</td>
      <td>20</td>
      <td>10084</td>
      <td>8</td>
      <td>5</td>
      <td>2004</td>
      <td>2005</td>
      <td>1369</td>
      <td>0</td>
      <td>317</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>8</td>
      <td>60</td>
      <td>10382</td>
      <td>7</td>
      <td>6</td>
      <td>1973</td>
      <td>1973</td>
      <td>859</td>
      <td>32</td>
      <td>216</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>9</td>
      <td>50</td>
      <td>6120</td>
      <td>7</td>
      <td>5</td>
      <td>1931</td>
      <td>1950</td>
      <td>0</td>
      <td>0</td>
      <td>952</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>9</th>
      <td>10</td>
      <td>190</td>
      <td>7420</td>
      <td>5</td>
      <td>6</td>
      <td>1939</td>
      <td>1950</td>
      <td>851</td>
      <td>0</td>
      <td>140</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>10 rows × 223 columns</p>
</div>




```python

```
