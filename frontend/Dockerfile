# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the image
COPY package.json package-lock.json* ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install --production

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application as root user.
CMD ["npm", "start"]
