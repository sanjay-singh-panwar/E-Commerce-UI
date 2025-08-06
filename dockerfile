# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first and install
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the build
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]

