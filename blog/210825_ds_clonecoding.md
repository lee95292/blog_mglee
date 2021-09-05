---
date: "2021-08-25"
title: "데이콘, 캐글 수상 코드 패턴 분석"
category: "datascience"
tags: ['datascience', 'machinelearning']
banner: "/assets/bg/2.jpg"
---

목차

* Feature engineering
* Visualization
* Modeling

캐글,데이콘 수상코드는 보면 볼수록 경이롭다. 처음에는 몇백 몇천만원을 수상한 코드 길이가 뭐이리 짧은지 신기했지만, 아직 데이터사이언스 문외한인 내가 몇시간씩 들여가며 겨우 한페이지의 코드만을 이해했을 때, 뭘 공부해야할 지 어느정도 명쾌하게 나오면서도, 이정도 코드를 짜기위해 노력하다보면 개발자로서의 나는 희미해지고 커리어가 완전히 바뀔것이라는것 정도는 알 수 있어 무서웠다.

그럼에도 뭘 가장 먼저 해야할까 생각해봤는데, Modeling은 성능에 큰 영향을 미치고, 아직 모르는부분이 많기에 가장 먼저 익숙해져야 할 부분으로 생각했다. 

자주 사용되는 패턴들을 우선적으로 정리하면 좋겠지만, 아직 분석한 코드가 많지 않아 최근 본 내용들 위주로 정리했다. 

# Modeling

### Validation
```
from sklearn.model_selection import PredefinedSplit, GridSearchCV
df = pd.DataFrame(columns = ['n_estimators', 'eta', 'min_child_weight','max_depth', 'colsample_bytree', 'subsample'])
preds = np.array([])

grid = {'n_estimators' : [100], 'eta' : [0.01], 'min_child_weight' : np.arange(1, 8, 1), 
        'max_depth' : np.arange(3,9,1) , 'colsample_bytree' :np.arange(0.8, 1.0, 0.1), 
        'subsample' :np.arange(0.8, 1.0, 0.1)} # fix the n_estimators & eta(learning rate)
for i in tqdm(np.arange(1, 61)):
    y = train.loc[train.num == i, 'power']
    x = train.loc[train.num == i, ].iloc[:, 3:]
    y_train, y_test, x_train, x_test = temporal_train_test_split(y = y, X = x, test_size = 168)
    
    
    pds = PredefinedSplit(np.append(-np.ones(len(x)-168), np.zeros(168)))
    gcv = GridSearchCV(estimator = XGBRegressor(seed = 0, gpu_id = 1, 
                                                tree_method = 'gpu_hist', predictor= 'gpu_predictor'),
                       param_grid = grid, scoring = smape, cv = pds, refit = True, verbose = True)
    
    
    gcv.fit(x_train, y_train)
    best = gcv.best_estimator_
    params = gcv.best_params_
    print(params)
    pred = best.predict(x_test)
    building = 'building'+str(i)
    print(building + '|| SMAPE : {}'.format(SMAPE(y_test, pred)))
    preds = np.append(preds, pred)
    df = pd.concat([df, pd.DataFrame(params, index = [0])], axis = 0)
    df.to_csv('./hyperparameter_xgb.csv', index = False) # save the tuned parameters
```
### 
---

# Visualization
---

# Feature engineering


### pandas.pivot_table
---

# etc
