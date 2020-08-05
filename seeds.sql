
USE employeesDB;

-- create some data to add to tables above
INSERT INTO department
    (name)
VALUES
    ("Sales"),
    ("Legal"),
    ("Finance"),
    ("Engineering");

INSERT INTO role
    (title,salary,department_id)
VALUES
    ("Sales Lead", 100, 1),
    ("Sales Person", 80, 1),
    ("Legal Team Leader", 250, 2),
    ("Lawyer", 190, 2),
    ("Finance Leader", 150, 3),
    ("Accountant", 125, 3),
    ("Lead Engineer", 150, 4),
    ("Software Engineer", 120, 4);



INSERT INTO employee
    (first_name,last_name,role_id,manager_id)
VALUES
    ("James", "Smith", 1, null),
    ("Patricia", "Johnson", 2, 1),
    ("Robert", "Williams", 3, null),
    ("Linda", "Brown", 4, 3),
    ("Michael", "Jones", 5, null),
    ("Barbara", "Garcia", 6, 5),
    ("Richard", "Miller", 7, null),
    ("Susan", "Davis", 8, 7);

   
