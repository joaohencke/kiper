# Kiper


## Requirements
- [NodeJS](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/) mongod server running on port `27017``

## Installing dependencies
```bash
npm install
``` 

## Running
```bash
npm start
```

This will start express on port 8888. The api's will be avaiable at `http://localhost:8888/api`

## API's

*POST* `/users` - Creates a user to use the application

Request parameters:
```json
{
  "username": "yago",
  "password": "123123"
}
```
Returns the created user.

*GET* `/users` - List all users created on database

*POST* `/auth/token` - Authenticate user by password or refresh token

Request Parameters:
```json
{
	"username": "yago",
	"password": "123123",
	"client_id": "5cb63d828ab85bebe7527f13",
	"client_secret": "kiper",
	"grant_type": "password"
}
```
Or (By refresh_token)
```json
{
	"refresh_token": "56e7f0ccfd22ab02eb44b1a0452539f2450d60ae",
	"client_id": "5cb63d828ab85bebe7527f13",
	"client_secret": "kiper",
	"grant_type": "refresh_token"
}
```
Response Body:
```json
{
    "access_token": "84f87ae7c71563dfb95e8df4f2b8e2562724e329",
    "token_type": "Bearer",
    "expires_in": 3599,
    "refresh_token": "82a8b756638a9273aa69d0b5f4492a7444564b15"
}
```

The access token received must be placed on the Request Header `Authorization: ${token_type} ${access_token}` of the next requests.

*POST* `/residents` - Creates a new Resident

Request Body Parameters
```javascript
{
    name: 'string',
    email: 'string & email',
    cpf: struct.optional('cpf'),
    apartment: 'numeric',
    block: struct.enum(['A', 'B', 'C']),
  }
```

*PUT* `/residents/:id` - Updates an existing Resident

Request Body Parameters
```javascript
{
    name: 'string',
    email: 'string & email',
    cpf: struct.optional('cpf'),
    apartment: 'numeric',
    block: struct.enum(['A', 'B', 'C']),
  }
```

*DELETE* `/residents/:id` - Removes an existing Resident from database

*GET* `/residents`- List residents - they can be filtered

Request QueryString Parameters
```javascript
{
    name: struct.optional('string'),
    email: struct.optional('string'),
    cpf: struct.optional('string'),
    apartment: struct.optional('numeric'),
    block: struct.optional(struct.enum(['A', 'B', 'C'])),
    page: struct.optional('numeric'),
    limit: struct.optional('numeric'),
  }
  ```
