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
      choices: ["View all employees", "View employees by department", "Exit"],
    })
    .then(({ first }) => {
      console.log(`response: ${first}`);
      switch (first) {
        case "View all employees":
          readProducts();
          break;
        case "View employees by department":
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
const readProducts = () => {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res);
    console.log(table);
    initialPrompt();
  });
};

const comingSoon = () => {
  console.log("-------------------------- \n");
  console.log("Coming Soon \n");
  console.log("-------------------------- \n");
  initialPrompt();
};
