-- source reasoning/testDelete.sql;
select * from Applications;
delete from Applications where Applications.applicationID = 2;
select * from Applications;