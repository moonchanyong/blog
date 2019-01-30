---
layout: post
title: DB 모든컬럼에서 특정 값 찾기
category: [ Mysql ]
tags: [ Mysql, DB, backend ]
---


# Mysql에서 DB의 모든 값에서 특정 값 찾기 

## CONTEXT


특정 사이트의 도메인이 바뀌게 되어서 DB의 값에도 해당 도메인의 주소를 바꾸어야 하는 상황

## 다른 방법 

1. 직접 모든 테이블에 쿼리를 날려서 해당 값을 가지고 있는지 찾기  
=> 실제로 조금하다가 성격에 안맞는걸 알았다.

2. JAVA 배치를 짜서 동적으로 쿼리를 만들어서 모든 DB, TABLE, COLMN에 값 찾기  
=> 이것도 사실 어렵지 않은 방법이지만 귀찮다.

3. mysqldump를 이용하기  
=> [힌트](https://dba.stackexchange.com/questions/34856/how-to-search-whole-mysql-database-for-a-particular-string)를 얻어서 이 방법을 사용하기로 했다.


## mysqldump이용하기 

mysql 서버 접속 후 아래 명령어 실행

```bash
 mysqldump -u <USERNAME> -h <HOSTNAME> -P <포트번호> -p --socket=<mysql 내 tmp에 mysql.sock위치> <DB이름> --extended=FALSE | grep <targetValue> > find_result.txt
```

실행한 파일중 'targetValue'를 찾아서 find_result.txt에 저장한다


(모든 DB에대해서도 가능하다. 이건 원하면 찾아봐라)

### mysqldump

mysql에서 제공하는 쉽게 백업을 할 수 있는 툴, 데이터를 INSERT형태로 나와서 백업본을 다시 DB에 실행하면 된다.

### 부가 설명
--socket은 default 값으로 tmp/mysql.sock을 가리키는데 절대적인 위치를 다른곳으로 가르킬 수 있다.  
-p 비밀번호를 사용하겠다는 argument


## 주의점

### error code 1045

권한, 포트, HOSTNAME을 확인해보자.

## 참고 


https://code-factory.tistory.com/21  
https://www.lesstif.com/pages/viewpage.action?pageId=17105804