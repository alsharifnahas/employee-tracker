drop database if exists company_DB;

create database company_DB;

use company_DB;

create table department (
id integer(10) auto_increment not null,
name varchar(30) not null,
primary key (id)
);

create table role (
id integer auto_increment not null,
title varchar(30) not null,
salary decimal(10,4) not null,
department_id integer(10) null,
primary key(id),
foreign key(department_id) references department(id) on delete set null
);

create table employee(
id integer(10) auto_increment not null,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id integer(10) null,
manager_id integer(10) null,
primary key (id),
foreign key(role_id) references role(id) on delete set null,
foreign key(manager_id) references employee(id) on delete set null
);

