# Lunchinator 5000

## Description

This is a simple coding challenge given to me as part of an interview regarding Node.js.

Summary: write an API that allows clients to vote on where they're going to go eat lunch today.

## Challenge Specs

* [https://interview-project-17987.herokuapp.com/backend-software-engineer-test](https://interview-project-17987.herokuapp.com/backend-software-engineer-test)

## Getting Started

1. Clone this repo.
1. Open a terminal application--such as powershell in a Windows OS.
1. In the local repository's root directory run git pull to get latest. (in case there have been some changes since last you cloned this repo)
1. Run npm install in the local repository's root directory.
1. Run node server.js to start the application in development mode. Run node server.js --production to run the application in production mode.

## Components

1. Node.js - Server-side Scripting
1. Express - Server Module for Node.js

## Dependencies

* npm - the `package.json` file lists all of the npm dependencies

## Endpoints

### /api/create-ballot

POST
http://localhost:3131/api/create-ballot/

``` json
{
    "endTime": "3/20/18 11:45",
    "voters": [
        {
           "name":"Bob",
           "emailAddress": "bob@gmail.com"
        }, {
           "name":"Jim",
           "emailAddress": "jim@gmail.com"
        }
    ]

}
```

### /api/ballot/:ballotId

GET
http://localhost:3131/api/ballot/bfe8e9f7-2626-4851-8fde-581e5bdcd755

### /api/ballots

GET
http://localhost:3131/api/ballots

### /api/vote

POST
http://localhost:3131/api/ballot/bfe8e9f7-2626-4851-8fde-581e5bdcd755

``` json
{
    "restaurantId": 8,
    "ballotId": "9acba948-49e3-41e3-8a5e-3ab1a18e0a19",
    "voterName": "Bob",
    "emailAddress": "bob@gmail.com"
}
```

## Original Author of Solution

[Erik Slack](https://github.com/erik-slack/)