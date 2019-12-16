// Cited: week 12 class activites

// Initializes npm packages

// "mysql": node.js driver for mysql
let mysql = require("mysql");

//"inquirer": command line interface for Node.js 
let inquirer = require("inquirer");

//"console-table-printer": printing table on console
const {
  printTable
} = require("console-table-printer");

// Creats MySQL connection
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "xqjiji200",
  database: "bamazon"
});

// Initializes the connection. Connects with the server. If it fails, throw error, if succeeds, print the product date table
connection.connect(function (err) {
  if (err) throw err
  console.log("Welcome to Bamazon! This Week's Featured Products.");
  seeProductTable();
});

//printProductTable function 
function seeProductTable() {
  //connect the MySQL products table from the database, selects all of the data from the products table 
  connection.query("SELECT * FROM products", function (err, response) {
    if (err) throw err;
    // Cited: https://www.npmjs.com/package/console-table-printer
    // Prints the table data to the console
    printTable(response);
    askItemId(response);
  });
}

// Ask the customer for the Item ID that they'd like to purchase
function askItemId(stock_inventory) {
  inquirer
    .prompt([{
      name: "userchoice",
      type: "input",
      message: "What is the ID number of the item you'd like?",
    }])
    .then(function (value) {
      let userchoice_itemId = parseInt(value.userchoice);
      // Checks stock inventory
      function checkInventory(userchoice_itemId, stock_inventory) {
        for (var i = 0; i < stock_inventory.length; i++) {
          if (stock_inventory[i].id === userchoice_itemId) {
            // If the product is found, return the product
            return stock_inventory[i];
          } else {}
        }
      }
      askQuantity(checkInventory(userchoice_itemId, stock_inventory));
    });
}

// Ask the customer for a product quantity
function askQuantity(product) {
  inquirer
    .prompt([{
      name: "orderedquantity",
      type: "input",
      message: "How many would you like to order?",
    }])
    .then(function (answer) {
      let price = parseInt(answer.price);
      let orderedquantityNum = parseInt(answer.orderedquantity);


      // If not enough quantity, console.log("Sorry, insufficient quantity!")
      if (product.stock_quantity < orderedquantityNum) {
        console.log("\nSorry, insufficient quantity!");
        printProducts();
      } else {
        // Otherwise run buyItem
        buyItem(product, orderedquantityNum);
      }
    });
}

// Buy item functiton
function buyItem(product, orderedquantityNum) {
  connection.query(
    "UPDATE products SET stock_quantity = ? WHERE id = ?",
    [product.stock_quantity - orderedquantityNum, product.id],
    function (err, res) {
      console.log("\n*** Thanks for Ordering The " + product.department_name + ", " + product.product_name + " ! ***\n");
      console.log("Total Cost: $" + (product.price) + " X " + orderedquantityNum + " = $" + (product.price) * orderedquantityNum + "\n");
      console.log("Keep Shopping!")
      seeProductTable();
    }
  );
}