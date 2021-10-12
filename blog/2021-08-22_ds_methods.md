---
date: "2021-09-20"
title: "Datascience 패키지 메서드  사용법 정리"
category: "data scrience"
tags: ['data science']
banner: "/assets/bg/2.jpg"
---

# Pandas
## DataFrame.select_dtypes()
```python
train.select_dtypes(exclude=['object'])
# or
train.select_dtypes(include=['object'])
```
> dtype이 맞는 컬럼만 골라낸다.

p.s 아래와 같이 구현할수도 있다.
```python
cols = [col for col in train if train[col].dtypes =='object' ]
```
## read_csv()
```python
X_full = pd.read_csv('../input/train.csv', index_col='Id')
```
> csv파일을 Pandas.DataFrame으로 읽어들인다. 
* index_col : index로 사용할 컬럼을 지정한다

## DataFrame.copy
```python
X = X_full[features].copy()
```
> 기존 데이터프레임을 새로 만들어 반환한다.


## Series.unique
```python
[print( {col : train[col].unique()}, end='\n\n') for col in cat_cols]

```
> 컬럼의 유니크 요소 반환 

결과
```
{'MSZoning': array(['RL', 'RM', 'C (all)', 'FV', 'RH'], dtype=object)}

{'Street': array(['Pave', 'Grvl'], dtype=object)}

{'Alley': array([nan, 'Grvl', 'Pave'], dtype=object)}

{'LotShape': array(['Reg', 'IR1', 'IR2', 'IR3'], dtype=object)}

{'LandContour': array(['Lvl', 'Bnk', 'Low', 'HLS'], dtype=object)}

{'Utilities': array(['AllPub', 'NoSeWa'], dtype=object)}

{'LotConfig': array(['Inside', 'FR2', 'Corner', 'CulDSac', 'FR3'], dtype=object)}

{'LandSlope': array(['Gtl', 'Mod', 'Sev'], dtype=object)}
```

## DataFrame.nunique, Series.nunique

# Sklearn

## RandomForestRegressor
```python
model = RandomForestRegressor(n_estimators=100, criterion='mae', random_state=0)
```
> RandomForest 회귀 모델을 생성한다. 자주 사용하는 파라미터는  아래와 같다.

랜덤포레스트 모델은 여러 머신러닝 모델을 ensemble(결합)하여 만드는 모델이다.
각 모델의 결합을 통해 오버피팅을 방지하는 효과를 가지고있으며, 
데이터를 sampling해서 만든 Decision tree 평가 결과치의 평균을 통해 계산한다.
* n_estimators: 생성할 트리 개수 
* max_features: 최대로 선택할 특징의 수
* max_depth: 트리의 최대 깊이 (max_features랑 비례)
* criterion: Error 산정 기준(mae, mse, mse 등등)
* random_state: 난수 시드

## (from sklearn.model_selection) 

### train_test_split
```python
X_train, X_valid, y_train, y_valid = train_test_split(X, y, train_size=0.8, test_size=0.2, random_state=0)
```
> X,Y 값에 대한 train/test셋을 일정 비율로 나눈다. train: 모델 학습에 사용, test: 모델 검증에 사용
* X,Y:  각각 feature와 result data 셋을 넘긴다.
* train/test_size: 각각 train/test 비율을 넘겨야 하며, 합한 값은 1이 되어야 한다.

## (from sklearn.metrics) mean_absolute_error
```python
mean_absolute_error(y_v, preds)
```
>  y_validation dataframe에 대한 pred의 mae를 리턴한다.

## (from sklearn.imputer)
### SimpleImputer
> 결측치를 대체하기 위한 transformer 객체를 생성한다.
* strategy: mean | median | most_frequent | constant 등이 있고, constant는 fill_value 파라미터를 지정해 상수로 대체한다.
* copy: default:  true. false인 경우, 파라미터로 들어온 dataframe을 복제하지 않고 해당 dataframe에서 실행한다..
```python
my_imputer = SimpleImputer()
imputed_X_train = pd.DataFrame(my_imputer.fit_transform(X_train))
imputed_X_valid = pd.DataFrame(my_imputer.transform(X_valid))
```

## (from sklearn.Pipeline) Pipeline

```python
cat_transformer = Pipeline(steps=[
    ('impute', SimpleImputer() ),
    ('ohe', OneHotEncoder())
])
```

## (from sklearn.ColumnTransformer) ColumnTransformer
```python
preprocessor = ColumnTransformer(transformers=[
    ('num', SimpleImputer(strategy='constant'), numerical_cols)
    ('cat', cat_transformer, catagorial_cols)
])
```
# pytorch

# XGboost
