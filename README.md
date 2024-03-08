# swagger-presentation-app
This app is sample project for basic backend and swagger configuration
## Project setup
### .env file
```dotenv
NODE_ENV=development
PORT=5000
MONGO_URI=
API_URL=http://localhost
API_PREFIX=/api/v1
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
DEVELOPMENT_SERVER=http://localhost:5000
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
RESET_TOKEN_SECRET=
```
### How to get MONGO_URI
- Go to MongoDB Atlas
- Create a new cluster
- Create a new database
- Create a new user
- Add the user to the database
- Get the connection string
- Add the connection string to the .env file
- Replace the password with the user's password
### How to get AWS credentials
- Go to AWS Management Console
- Go to IAM
- Create a new user
- Attach the following policies to the user
    - Create a new policy
    - Select PutObject
    - Save the policy
- Get the access key and secret key
- Add the access key and secret key to the .env file
- Add the region to the .env file
- Add the bucket name to the storage.service.js file
### How to get JWT secret
- Open a bash terminal
- Run the following command
    - openssl rand -hex 32
    - Copy the output and add it to the .env file
    - This will be the ACCESS_TOKEN_SECRET
    - Run the command again to get the REFRESH_TOKEN_SECRET
    - Run the command again to get the RESET_TOKEN_SECRET
    - Add the output to the .env file
### Install dependencies
```bash
npm install
```
### Compiles and hot-reloads for development
```bash
npm start
```

