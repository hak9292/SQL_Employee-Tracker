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
// if (answer.first3 char is add) {
// function add(); 
//}

init = () => {
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
    });
    init();
}

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        console.table('All roles', results);
    });
    init();
}

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        console.table('All employees', results);
    });
    init();
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
            });
        })
    init();
}

const addRole = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        console.log(addRoleQuestions[2].choices)
        // if (addRoleQuestions[2].choices.length != 0) {
        //     addRoleQuestions[2].choices.splice(0);
        // }
        console.log(addRoleQuestions[2].choices);
        console.log(results.length);
        // console.log(results[i].name);
        let roleChoices = [];
        
        for (i = 0; i < results.length; i ++) {
            roleChoices.push(results[i].name);
        }
    
    addRoleQuestions[2].choices = addRoleQuestions[2].choices.concat(roleChoices);
    inquirer
        .prompt(addRoleQuestions)
        .then((answers) => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?)`;
            const params = [answers.roleName, answers.roleSalary, answers.roleDepartment]
            db.query(sql, params, (err, results) => {
                console.log(`Added ${params} to the database.`);
            });
        })
    });
}

const addEmployee = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        console.log(addRoleQuestions[2].choices)
        // if (addRoleQuestions[2].choices.length != 0) {
        //     addRoleQuestions[2].choices.splice(0);
        // }
        console.log(addRoleQuestions[2].choices);
        console.log(results.length);
        // console.log(results[i].name);
        let roleChoices = [];
        
        for (i = 0; i < results.length; i ++) {
            roleChoices.push(results[i].name);
        }
    
    addRoleQuestions[2].choices = addRoleQuestions[2].choices.concat(roleChoices);
    inquirer
        .prompt(addRoleQuestions)
        .then((answers) => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?)`;
            const params = [answers.roleName, answers.roleSalary, answers.roleDepartment]
            db.query(sql, params, (err, results) => {
                console.log(`Added ${params} to the database.`);
            });
        })
    });
}

init();

// add
// const addNew = (tableName, tableParams) => {
//     app.post(`/api/new-${tableName}`, ({ body }, res) => {
//         const sql = `INSERT INTO ${tableName} (${tableParams})
//       VALUES (?)`;
//         const params = [body.name];

//         db.query(sql, params, (err, result) => {
//             if (err) {
//                 res.status(400).json({ error: err.message });
//                 return;
//             }
//             res.json({
//                 message: 'success',
//                 data: body
//             });
//         });
//     });
// }

// view

// const viewCurrent = (tableName) => {
//     app.get(`/api/${tableName}`, (req, res) => {
//         const sql = `SELECT * FROM ${tableName}`;

//         db.query(sql, (err, results) => {
//             console.table(`All ${tableName}s`, results)
//         });
//     });
// }

// const viewCurrent = () =>
// fetch(`/api/${tableName}`, {
//     method: 'GET',

// })




init();