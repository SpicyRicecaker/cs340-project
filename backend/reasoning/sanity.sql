drop database urmom;
create database urmom;
use urmom;

create table Pokemon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255)
);

insert into Pokemon (`name`) values ('Pikachu'), ('Charizard');

select * from Pokemon;

delete from Pokemon where `name` = 'Pikachu';

select * from Pokemon;