## Database Indexes
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


## EXPLAIN on complex query
One complex query is where the user provides all of the possible filters when searching for a property. The following query demonstrates this:
```
EXPLAIN
    -> SELECT *  
    -> FROM rets_property   
    -> WHERE LOWER(TRIM(L_City)) = LOWER(TRIM('Mountain House'))  
    ->   AND L_Zip = '95391'  
    ->   AND L_SystemPrice >= 500000  
    ->   AND L_SystemPrice <= 2000000  
    ->   AND L_Keyword2 >= 3  
    ->   AND LM_Dec_3 >= 2  
    -> LIMIT 20 OFFSET 0;
```  

| id | select_type | table | partitions | type | possible_keys | key | key_len | ref | rows | filtered | Extra |
|--------|--------|-------|--------|--------|-------|--------|--------|-------|--------|--------|-------|
| 1 | SIMPLE | rets_property | NULL | ref | idx_L_Zip, idx_L_SystemPrice, idx_L_Keyword2, idx_LM_Dec_3 | idx_L_Zip | 83 | const | 40 | 12.50 | Using where |

| Column | Meaning |
|--------|---------|
| `id` | identifies the SELECT statement |
| `select_type` | type of SQL query |
| `table` | table being queried |
| `partitions` | partitions that MySQL will use, if any |
| `type` | how MySQL accesses the table |
| `possible_keys` | indexes MySQL could potentially use |
| `key` | index MySQL actually chose |
| `key_len` | length of the index portion MySQL uses |
| `ref` | value/column used to compare against the index |
| `rows` | estimated number of rows MySQL will examine |
| `filtered` | estimated percentage of rows remaining after filtering |
| `Extra` | additional information about how MySQL executes the query |

### Interpret the results
- `type = ref`: MySQL is using an index to find matching rows instead of scanning the entire table. 
    - MySQL chose 4 possible indexes to perform this operation: `idx_L_Zip`, `idx_L_SystemPrice`, `idx_L_Keyword2`, `idx_LM_Dec_3`
    - MySQL actually chose `idx_L_Zip`
- `rows = 40`: MySQL examined about 40 rows using that index
- `filtered = 12.50`: about 12.5% of those examined rows will satisfy the remaining filtering conditions
- `Extra = Using where`: after using the `idx_L_Zip` index, MySQL still has to evaluate the other `WHERE` conditions (price, beds, baths, etc.)

The `EXPLAIN` output shows that MySQL uses the existing `idx_L_Zip` index to locate properties matching the ZIP code. MySQL estimates that approximately 40 rows will be examined, with about 12.5% expected to satisfy the remaining filtering conditions. The `Using where` value indicates that additional conditions for price, beds, and baths are applied after the ZIP index lookup. No full table scan is performed because the access type is `ref` rather than ALL.

## Composite Indexes on most common filters
To improve query performance across some filter combinations, three popular combinations have been chosen to create a composite index. They include, zip code and price, city and price, and beds and baths.  

### ZIP + Minimum Price — Before Composite Index
```EXPLAIN ANALYZE SELECT * FROM rets_property WHERE L_Zip = '90402'   AND L_SystemPrice >= 500000 LIMIT 20 OFFSET 0;```

Limit: 20 row(s)  (cost=63.1 rows=20) (actual time=0.208..2.58 rows=20 loops=1)   
    Filter: (rets_property.L_SystemPrice >= 500000)  (cost=63.1 rows=31.5) (actual time=0.206..2.58 rows=20 loops=1)  
        Index lookup on rets_property using idx_L_Zip (L_Zip='90402')  (cost=63.1 rows=63) (actual time=0.193..2.56 rows=20 loops=1)

### ZIP + Minimum Price — After Composite Index
Limit: 20 row(s)  (cost=62.4 rows=20) (actual time=0.396..1.53 rows=20 loops=1)  
    Filter: (rets_property.L_SystemPrice >= 500000)  (cost=62.4 rows=31.5) (actual time=0.389..1.52 rows=20 loops=1)  
        Index lookup on rets_property using idx_L_Zip (L_Zip='90402')  (cost=62.4 rows=63) (actual time=0.369..1.49 rows=20 loops=1)

### ZIP + Price Composite Index Summary
Before adding the composite index, MySQL used the existing `idx_L_Zip` index to find properties in ZIP code `90402` and then separately filtered the results by minimum price.

After adding the composite index `(L_Zip, L_SystemPrice)`, MySQL **continued using `idx_L_Zip`** rather than the new composite index. The execution plan remained an index lookup followed by a separate price filter.

| Metric | Before | After |
|--------|--------|-------|
| Index used | `idx_L_Zip` | `idx_L_Zip` |
| ZIP filter | `L_Zip = '90402'` | `L_Zip = '90402'` |
| Price filter | Applied separately | Applied separately |
| Estimated rows | 63 | 63 |
| Actual rows returned | 20 | 20 |
| Actual execution time | 2.58 ms | 1.53 ms |

