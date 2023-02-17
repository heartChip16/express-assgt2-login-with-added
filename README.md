Passwords can be found in data > login.json
2 users are already registered


"username": "ingrid_ibe",
"password": "11111111"


"username": "ingrid2023",
"password": "22222222"



++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
For the API
We can try to login through api, just to use or test REST API.
In postman: 
We create a post request
POST:  http://localhost:3000/login/api

And JSON data is: 
{
    "username": "ingrid2023",
    "password": "22222220",
    "type": "Login"
}

Click SEND, the output should be error msg since password is incorrect: 
[
    {
        "msg": "Incorrect username or password!"
    }
]


ANOTHER TRY, with correct password: 
POST: http://localhost:3000/login/api
JSON data sent: 
{
    "username": "ingrid2023",
    "password": "22222222",
    "type": "Login"
}

Click SEND, the output should be a successful login message: 
{
    "successMessage": "Successfull logged in with username: ingrid2023."
}

