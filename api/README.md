<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Nelo Corp Expense Tracker API

A robust backend API for managing vehicle expenses and tracking corporate fleet costs built with NestJS.

## Features

- Vehicle Management

  - Create, read, update, and delete vehicle records
  - Track vehicle details (make, model, year, license plate, VIN)
  - Automatic timestamp management for creation and updates
  - Database seeding for initial vehicle data

- Expense Tracking

  - Record and manage vehicle-related expenses
  - Categorize expenses for better organization
  - Filter expenses by date, category, and vehicle
  - Generate expense summaries and reports
  - Monthly and vehicle-specific expense analysis

- Real-time Processing
  - RabbitMQ integration for asynchronous expense processing
  - Efficient handling of expense calculations and summaries

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- RabbitMQ

## Installation

1. Clone the repository
2. Install dependencies:

```bash
$ npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=cab_expense_tracker

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=expense_queue
```

4. Initialize and seed the database:

```bash
# Run database migrations (if any)
$ npm run typeorm migration:run

# Seed the database with initial data
$ npm run seed
```

## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

The test suite includes:

- Unit tests for core business logic
- Integration tests for database operations
- Seeding functionality tests
- API endpoint tests
- RabbitMQ integration tests

## Project Structure

```
src/
├── controllers/     # API endpoints
├── services/       # Business logic
├── entities/       # Database models
├── dto/            # Data Transfer Objects
├── processor/      # Expense processing logic
├── database/       # Database configuration and seeds
│   ├── seeds/     # Seed data for initial setup
│   └── migrations/ # Database migrations
└── scripts/        # Database initialization scripts
```

## Database Seeding

The application includes a seeding mechanism to populate the database with initial data:

- **Vehicle Seeds**: Includes a set of 10 predefined vehicles with:
  - TLC-format license plates
  - Various makes and models
  - Unique VIN numbers
  - Vehicle-specific notes

To run seeds manually:

```bash
$ npm run seed
```

Seeds will automatically check for existing data to prevent duplication.

## License

This project is [MIT licensed](LICENSE).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
