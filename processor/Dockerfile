FROM haskell:9.4 as builder

WORKDIR /app

# Copy package files
COPY package.yaml stack.yaml ./

# Install dependencies
RUN stack build --dependencies-only

# Copy source code
COPY . .

# Build the application
RUN stack build

# Create a new stage with a minimal image
FROM debian:bullseye-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /app/.stack-work/install/x86_64-linux-tinfo6/*/bin/cab-expense-tracker /app/

# Set environment variables
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Run the application
CMD ["./cab-expense-tracker"] 