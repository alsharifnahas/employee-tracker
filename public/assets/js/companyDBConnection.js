const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "saudiarabia",
    database: "company_DB"
});

connection.connect(err => {
    if (err) throw err;
    console.log("welcome to the database");
    whatToDo();
});

const whatToDo = () => {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices:
                [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "View Departments",
                    "View Roles",
                    "Add Departments",
                    "Add Roles",
                    "Exit"
                ]
        }
    ]).then(({ options }) => {

        switch (options) {
            case "View All Employees":
                viewEmployee();
                break;
            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "View Departments":
                viewDepartment();
                break;
            case "Add Departments":
                addDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Roles":
                addRole();
                break;
            case "Exit":
                quit();
                break;
        }
    })
}



const viewEmployee = () => {

    connection.query(`
    select emp.id, emp.first_name, emp.last_name, 
    role.title, role.salary,department.name as department, 
    concat(manager.first_name," ", manager.last_name) as manager
    from employee as emp left join employee as manager on  emp.manager_id = manager.id
    inner join role on emp.role_id = role.id 
    inner join department on role.department_id = department.id
    order by emp.id`,
        (err, results) => {
            console.table(results);
            whatToDo();
        })


}
const viewRoles = () => {
    connection.query("select role.title as role from role", (err, results) => {
        console.table(results);
        whatToDo();
    })
}
const viewDepartment = () => {
    connection.query("select name as department from department", (err, results) => {
        console.table(results);
        whatToDo();
    })
}

function addEmployee() {
    connection.query("select * from role", (err, roles) => {

        connection.query("select * from employee", (err, employees) => {

            const rolesArray = roles.map(role => {
                return { name: `${role.title}`, value: `${role.id}` }
            });

            const employee = employees.map(e => {
                return { name: `${e.first_name} ${e.last_name}`, id: `${e.id}` }
            });

            employee.push({ name: "none", value: null });
            inquirer.
                prompt([
                    {
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "firstName",
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "lastName",
                    },
                    {
                        type: "list",
                        message: "Please select the employee's role",
                        choices: rolesArray,
                        name: "role",
                    },
                    {
                        type: "list",
                        message: "Please select the employee's manager",
                        choices: employee,
                        name: "manager",
                    },


                ]).then(({ firstName, lastName, role, manager }) => {
                    let managerId;

                    employee.forEach(e => {
                        if (e.name === manager) {

                            managerId = e.id;
                        }
                    });



                    connection.query(`
                    insert into employee (first_name, last_name, role_id, manager_id)
                    values
                    (?,?,?,?)`, [firstName, lastName, role, managerId]);

                    console.log("New employee added");
                    whatToDo();
                });


        })

    });
}
const updateEmployeeRole = () => {
    connection.query("select * from role", (err, roles) => {

        connection.query("select * from employee", (err, employees) => {

            const rolesArray = roles.map(role => {
                return { name: `${role.title}`, value: `${role.id}` }
            });

            const employee = employees.map(e => {
                return { name: `${e.first_name} ${e.last_name}`, value: `${e.id}` }
            });


            inquirer.
                prompt([
                    {
                        type: "list",
                        message: "Who do you want to update",
                        choices: employee,
                        name: "employee_id",
                    },
                    {
                        type: "list",
                        message: "What role do you want to assign to the employee",
                        choices: rolesArray,
                        name: "role",
                    },


                ]).then(({ employee_id, role }) => {

                    connection.query(`update  employee set role_id = ? where id = ?`, [role, employee_id]);
                    console.log("Role changed successfully");

                    whatToDo();
                });


        })

    });
}

const addDepartment = () => {
    inquirer.prompt([
        {
            message: "What is the name of the department",
            type: "input",
            name: "dpName"

        }
    ]).then(({ dpName }) => {
        connection.query(`insert into department (name) values (?)`, [dpName]);
        console.log("New department added");
        whatToDo();
    });
}


const addRole = () => {
    connection.query("select * from department", (err, dp) => {

        const department = dp.map(dpmt => {
            return { name: `${dpmt.name}`, value: `${dpmt.id}` }
        });

        inquirer.prompt([
            {
                message: "What is the name of the role",
                type: "input",
                name: "roleName"

            },
            {
                message: "What is the salary of that role",
                type: "input",
                name: "salary"

            },
            {
                type: "list",
                message: "Which department does the role belong too",
                choices: department,
                name: "dplist",
            },


        ]).then(({ roleName, salary, dplist }) => {
            console.log(roleName)

            connection.query(`insert into role (title, salary, department_id) values (?,?,?)`, [roleName, salary, dplist]);
            console.log("New role added");
            whatToDo();


        });

    });
}

const quit = () => {
    console.log("Goodbye.\nHave a nice day.");
    connection.end();
}


