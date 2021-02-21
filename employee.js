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

const readProducts = () => {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res);
    console.log(table);
    connection.end();
  });
};

//   const deleteProduct = () => {
//     console.log('Deleting all songs by The rolling stones...\n');
//     connection.query(
//       'DELETE FROM music WHERE ?',
//       {
//         Artist: 'The Rolling Stones',
//       },
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} products deleted!\n`);
//         // Call readProducts AFTER the DELETE completes
//         readProducts();
//       }
//     );
//   };

//   const updateProduct = () => {
//     console.log('Updating artists...\n');
//     const query = connection.query(
//       'UPDATE music SET ? WHERE ?',
//       [
//         {
//           Artist: "Chris Cornell",
//         },
//         {
//           Title: 'Yesterday',
//         },
//       ],
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} products updated!\n`);
//         // Call deleteProduct AFTER the UPDATE completes
//         deleteProduct();
//       }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
//   };

//   const createProduct = () => {
//     console.log('Inserting a new product...\n');
//     const query = connection.query(
//       'INSERT INTO music SET ?',
//       {
//         Title: 'Dancing in the Moonlight',
//         Artist: "Jubel",
//         Genre: "Dance",
//       },
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} product inserted!\n`);
//         // Call updateProduct AFTER the INSERT completes
//         updateProduct();
//       }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
//   };

// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  readProducts();
});
