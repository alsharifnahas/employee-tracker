use company_db;

insert into department (name)
values
("Engineering"),
("Finance"),
("Sales");


insert into role (title, salary, department_id)
values
("Lead Engineer", 200000, 1),
("Software Engineer", 100000, 1 ),
("Finance Manager", 150000, 2),
("Financial Analyst", 75000, 2),
("Sales Manager", 90000, 3),
("Sales Representative", 60000, 3);



insert into employee (first_name, last_name, role_id, manager_id)
values
("John", "Doe", 1, null),
("Mike", "Chan", 2,1),
("Ashley", "Rodri", 3, null),
("Michael", "Jordan", 4,3),
("Rodrigo", "Alvarez", 5,null),
("Ahmed", "Al-Yusouf", 6,5);

