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
        "View departments",
        "View roles and salaries",
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
        case "View departments":
          viewDept();
          break;
        case "View roles and salaries":
          viewRole();
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
          addDept();
          break;
        case "Add role":
          addRole();
          break;
        case "Update employee role":
          updateEmployee();
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

const viewDept = () => {
  console.log("\n Selecting all Departments...\n");

  let query = "SELECT * from department";

  connection.query(query, (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res);
    console.log(table);
    initialPrompt();
  });
};

const viewRole = () => {
  console.log("\n Selecting all Roles...\n");

  let query =
    "SELECT role.id, role.title, role.salary, department.department FROM role ";
  query +=
    "INNER JOIN department ON department.id = role.department_id ORDER BY department.department, role.title";

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

const addDept = () => {
  inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "What is the name of the department you are adding?",
      },
    ])
    .then(({ dept }) => {
      console.log("Inserting a new Department...\n");
      connection.query(
        "INSERT INTO department SET ?",
        {
          department: dept,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department inserted!\n`);

          initialPrompt();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "dept",
        type: "confirm",
        message: "Does this role belong in an already existing Department?",
      },
    ])
    .then(({ dept }) => {
      if (dept === false) {
        console.log(
          "\n Please add the appropriate Department first \n ------------------------------------------------------\n "
        );
        addDept();
      } else {
        inquirer
          .prompt([
            {
              name: "role",
              type: "input",
              message: "What role are you adding?",
            },
            {
              name: "pay",
              type: "input",
              message: "What is the yearly salary?",
            },
            {
              name: "dept",
              type: "input",
              message: "What is the department id for this role?",
            },
          ])
          .then(({ role, pay, dept }) => {
            console.log("Inserting a new Role...\n");
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: role,
                salary: pay,
                department_id: dept,
              },
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} role inserted!\n`);

                initialPrompt();
              }
            );
          });
      }
    });
};

const updateEmployee = () => {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message:
          "Please enter employee id of the person you would like to update:",
      },
      {
        name: "roleQ",
        type: "confirm",
        message: "Do you know the role ID of the employees new job?",
      },
      {
        name: "roleID",
        type: "input",
        message: "Enter the NEW role ID:",
        when: (answer) => answer.roleQ === true,
      },
      {
        name: "roles",
        type: "list",
        message: "Please choose the role:",
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
        when: (answer) => answer.roleQ === false,
      },
    ])
    .then(({ id, roleQ, roleID, roles }) => {
      let newRoleId;
      if (roleQ === true) {
        newRoleId = roleID;
      } else {
        switch (roles) {
          case "Sales Associate":
            newRoleId = "1";
            break;
          case "Reservation Specialist":
            newRoleId = "2";
            break;
          case "Sales Manager":
            newRoleId = "3";
            break;
          case "HR Specialist":
            newRoleId = "4";
            break;
          case "Recruiter":
            newRoleId = "5";
            break;
          case "Director of HR":
            newRoleId = "6";
            break;
          case "Front Desk Associates":
            newRoleId = "7";
            break;
          case "Bellman":
            newRoleId = "8";
            break;
          case "Night Auditor":
            newRoleId = "9";
            break;
          case "Front Desk Manager":
            newRoleId = "10";
            break;
          case "Maintanence Director":
            newRoleId = "11";
            break;
          case "Engineer":
            newRoleId = "12";
            break;
          case "Director of House Keeping":
            newRoleId = "13";
            break;
          case "House Keeper":
            newRoleId = "14";
            break;
          case "House Man":
            newRoleId = "15";
            break;
          default:
            console.log("ERROR\nTry again");
            updateEmployee();
        }
      }

      console.log("\nUpdating Employee Role...\n");
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: newRoleId,
          },
          {
            id: id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Employee updated!\n`);
          // Call deleteProduct AFTER the UPDATE completes
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
