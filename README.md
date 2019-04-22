# Kiper

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

*POST* `/users/` - Creates a user to use the application
Request parameters:
```json
{
  "username": "yago",
  "password": "123123"
}
```
Returns the created user.

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
