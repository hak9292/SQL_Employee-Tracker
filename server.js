const express = require('express');
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alex-password',
    database: 'company_db'
},
    console.log(`Connected to the company_db databse.`)
);


const initialQuestion = [
    {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            new inquirer.Separator(),
            'add a department',
            'add a role',
            'add an employee',
            new inquirer.Separator(),
            'update an employee role',
            new inquirer.Separator(),
            'quit',
            new inquirer.Separator(),
        ]
    }
]

let addRoleQuestions = [
    {
        name: 'roleName',
        message: 'What is the name of the role?'
    },
    {
        type: 'number',
        name: 'roleSalary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        choices: []
    }
]

let addEmployeeQuestions = [
    {
        name: 'employeeFirstName',
        message: "What is the employee's first name?"
    },
    {
        name: 'employeeLastName',
        message: "What is the employee's last name?"
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: "What is the employee's role?",
        choices: []
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: "Who is the employee's manager?",
        choices: []
    }
]

let updateRoleQuestions = [
    {
        type: 'list',
        name: 'employee',
        message: "Which employee's role do you want to update?",
        choices: []
    },
    {
        type: 'list',
        name: 'role',
        message: 'Which role do you want to assign the selected employee?',
        choices: []
    },

]

const init = () => {
    inquirer
        .prompt(initialQuestion)
        .then((answers) => {
            switch (answers.mainMenu) {
                case 'view all departments':
                    viewDepartments();
                    break;
                case 'view all roles':
                    viewRoles();
                    break;
                case 'view all employees':
                    viewEmployees();
                    break;
                case 'add a department':
                    addDepartment();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update an employee role':
                    updateRole();
                    break;
                case 'quit':
                    console.log('Quitting...');
                    process.exit(1);
            }
        })
        .catch((error) => {
            if (error.isTtyError) {

            } else {

            }
        });
}

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        console.table('All departments', results);
        init();
    });
}

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        console.table('All roles', results);
        init();
    });
}

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        console.table('All employees', results);
        init();
    });
}

const addDepartment = () => {
    inquirer
        .prompt([{
            name: 'departmentName',
            message: 'What is the name of the department?'
        }])
        .then((answers) => {
            const sql = `INSERT INTO department (name)
            VALUES (?)`;
            const params = [answers.departmentName];
            db.query(sql, params, (err, results) => {
                console.log(`Added ${answers.departmentName} to the database.`);
                init();
            });
        })
}

const addRole = () => {
    // adding current, updated departments to the questions
    db.query(`SELECT * FROM department`, (err, results) => {
        let departmentChoices = [];
        for (i = 0; i < results.length; i++) {
            departmentChoices.push(results[i].name);
        }
        addRoleQuestions[2].choices = addRoleQuestions[2].choices.concat(departmentChoices);
    });

    inquirer
        .prompt(addRoleQuestions)
        .then((answers) => {
            db.query(`SELECT * FROM department`, (err, results) => {
                for (i = 0; i < results.length; i++) {
                    if (err) {
                        console.log(err);
                    }
                    if (answers.roleDepartment === results[i].name) {
                        answers.roleDepartment = results[i].id;
                        const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;
                        let params = [answers.roleName, answers.roleSalary, answers.roleDepartment];
                        db.query(sql, params, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`Added ${params} to the database.`);
                            console.log(params);
                            init();
                        });
                    }
                }
            });



        })

}

const addEmployee = () => {
    // adding current list of roles to the addEmployeeQuestions array
    db.query(`SELECT * FROM role`, (err, results) => {
        let roleNames = [];
        for (i = 0; i < results.length; i++) {
            roleNames.push(results[i].title);
        }
        addEmployeeQuestions[2].choices = addEmployeeQuestions[2].choices.concat(roleNames);
    });
    // adding current list of employees to the addEmployeeQuestion array
    db.query(`SELECT * FROM employee`, (err, results) => {
        let managerChoices = [];
        for (i = 0; i < results.length; i++) {
            let fullName = results[i].first_name.concat(` ${results[i].last_name}`);
            managerChoices.push(fullName);
        }
        addEmployeeQuestions[3].choices = addEmployeeQuestions[3].choices.concat(managerChoices);
    });

    // prompt quesstions
    inquirer
        .prompt(addEmployeeQuestions)
        .then((answers) => {
            // retrieve role table
            db.query(`SELECT * FROM role`, (err, results) => {
                for (i = 0; i < results.length; i++) {
                    // if user's selected role === role table's looped title
                    if (answers.employeeRole === results[i].title) {
                        // assign the id value of the role table's looped selected title
                        answers.employeeRole = results[i].id;
                        // retrieve the employee table
                        db.query(`SELECT * FROM employee`, (err, results) => {
                            // loop through to concatenated first and last name
                            for (i = 0; i < results.length; i++) {
                                let fullName = results[i].first_name.concat(` ${results[i].last_name}`);
                                // loop through to see which user choice matches the concatenated name, assigned to "fullName"
                                if (answers.employeeManager === fullName) {
                                    // assign the id value of the employee table's looped selected name to its respective employee ID
                                    answers.employeeManager = results[i].id;
                                    // sql statement to insert a new employee
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                                    const params = [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager]
                                    db.query(sql, params, (err, results) => {
                                        console.log(`Added ${params} to the database.`);
                                        init();
                                    });
                                }
                            }
                        });
                    }
                }
            })
        })
}

const updateRole = () => {
    // adding current list of employees to the addEmployeeQuestion array
    db.query(`SELECT * FROM employee`, (err, results) => {
        let employeeChoices = [];
        for (i = 0; i < results.length; i++) {
            let fullName = results[i].first_name.concat(` ${results[i].last_name}`);
            employeeChoices.push(fullName);
        }
        updateRoleQuestions[0].choices = updateRoleQuestions[0].choices.concat(employeeChoices);
    });

    db.query(`SELECT * FROM role`, (err, results) => {
        let roleNames = [];
        for (i = 0; i < results.length; i++) {
            roleNames.push(results[i].title);
        }
        updateRoleQuestions[1].choices = updateRoleQuestions[1].choices.concat(roleNames);


    inquirer
        .prompt(updateRoleQuestions)
        .then((answers) => {
            db.query(`SELECT * FROM employee`, (err, results) => {
                for (i = 0; i < results.length; i++) {
                    let fullName = results[i].first_name.concat(` ${results[i].last_name}`);
                    if (answers.employee === fullName) {
                        answers.employee = results[i].id;

                        db.query(`SELECT * FROM role`, (err, results) => {
                            for (i = 0; i < results.length; i++) {
                                if (answers.role === results[i].title) {
                                    answers.role = results[i].id;
                                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                                    const params = [answers.role, answers.employee];
                                    db.query(sql, params, (err, result) => {
                                        if (err) {
                                            res.status(400).json({ error: err.message });
                                        }
                                        init();
                                    });
                                }
                            }
                        });
                    }
                }
            });
        })
    });
}

init();