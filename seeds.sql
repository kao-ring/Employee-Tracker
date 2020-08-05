
USE employeesDB;

-- create some data to add to tables above
INSERT INTO department
    (name)
VALUES
    ("Administration"),
    ("Human Resources"),
    ("Accounting"),
    ("Promotion"),
    ("Engineering");

INSERT INTO role
    (title,salary,department_id)
VALUES
    ("CEO", 1000, 1),
    ("Secretary", 150, 1),
    ("HR Representative", 90, 2),
    ("Staff Recruiter", 70, 2),
    ("Accountant", 70, 3),
    ("Financial Analyst", 85, 3),
    ("Representative", 60, 4),
    ("Salesman", 50, 4),
    ("Analyst", 80, 5),
    ("Engineer", 100, 5);

INSERT INTO employee
    (first_name,last_name,role_id,manager_id)
VALUES
    ("James", "Smith", 1),
    ("Patricia", "Johnson", 2, 1),
    ("Robert", "Williams", 2, 1),
    ("Linda", "Brown", 3, 2),
    ("Michael", "Jones", 3, 2),
    ("Barbara", "Garcia", 4, 3),
    ("Richard", "Miller", 4, 3),
    ("Susan", "Davis", 4, 4),
    ("Joseph", "Rodriguez", 5, 5),
    ("Thomas", "Martinez", 5, 5),
    ("Karen", "Lopez", 5, 6),
    ("Dorothy", "Wilson", 4, 4),
    ("Brandon", "Moore", 5, 6),
    ("Keith", "Harris", 4, 3),
    ("Frances", "Thompson", 4, 4),
    ("Kyle", "Martin", 5, 5),
    ("Judith", "Torres", 5, 5),
    ("Zachary", "Hill", 5, 6),
    ("Christina", "Flores", 4, 4),
    ("Jeremy", "Adams", 5, 6);

