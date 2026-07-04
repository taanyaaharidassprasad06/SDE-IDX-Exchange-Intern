### Database Indexes
To improve query performance database indexes were added to the columns used by the API. The `L_City` and `L_Zip` indexes already existed in the database. New indexes, `L_SystemPrice`, `L_Keyword2` (beds), and `LM_Dec_3` (baths) were created. 

Before indexing, queries on `L_SystemPrice`, `L_Keyword2` (beds), and `LM_Dec_3` (baths) performed a full table scan (`type = ALL`), did not use an index (`key = NULL`), and the estimated number of rows scanned were 36657 (`rows = 36657`).

After indexing, queries on `L_SystemPrice`, `L_Keyword2` (beds), and `LM_Dec_3` (baths) performed a range scan (`type = range`), used the newly created index (`key = idx_{col_name}`), and the estimated number of rows scanned were 18328 (`rows = 18328`).

EXPLAIN SELECT * FROM rets_property WHERE L_City >= 'Cupertino';
| Metric | After |
|--------|-------|
| Access type | range |
| Index used | idx_L_City | 
| Estimated rows scanned | 18328 | 
| Extra | Using index condition; Using MRR |

EXPLAIN SELECT * FROM rets_property WHERE L_Zip >= '92802';
| Metric | After |
|--------|-------|
| Access type | range |
| Index used | idx_L_Zip | 
| Estimated rows scanned | 18328 | 
| Extra | Using index condition; Using MRR |

---

EXPLAIN SELECT * FROM rets_property WHERE L_SystemPrice >= 300000;
| Metric | Before | After |
|--------|--------|-------|
| Access type | ALL | range |
| Index used | NULL | idx_L_SystemPrice | 
| Estimated rows scanned | 36657 | 18328 | 
| Extra | Using where | Using index condition; Using MRR | 


EXPLAIN SELECT * FROM rets_property WHERE L_Keyword2 >= 3;
| Metric | Before | After |
|--------|--------|-------|
| Access type | ALL | range |
| Index used | NULL | idx_L_Keyword2 | 
| Estimated rows scanned | 36657 | 18328 | 
| Extra | Using where | Using index condition; Using MRR | 

EXPLAIN SELECT * FROM rets_property WHERE LM_Dec_3 >= 2;
| Metric | Before | After |
|--------|--------|-------|
| Access type | ALL | range |
| Index used | NULL | idx_LM_Dec_3 | 
| Estimated rows scanned | 36657 | 18328 | 
| Extra | Using where | Using index condition; Using MRR |