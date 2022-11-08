
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# NodeJS MVC APIs

The basic aim of this project is to built basic MVC based restful APIs.

## Features

- Built on [NodeJS](https://github.com/nodejs/node)
- Uses [MongoDB](https://github.com/mongodb/mongo) database
- Authentication and Authorization through middlewares
- Uses [jsonwebtoken](https://github.com/nodemailer/nodemailer) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) for token
- Uses [Nodemailer](https://github.com/nodemailer/nodemailer) for password reset through email
- CRUD (Create, Read, Update) to manage Users through REST APIs
- Models are defined for individual dabase case
- Seeders are defined to seed the databse


## Installation

Clone the project through:

```bash
git clone https://github.com/AbdullahDev0/NodeJS-MVC.git
```

Install project with npm

```bash
  cd NodeJS-MVC
  npm Install
```

Set .env variables

- DB_CONNECT, set DB URL
- HOST, set email host
- USER, set email address
- PASS, set email password
- SERVICE, set email service
- MAIL_PORT, set email port
- TOKEN_SECRET, set token secret
- BASE_URL, set base URL where project will run e.g. http://localhost:4000/api

Now to run the project
- ```npm run migrations``` to seed the database
- ```npm start``` to start the server in normal mode
- ```npm run server``` to start server with nodemon