**Result:** MySQL did not select the `idx_zip_price` composite index for this query. Although the measured execution time decreased from 2.58 ms to 1.53 ms in this run, this should **not be attributed to the composite index**, since the execution plan shows that MySQL continued using `idx_L_Zip`.

Possible reasons for a faster execution time could include:
- Database caching: MySQL may already have the needed data in memory from the first query, so the second query runs faster
- System load: Other programs or processes using your computer can affect query speed
- Query execution conditions: Even if the query and execution plan are the same, the exact execution time can vary each time

### City + Minimum Price — Before Composite Index
```EXPLAIN ANALYZE SELECT * FROM rets_property WHERE L_City = 'Los Angeles' AND L_SystemPrice >= 900000 LIMIT 20 OFFSET 0;```

Limit: 20 row(s)  (cost=3384 rows=20) (actual time=0.382..2.13 rows=20 loops=1)  
    Filter: (rets_property.L_SystemPrice >= 900000)  (cost=3384 rows=1722) (actual time=0.371..2.12 rows=20 loops=1)  
        Index lookup on rets_property using idx_L_City (L_City='Los Angeles')  (cost=3384 rows=3444) (actual time=0.34..2.08 rows=43 loops=1)  

### City + Minimum Price — After Composite Index
Limit: 20 row(s)  (cost=2388 rows=20) (actual time=0.177..1.69 rows=20 loops=1)  
    Index range scan on rets_property using idx_city_price over (L_City = 'Los Angeles' AND 900000 <= L_SystemPrice), with index condition: ((rets_property.L_City = 'Los Angeles') and (rets_property.L_SystemPrice >= 900000))  (cost=2388 rows=2107) (actual time=0.157..1.66 rows=20 loops=1)

### City + Price Composite Index Summary
Before adding the composite index, MySQL used the `idx_L_City` index to find properties in Los Angeles and then separately filtered the results by price.

After adding the composite index `(L_City, L_SystemPrice)`, MySQL used `idx_city_price` to perform an index range scan using both the city and price conditions.

| Metric | Before | After |
|--------|--------|-------|
| Index used | `idx_L_City` | `idx_city_price` |
| City filter | `L_City = 'Los Angeles'` | `L_City = 'Los Angeles'` |
| Price filter | Applied separately | Included in index lookup |
| Estimated rows | 3,444 | 2,107 |
| Actual rows returned | 20 | 20 |
| Actual execution time | 2.13 ms | 1.69 ms |

The composite index for this specific query reduced the estimated rows from 3,444 to 2,107 and reduced the measured execution time from 2.13 ms to 1.69 ms, an approximately 20.7% reduction in execution time.

### Beds + Baths — Before Composite Index
```EXPLAIN ANALYZE SELECT * FROM rets_property WHERE L_Keyword2 >= 3 AND LM_Dec_3 >= 2 LIMIT 20 OFFSET 0;```

Limit: 20 row(s)  (cost=19883 rows=20) (actual time=13.7..14.2 rows=20 loops=1)  
    Filter: (rets_property.L_Keyword2 >= 3)  (cost=19883 rows=9164) (actual time=13.7..14.2 rows=20 loops=1)  
        Index range scan on rets_property using idx_LM_Dec_3 over (2.0 <= LM_Dec_3), with index condition: (rets_property.LM_Dec_3 >= 2.0)  (cost=19883 rows=18328) (actual time=13.7..14.2 rows=28 loops=1)

### Beds + Baths — After Composite Index
Limit: 20 row(s)  (cost=19774 rows=20) (actual time=11.9..12.6 rows=20 loops=1)  
    Filter: (rets_property.L_Keyword2 >= 3)  (cost=19774 rows=9164) (actual time=11.9..12.5 rows=20 loops=1)  
        Index range scan on rets_property using idx_LM_Dec_3 over (2.0 <= LM_Dec_3), with index condition: (rets_property.LM_Dec_3 >= 2.0)  (cost=19774 rows=18328) (actual time=11.8..12.5 rows=28 loops=1)

### Beds + Baths Composite Index Summary
Before adding the composite index `(L_Keyword2, LM_Dec_3)`, MySQL used the existing `idx_LM_Dec_3` index to filter properties by minimum baths and then separately filtered the results by minimum beds.

After adding the composite index, MySQL **continued using `idx_LM_Dec_3`** rather than the new composite index. The execution plan remained an index range scan followed by a separate beds filter.

| Metric | Before | After |
|--------|--------|-------|
| Index used | `idx_LM_Dec_3` | `idx_LM_Dec_3` |
| Baths filter | `LM_Dec_3 >= 2` | `LM_Dec_3 >= 2` |
| Beds filter | Applied separately | Applied separately |
| Estimated rows | 18,328 | 18,328 |
| Actual rows returned | 20 | 20 |
| Actual execution time | 14.2 ms | 12.6 ms |

**Result:** MySQL did not select the `idx_beds_baths` composite index for this query. Although the measured execution time decreased from 14.2 ms to 12.6 ms in this run, this should **not be attributed to the composite index**, since MySQL continued using `idx_LM_Dec_3`.