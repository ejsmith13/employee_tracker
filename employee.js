const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
let roles = [];
let depts


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
        "Update employee role",
        "Delete employee",
        "Add department",
        "Delete department",
        "Add role",
        "Delete role",
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
          deptChoices();
          setTimeout(() => {
            employeeDept();
          }, 500);
          break;
        case "View employees by role":
          roleChoices();
          setTimeout(() => {
            employeeRole();
          }, 500);
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
        case "Delete employee":
          deleteEmployee();
          break;
        case "Delete role":
          roleChoices();
          setTimeout(() => {
            deleteRole();
          }, 500);
          break;
        case "Delete department":
          deptChoices();
          setTimeout(() => {
            deleteDepartment();
          }, 500);
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
    "role.salary, concat(manager.first_name, ' ', manager.last_name) as manager FROM (((role INNER JOIN department ON department.id =";
  query +=
    "role.department_id) INNER JOIN employee ON employee.role_id = role.id)LEFT JOIN employee manager on manager.id = employee.manager_id);";

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
      choices: depts,
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
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which job role would you like to see?",
        choices: roles,
      },
    ])
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
  roleChoices();
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
        name: "position",
        type: "list",
        message: "What is the employee's position?)",
        choices: roles,
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
    .then(({ first, last, position, manager }) => {
      let newPositionId;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i] === position) {
          newPositionId = i + 1;
        }
      }
      console.log("Inserting a new Employee...\n");
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: first,
          last_name: last,
          role_id: newPositionId,
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
  roleChoices();
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
        name: "newRole",
        type: "list",
        message: "Please choose the role:",
        choices: roles,
        when: (answer) => answer.roleQ === false,
      },
    ])
    .then(({ id, roleQ, roleID, newRole }) => {
      let newRoleId;
      if (roleQ === true) {
        newRoleId = roleID;
      } else {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i] === newRole) {
            newRoleId = i + 1;
          }
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

const deleteEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employeeID",
        message: "What is the id of the employee you would like to delete?",
        type: "input",
      },
    ])
    .then(({ employeeID }) => {
      connection.query(
        "DELETE FROM employee WHERE ?",
        {
          id: employeeID,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee deleted!\n`);
          // Call readProducts AFTER the DELETE completes
          initialPrompt();
        }
      );
    });
};

const deleteRole = () => {
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which job role would you like to delete?",
        choices: roles,
      },
    ])
    .then(({ role }) => {
      connection.query(
        "DELETE FROM role WHERE ?",
        {
          title: role,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`\n ${res.affectedRows} role deleted!\n`);
          // Call readProducts AFTER the DELETE completes
          initialPrompt();
        }
      );
    });
};

const deleteDepartment = () => {
  inquirer
    .prompt([
      {
        name: "dept",
        type: "list",
        message: "Which Department would you like to delete?",
        choices: depts,
      },
    ])
    .then(({ dept }) => {
      connection.query(
        "DELETE FROM department WHERE ?",
        {
          department: dept,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`\n ${res.affectedRows} department deleted!\n`);
          // Call readProducts AFTER the DELETE completes
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

const roleChoices = () => {
  roles = [];
  connection.query("Select role.title From role", (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
  });
};

const deptChoices = () => {
  depts = [];
  connection.query("Select department.department From department", (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      depts.push(res[i].department);
    }
  });
};
