var mysql = require("mysql");
const inquirer = require("inquirer");
// const password = require("./password.js");
const util = require("util");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeesDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(
    "\x1b[31m",
    "\x1b[40m",
    `


    .########.##.....##.########..##........#######..##....##.########.########...
    .##.......###...###.##.....##.##.......##.....##..##..##..##.......##.........
    .##.......####.####.##.....##.##.......##.....##...####...##.......##.........
    .######...##.###.##.########..##.......##.....##....##....######...######.....
    .##.......##.....##.##........##.......##.....##....##....##.......##.........
    .##.......##.....##.##........##.......##.....##....##....##.......##.........
    .########.##.....##.##........########..#######.....##....########.########...
    .########.########.....###.....######..##....##.########.########.            
    ....##....##.....##...##.##...##....##.##...##..##.......##.....##            
    ....##....##.....##..##...##..##.......##..##...##.......##.....##            
    ....##....########..##.....##.##.......#####....######...########.            
    ....##....##...##...#########.##.......##..##...##.......##...##..            
    ....##....##....##..##.....##.##....##.##...##..##.......##....##.            
    ....##....##.....##.##.....##..######..##....##.########.##.....##                                                                                      
    `
  );
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
              // console.log(res);
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
          update();

          break;

        case "Delete":
          dlt();
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
  connection.query(
    "SELECT department.name AS Department, SUM(role.salary) AS Total_Budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id GROUP BY department.name",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function viewRole() {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function viewEmployees() {
  connection.query(
    "SELECT  employee.id, CONCAT(employee.first_name,' ', employee.last_name) AS employee_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager FROM employee  LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id  LEFT JOIN employee manager ON employee.manager_id = manager.id",
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
        // console.table(res);
        connection.query(
          ` SELECT CONCAT(manager.first_name,' ', manager.last_name) AS manager, employee.id, CONCAT(employee.first_name,' ', employee.last_name) AS employee_name, role.title, role.salary, department.name AS department FROM employee  LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id  LEFT JOIN employee manager ON employee.manager_id = manager.id
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
        // console.table(res);
        connection.query(
          `SELECT department.name AS Department, employee.id, CONCAT(employee.first_name,' ', employee.last_name) AS employee_name, role.title AS Role FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ${res.dep};`,
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

async function update() {
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
      choices: mngArray,
    },
    {
      message: "What would you like to change?",
      type: "list",
      name: "role",
      choices: ["This employee's Manger", "This employee's Role"],
    },
  ];

  inquirer.prompt(questions).then((res) => {
    var empID = res.emp; //Selected employee's ID is HERE!!!!!

    if (res.role === "This employee's Manger") {
      inquirer
        .prompt({
          message: "Who would be a new manager?",
          type: "list",
          name: "emp",
          choices: mngArray,
        })
        .then((res) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [{ manager_id: res.emp }, { id: empID }],
            function (err, res) {
              if (err) throw err;
              console.log("-*-*- Manager changed -*-*-\n");
              start();
            }
          );
        });
    } else if (res.role === "This employee's Role") {
      inquirer
        .prompt({
          message: "What is new role?",
          type: "list",
          name: "role",
          choices: roleArray,
        })
        .then((res) => {
          // console.log(res);
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [{ role_id: res.role }, { id: empID }],
            function (err, res) {
              if (err) throw err;
              console.log("-*-*- Role changed -*-*-\n");
              start();
            }
          );
        });
    }
  });
}

async function dlt() {
  //employee list
  const mngArray = [];
  const resMng = await connection.queryAsync(
    "SELECT first_name, last_name, id FROM employee"
  );
  for (var i = 0; i < resMng.length; i++) {
    mngArray.push({
      name: resMng[i].first_name + " " + resMng[i].last_name,
      value: resMng[i].id,
    });
  }
  //roll list
  const roleArray = [];
  const resRole = await connection.queryAsync("SELECT  title, id FROM role");
  for (var i = 0; i < resRole.length; i++) {
    roleArray.push({
      name: resRole[i].title,
      value: resRole[i].id,
    });
  }

  //department list
  const depArray = [];
  const resDep = await connection.queryAsync("SELECT name, id FROM department");
  for (var i = 0; i < resDep.length; i++) {
    depArray.push({
      name: resDep[i].name,
      value: resDep[i].id,
    });
  }

  //what to delete?
  inquirer
    .prompt({
      message: "What would you like to delete?",
      type: "list",
      name: "delete",
      choices: ["Department", "Role", "Employee"],
    })
    .then((res) => {
      switch (res.delete) {
        case "Department":
          dltDep();
          break;
        case "Role":
          dltRole();
          break;
        case "Employee":
          dltEmp();
          break;
        default:
          break;
      }
    });

  //delete function library...
  function dltDep() {
    inquirer
      .prompt({
        message: "Which department would you like to delete?",
        type: "list",
        name: "dlt",
        choices: depArray,
      })
      .then((res) => {
        connection.query(
          "DELETE FROM department WHERE ?",
          { id: res.dlt },
          function (err, res) {
            if (err) throw err;
            console.log("-*-*- Delete department success! -*-*-\n");
            start();
          }
        );
      });
  }

  function dltRole() {
    inquirer
      .prompt({
        message: "Which role would you like to delete?",
        type: "list",
        name: "dlt",
        choices: roleArray,
      })
      .then((res) => {
        connection.query("DELETE FROM role WHERE ?", { id: res.dlt }, function (
          err,
          res
        ) {
          if (err) throw err;
          console.log("-*-*- Delete role success! -*-*-");
          start();
        });
      });
  }

  function dltEmp() {
    inquirer
      .prompt({
        message: "Who would you like to delete?",
        type: "list",
        name: "dlt",
        choices: mngArray,
      })
      .then((res) => {
        connection.query(
          "DELETE FROM employee WHERE ?",
          { id: res.dlt },
          function (err, res) {
            if (err) throw err;
            console.log("-*-*- Delete employee success! -*-*-");
            start();
          }
        );
      });
  }
}

//exit=====================================
function exit() {
  console.log("-*-*- Connection End (;´༎ຶٹ༎ຶ`) -*-*-\n");
  connection.end();
}
