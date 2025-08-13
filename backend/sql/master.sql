-- nontrivial to add environment variables for sql so hardcode db name
drop database cs340_lishen;
create database cs340_lishen;
use cs340_lishen;

source sql/DDL.sql;
source sql/PL.sql;