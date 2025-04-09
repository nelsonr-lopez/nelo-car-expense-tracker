#!/bin/bash

# Build the Haskell library
stack build

# Create lib directory if it doesn't exist
mkdir -p lib

# Copy the compiled library to the lib directory
cp $(stack path --local-install-root)/lib/libHS cab-expense-processor-0.1.0.0-*.so lib/libprocessor.so

# Copy the header file
cp include/processor.h lib/

echo "Build complete. Library is in lib/libprocessor.so" 