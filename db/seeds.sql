INSERT INTO department (name)
VALUES ('Sales'),
       ('Legal'),
       ('Finance'),
       ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 4),
       ('Software Engineer', 120000, 4),
       ('Account Manager', 160000, 3),
       ('Accountant', 125000, 3),
       ('Legal Team Lead', 250000, 2),
       ('Lawyer', 190000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Zeus', 'Goose', 7, null),
       ('Poseidon', 'Biden', 8, 1),
       ('Ares', 'Marries', 8, 1),
       ('Aphrodite', 'Mighty', 5, null),
       ('Hera', 'Terra', 6, 4),
       ('Demeter', 'Parkingmeter', 6, 4),
       ('Athena', 'Tina', 3, null),
       ('Apollo', 'Follow', 4, 7),
       ('Artemis', 'Bliss', 4, 7),
       ('Hephaestus', 'Bus', 1, null),
       ('Hermes', 'Burmese', 2, 10),
       ('Dionysus', 'Yeezus', 2, 10);