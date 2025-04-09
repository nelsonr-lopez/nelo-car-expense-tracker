# Nelo Corp Expense Tracker

A full-stack expense tracking application with a modern architecture using Astro, React, NestJS, and Haskell.

## System Architecture

The application consists of several components:

### Frontend (Astro + React + TypeScript)

- Astro.js for static site generation and routing
- React components with TypeScript
- Tailwind CSS for styling
- shadcn/ui for component library
- Form handling with React Hook Form
- Real-time updates through WebSocket
- State management (to be determined)

### Backend (NestJS)

- RESTful API for expense management
- TypeORM for database operations
- JWT authentication
- Role-based access control
- PostgreSQL database

### Message Processing (Haskell)

- High-performance message processing service
- RabbitMQ integration for reliable message handling
- JSON parsing and validation
- Configurable through YAML

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- RabbitMQ
- Stack (Haskell toolchain)
- Python 3.9+ (for testing)

## Project Structure

```
nelo-corp-expense-tracker/
├── frontend/               # React frontend application
├── backend-nest/          # NestJS backend API
├── processor-service/     # Haskell message processor
└── docs/                  # Documentation
```

## Setup Instructions

### 1. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

# Create database
createdb expense_tracker
```

### 2. RabbitMQ Setup

```bash
# Install RabbitMQ
brew install rabbitmq

# Start RabbitMQ service
brew services start rabbitmq
```

### 3. Backend Setup (NestJS)

```bash
cd backend-nest

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migration:run

# Start the server
npm run start:dev
```

### 4. Frontend Setup (Astro)

```bash
cd frontend

# Install dependencies
npm install

# Install shadcn/ui components
npx shadcn-ui@latest init

# Start development server
npm run dev
```

The frontend uses Astro.js with React components. Key features:

- Static site generation with Astro
- React components for interactive features
- Tailwind CSS for styling
- shadcn/ui for pre-built components
- TypeScript for type safety

### 5. Message Processor Setup (Haskell)

```bash
cd processor-service

# Install dependencies and build
stack build

# Run the processor
stack run
```

## Testing the System

### Publishing Test Messages

We provide a Python script to test the message processing system:

```bash
# Install Python dependencies
pip3 install pika

# Run the test publisher
python3 test_publish.py
```

This will send a test expense message to the RabbitMQ queue, which will be processed by the Haskell service.

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Expenses

- `GET /expenses` - List expenses
- `POST /expenses` - Create expense
- `GET /expenses/:id` - Get expense details
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Vehicles

- `GET /vehicles` - List vehicles
- `POST /vehicles` - Create vehicle
- `GET /vehicles/:id` - Get vehicle details
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

## Message Flow

1. Frontend submits expense through API
2. NestJS backend validates and stores in database
3. Message is published to RabbitMQ queue
4. Haskell processor consumes and processes the message
5. Results are logged and can be used for further processing

## Development

### Adding New Features

1. Create necessary database migrations
2. Implement backend endpoints
3. Add frontend components and API integration
4. Update message processor if needed
5. Test the complete flow

### Testing

```bash
# Backend tests
cd backend-nest
npm run test

# Frontend tests
cd frontend
npm run test

# Haskell tests
cd processor-service
stack test
```

## Deployment

Each component can be deployed independently:

1. Frontend: Build and deploy to static hosting
2. Backend: Deploy to Node.js hosting
3. Message Processor: Deploy as a standalone service
4. Database: Use managed PostgreSQL service
5. RabbitMQ: Use managed message broker service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
