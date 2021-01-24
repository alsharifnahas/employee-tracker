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
            case "Add Employee":
                addEmployee();
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
        console.log(results)
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
            console.log(rolesArray);
            const employee = employees.map(e => {
                return { name: `${e.first_name} ${e.last_name}`, id: `${e.id}` }
            });


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
                            console.log(e.id)
                            managerId = e.id;
                        }
                    });
                    console.log(role);
                    console.log(`${firstName}, ${lastName}, ${role}, ${managerId}`);

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