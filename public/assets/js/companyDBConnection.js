const mysql = require("mysql");
const inquirer = require("inquirer");

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
                    "Updare Employee Role",
                    "Update Employee Manager",
                    "View Departments",
                    "View Roles"
                ]
        }
    ]).then(({ options }) => {

        switch (options) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View Departments":
                viewDepartment();
                break;
            case "View Roles":
                viewRoles();
                break;
        }
    })
}



const viewEmployee = () => {

    connection.query(`
    select emp.id, emp.first_name, emp.last_name, 
    role.title, role.salary,department.name as department, 
    concat(manager.first_name," ", manager.last_name) as manager
    from employee as emp left join employee as manager on  emp.id = manager.manager_id
    inner join role on emp.role_id = role.id 
    inner join department on role.department_id = department.id`,
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