var mysql = require("mysql");
const inquirer = require("inquirer");
const password = require("./password.js");
const util = require("util");

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

connection.queryAsync = util.promisify(connection.query);

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
                "All Employees",
                "Employees by Manager",
                "Employees by Department",
                "Departments List",
                "Roles List",
              ],
            })
            .then((res) => {
              console.log(res);
              switch (res.view) {
                case "Departments List":
                  viewDep();
                  break;
                case "Roles List":
                  viewRole();
                  break;
                case "All Employees":
                  viewEmployees();
                  break;
                case "Employees by Manager":
                  viewEmpByMng();
                  break;
                case "Employees by Department":
                  viewEmpByDep();
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
  connection.query(
    "SELECT  employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee  LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id  LEFT JOIN employee manager ON employee.manager_id = manager.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function viewEmpByMng() {
  var mngArray = [];
  connection.query("SELECT  first_name, last_name, id FROM employee", function (
    err,
    res
  ) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      mngArray.push({
        name: res[i].first_name + " " + res[i].last_name,
        value: res[i].id,
      });
    }
    inquirer
      .prompt({
        message: "Which manager you would like to view?",
        type: "list",
        name: "mng",
        choices: mngArray,
      })
      .then((res) => {
        console.table(res);
        connection.query(
          ` SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee  LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id  LEFT JOIN employee manager ON employee.manager_id = manager.id
          WHERE employee.manager_id = ${res.mng}`,
          function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
          }
        );
      });
  });
}

function viewEmpByDep() {
  var depArray = [];
  connection.query("SELECT  * FROM department", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      depArray.push({
        name: res[i].name,
        value: res[i].id,
      });
    }
    inquirer
      .prompt({
        message: "Which department would you like to view?",
        type: "list",
        name: "dep",
        choices: depArray,
      })
      .then((res) => {
        console.table(res);
        connection.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ${res.dep};`,
          function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
          }
        );
      });
  });
}

function addDep() {
  inquirer
    .prompt({
      message: "Type a new department name",
      type: "type",
      name: "name",
    })
    .then((res) => {
      connection.query(
        "INSERT INTO department SET ?",
        { name: res.name },
        function (err, res) {
          if (err) throw err;
          console.log(
            "-*-*- New department is added to ID #" + res.insertId + "  -*-*-\n"
          );
          start();
        }
      );
    });
}

function addRole() {
  var depArray = [];

  connection.query("SELECT  * FROM department", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      depArray.push({
        name: res[i].name,
        value: res[i].id,
      });
    }

    const questions = [
      {
        message: "Type a new title name",
        type: "type",
        name: "title",
      },
      {
        message: "What is the salary for this role?",
        type: "type",
        name: "salary",
      },
      {
        message: "Which department is this role in?",
        type: "list",
        name: "department_id",
        choices: depArray,
      },
    ];
    inquirer.prompt(questions).then((res) => {
      console.log(res);
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: res.title,
          salary: res.salary,
          department_id: res.department_id,
        },
        function (err, res) {
          if (err) throw err;
          console.log("-*-*- New role is added -*-*-\n");
          start();
        }
      );
    });
  });
}

async function addEmp() {
  const roleArray = [];
  const resRole = await connection.queryAsync("SELECT  title, id FROM role");
  for (var i = 0; i < resRole.length; i++) {
    roleArray.push({
      name: resRole[i].title,
      value: resRole[i].id,
    });
  }

  const mngArray = [];
  const resMng = await connection.queryAsync(
    "SELECT  first_name, last_name, id FROM employee"
  );
  for (var i = 0; i < resMng.length; i++) {
    mngArray.push({
      name: resMng[i].first_name + " " + resMng[i].last_name,
      value: resMng[i].id,
    });
  }

  const questions = [
    {
      message: "Fisrt name?",
      type: "type",
      name: "first_name",
    },
    {
      message: "Last name?",
      type: "type",
      name: "last_name",
    },
    {
      message: "What is this employee's role?",
      type: "list",
      name: "role_id",
      choices: roleArray,
    },
    {
      message: "Who is this employee's manager?",
      type: "list",
      name: "manager_id",
      choices: mngArray,
    },
  ];
  inquirer.prompt(questions).then((res) => {
    console.log(res);
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: res.first_name,
        last_name: res.last_name,
        role_id: res.role_id,
        manager_id: res.manager_id,
      },
      function (err, res) {
        if (err) throw err;
        console.log("-*-*- New employee is added -*-*-\n");
        start();
      }
    );
  });
}

async function updEmpRole() {
  const empArray = [];
  const resEmp = await connection.queryAsync(
    "SELECT  first_name, last_name, id FROM employee"
  );
  for (var i = 0; i < resEmp.length; i++) {
    empArray.push({
      first_name: resEmp[i].first_name,
      last_name: resEmp[i].last_name,
      value: resEmp[i].id,
    });
  }

  const roleArray = [];
  const resRole = await connection.queryAsync("SELECT  title, id FROM role");
  for (var i = 0; i < resRole.length; i++) {
    roleArray.push({
      name: resRole[i].title,
      value: resRole[i].id,
    });
  }

  const questions = [
    {
      message: "Who would you like to update?",
      type: "list",
      name: "emp",
      choices: empArray,
    },
    {
      message: "What is this employee's new role?",
      type: "list",
      name: "role",
      choices: roleArray,
    },
  ];
}

//exit=====================================
function exit() {
  console.log("-*-*- Connection End (;´༎ຶٹ༎ຶ`) -*-*-\n");
  connection.end();
}
