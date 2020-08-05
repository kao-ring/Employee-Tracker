var mysql = require("mysql");
const inquirer = require("inquirer");
const password = require("./password.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: password,
  database: "employeesDB",
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      type: "list",
      name: "action",
      choices: ["View", "Add", "Update", "Delete", "Exit"],
    })
    .then((res) => {
      switch (res.action) {
        case "View":
          inquirer
            .prompt({
              message: "What would you like to view?",
              type: "list",
              name: "view",
              choices: [
                "All Departments",
                "All Roles",
                "All Employees",
                "Employees by Manager",
                "View the total utilized budget by departments",
              ],
            })
            .then((res) => {
              console.log(res);
              switch (res.view) {
                case "All Departments":
                  viewDep();
                  break;
                case "All Roles":
                  viewRole();
                  break;
                case "All Employees":
                  viewEmployees();
                  break;
                case "Employees by Manager":
                  viewEmpByMng();
                  break;
                case "View the total utilized budget by departments":
                  viewBudget();
                  break;
                default:
                  break;
              }
            });

          break;

        case "Add":
          inquirer
            .prompt({
              message: "What would you like to add?",
              type: "list",
              name: "add",
              choices: ["Department", "Roles", "Employees"],
            })
            .then((res) => {
              switch (res.add) {
                case "Department":
                  addDep();
                  break;
                case "Roles":
                  addRole();
                  break;
                case "Employees":
                  addEmp();
                  break;
                default:
                  break;
              }
            });
          break;

        case "Update":
          inquirer
            .prompt({
              message: "What would you like to update?",
              type: "list",
              name: "update",
              choices: ["Employee's Role", "Employee's Manager"],
            })
            .then((res) => {
              switch (res.update) {
                case "Employee Roles":
                  updEmpRole();
                  break;
                case "Employee Managers":
                  updEmpMng();
                  break;
                default:
                  break;
              }
            });
          break;

        case "Delete":
          inquirer
            .prompt({
              message: "What would you like to delete?",
              type: "list",
              name: "delete",
              choices: ["Department", "Role", "Employee"],
            })
            .then((res) => {
              switch (res.delete) {
                case "Delete Department":
                  dltDep();
                  break;
                case "Delete Role":
                  dltRole();
                  break;
                case "Delete Employee":
                  dltEmp();
                  break;
                default:
                  break;
              }
            });
          break;

        case "Exit":
          exit();
          break;

        default:
          break;
      }
    });
}

function viewDep() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewEmpByMng() {
  inquirer
    .prompt({
      message: "Type manager's ID number",
      type: "type",
      name: "id",
    })
    .then((res) => {
      connection.query(
        "SELECT * FROM employee WHERE manager_id = ?",
        [res.id],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        }
      );
    });
}

function exit() {
  console.log("-*-*- Connection End (;´༎ຶٹ༎ຶ`) -*-*-\n");
  connection.end();
}
