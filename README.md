## Prerequisites

### Yarn:

- Installation: : https://yarnpkg.com/lang/en/docs/install.

### Nodejs:

- Nodejs version >= 10.13.0, except for v13, must be installed.
- Installation: https://nodejs.org/en/.

### Docker & Docker-Compose Setup:

- Docker installation: https://docs.docker.com/get-docker/.
- Docker-compose installation: https://docs.docker.com/compose/install/.

### postgresql

- There are 2 ways to use postgres:
  - local install: downlaod from [postgres website](https://www.postgresql.org/download/)
  - docker image: use [postgres image](https://hub.docker.com/_/postgres).

## Getting Started

- Clone the repository:

  ```bash
  git clone https://github.com/m3ntorship/pickify-v2-posts.git
  ```

- Install dependencies:

  ```bash
  yarn
  ```

- Make sure postgres up & running using the defaults

  - port: 5432
  - username: postgres
  - password: postgres
  - database: postgres

  If you need to run postgres with different setup, [configure the application with different postgres setup](##Configuration)

- Run development server and open http://localhost:3000

  ```bash
  yarn start:dev
  ```
- Run docker-compose file to have both db service and rabbitMQ broker service running locally and open http://localhost:5672 for viewing rabbitMQ dashboard locally.

  ```bash
  yarn prestart:dev
  ```


## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Debug

#### Use vscode integrated debug mode as follow:

- create launch.json file inside .vscode folder in project root dir
- add the following configuration to run yarn start:dev in debug mode:

  ```javascript
  {

    "version": "0.2.0",
    "configurations": [
        {
            "command": "yarn start:dev",
            "name": "Run yarn start:dev",
            "request": "launch",
            "type": "node-terminal"
        },

    ]
  }
  ```

- You can add any script to run it in debug mode, by replacing "command" field with the script found in package.json

## Configuration

- The application can be configured by creating **.development.env** file in project's root diretory,then add any of the following environment variables.

  ```
  PORT=
  DB_HOST=
  DB_PORT=
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=
  DB_SYNC=
  DB_LOGGING=
  ```

- the following values will be used as default:

  ```
  PORT=3000
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=postgres
  DB_DATABASE=postgres
  DB_SYNC=false
  DB_LOGGING=false
  ```

## Use Docker to start the application

- You need to [install docker](#docker-&-docker-compose-setup) and docker-compose to start the database

- Open terminal and navigate to project directory and run the following command

  ```bash
  yarn
  yarn build
  docker build -t pickify-posts .
  docker-compose up -d
  ```

## OpenAPI specifications

- [Check it online](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/m3ntorship/pickify-v2-posts/development/openAPI/post.openAPI.yml)

- Or, <ins>**/api**</ins> if the app is running
