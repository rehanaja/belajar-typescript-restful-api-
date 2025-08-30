# User API Spec

## Register User

Endpoint: POST /api/users

Request Body :

```json
{
  "username": "raihan",
  "password": "rahasia",
  "name": "Muhamad Raihan"
}
```

Response Body (Succes) :

```json
{
  "data": {
    "username": "raihan",
    "name": "Muhamad Raihan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must no blank, ...."
}
```

## Login User

Endpoint: POST /api/users/login

Request Body :

```json
{
  "username": "raihan",
  "password": "rahasia"
}
```

Response Body (Succes) :

```json
{
  "data": {
    "username": "raihan",
    "name": "Muhamad Raihan",
    "token": "uuid"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username or Password Wrong"
}
```

## Get User

Endpoint: GET /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Succes) :

```json
{
  "data": {
    "username": "raihan",
    "name": "Muhamad Raihan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ...."
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "password": "rahasia", // tidak wajib
  "name": "Muhamad Raihan" // tidak wajib
}
```

Response Body (Succes) :

```json
{
  "data": {
    "username": "raihan",
    "name": "Muhamad Raihan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ...."
}
```

## Logout User

Endpoint: DELETE /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Succes) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ...."
}
```
