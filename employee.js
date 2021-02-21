const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "",
  database: "tracker_db",
});

// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  startScreen();
});

const startScreen = () => {
  console.log("EMPLOYEE MANAGER SYSTEM");
  initialPrompt();
};

const initialPrompt = () => {
  inquirer
    .prompt({
      name: "first",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View all employees",
        "View employees by department",
        "View employees by role",
        "Add employee",
        "Add department",
        "Add role",
        "Update employee role",
        "Exit",
      ],
    })
    .then(({ first }) => {
      console.log(`response: ${first}`);
      switch (first) {
        case "View all employees":
          viewEmployees();
          break;
        case "View employees by department":
          employeeDept();
          break;
        case "View employees by role":
          employeeRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add department":
          comingSoon();
          break;
        case "Add role":
          comingSoon();
          break;
        case "Update employee role":
          comingSoon();
          break;
        case "Exit":
          console.log("Goodbye");
          connection.end();
          break;
        default:
          console.log("Please make a selection");
          initialPrompt();
      }
    });
};
const viewEmployees = () => {
  console.log("Selecting all employees...\n");

  let query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department,";
  query +=
    "role.salary, employee.manager_id FROM ((role INNER JOIN department ON department.id =";
  query +=
    "role.department_id) INNER JOIN employee ON employee.role_id = role.id);";

  connection.query(query, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res);
    console.log(table);
    initialPrompt();
  });
};

const employeeDept = () => {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to see?",
      choices: [
        "Reservations",
        "Human Resources",
        "Front Desk",
        "Facilities",
        "House Keeping",
      ],
    })
    .then(({ department }) => {
      console.log(`You chose: ${department}`);

      let query =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department,";
      query +=
        "role.salary, employee.manager_id FROM ((role INNER JOIN department ON department.id =";
      query +=
        "role.department_id) INNER JOIN employee ON employee.role_id = role.id) WHERE (department.department = ?);";

      connection.query(query, department, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        const table = cTable.getTable(res);
        console.log(table);
        initialPrompt();
      });
    });
};

const employeeRole = () => {
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Which job role would you like to see?",
      choices: [
        "Sales Associate",
        "Reservation Specialist",
        "Sales Manager",
        "HR Specialist",
        "Recruiter",
        "Director of HR",
        "Front Desk Associates",
        "Bellman",
        "Night Auditor",
        "Front Desk Manager",
        "Maintanence Director",
        "Engineer",
        "Director of House Keeping",
        "House Keeper",
        "House Man",
      ],
    })
    .then(({ role }) => {
      console.log(`You chose: ${role}`);

      let query =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department,";
      query +=
        "role.salary, employee.manager_id FROM ((role INNER JOIN department ON department.id =";
      query +=
        "role.department_id) INNER JOIN employee ON employee.role_id = role.id) WHERE (role.title = ?);";

      connection.query(query, role, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        const table = cTable.getTable(res);
        console.log(table);
        initialPrompt();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "input",
        message: "What is the employee's role id? (1-15)",
      },
      {
        name: "managerConfirm",
        type: "confirm",
        message: "Does the employee have a manager?",
      },
      {
        name: "manager",
        type: "input",
        message: "Whate is the manager's id?",
        when: (answers) => answers.managerConfirm === true,
      },
    ])
    .then(({ first, last, role, manager }) => {
      console.log("Inserting a new Employee...\n");
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: first,
          last_name: last,
          role_id: role,
          manager_id: manager,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee inserted!\n`);
          
          initialPrompt();
        }
      );
    });

  

};

const comingSoon = () => {
  console.log("\n-------------------------- \n");
  console.log("Coming Soon, please make another choice. \n");
  console.log("-------------------------- \n");
  initialPrompt();
};
