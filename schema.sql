DROP DATABASE IF EXISTS fitbud;

CREATE DATABASE fitbud;

USE fitbud;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS postings;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS requests;


CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  imageUrl varchar(300),

  PRIMARY KEY (id)
);


CREATE TABLE postings (
  id INT NOT NULL AUTO_INCREMENT,
  title varchar(50),
  location varchar(255) NOT NULL,
  date DATETIME,
  duration INT NOT NULL,
  details varchar(255) NOT NULL,
  meetup_spot varchar(255) NOT NULL,
  buddies INT NOT NULL,
  userId INT,

  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE profile (
  id INT NOT NULL AUTO_INCREMENT,
  email varchar(255),
  city varchar(255),
  state varchar(40),
  activity varchar(400),
  userId INT,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE requests (
  id INT NOT NULL AUTO_INCREMENT,
  postingId INT,
  userId INT,
  status ENUM('pending', 'accept', 'reject'),

  PRIMARY KEY (id),
  FOREIGN KEY (postingId) REFERENCES postings(id),
  FOREIGN KEY (userId) REFERENCES users(id)

);

CREATE TABLE IF NOT EXISTS `StatusCode` (
    id INT(1),
    Meaning VARCHAR(500),

    PRIMARY KEY (id)
);

INSERT INTO StatusCode (id, Meaning)
VALUES
    (0, 'Pending'),
    (1, 'Accepted'),
    (2, 'Decline'),
    (3, 'Blocked');


CREATE TABLE relationship (
  userOneId INT NOT NULL,
  userTwoId INT NOT NULL, 
  statusId INT NOT NULL,
  actionId INT NOT NULL,
  
  FOREIGN KEY (userOneId) REFERENCES users(id),
  FOREIGN KEY (userTwoId) REFERENCES users(id),
  FOREIGN KEY (actionId) REFERENCES users(id), 
  FOREIGN KEY (statusId) REFERENCES StatusCode(id)
);

select postings.*, users.name from postings inner join users on postings.userId=users.id where postings.id=3;
