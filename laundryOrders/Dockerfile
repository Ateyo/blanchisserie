# Use a Node.js base image
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port the Angular app runs on
EXPOSE 4200
