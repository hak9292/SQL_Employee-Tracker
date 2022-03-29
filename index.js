const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'db_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


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
            'quit'
        ]
    }
]

// if (answer.first3 char is add) {
// function add(); 
//}

function add(answers) {

}

inquirer
    .prompt(initialQuestion)
    .then((answers) => {
        switch (answers) {
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
            default:
                console.log('Quitting...');
        }
    })
    .catch((error) => {
        if (error.isTtyError) {

        } else {

        }
    });

pool.query("SELECT field FROM atable", (err, rows, fields => {
    // insert code here
}))