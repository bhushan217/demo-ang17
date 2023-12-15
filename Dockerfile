# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
# FROM node:20-alpine3.19 as build
FROM docker.io/node:lts-alpine as dependencies

RUN apk add --no-cache libc6-compat
# RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production
ENV PORT 4200
ENV HOST 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
# Set the working directory
WORKDIR /usr/src/app

# Add the source code to app
# COPY . /usr/src/app
COPY package.json ./
# COPY --chown=node:node . .

RUN ls

# Install all the dependencies
RUN npm install --only=production
# RUN npm ci --only=production
USER node
# Generate the build of the application
# RUN npm run build
# CMD ["npm", "start"]

# Production image, copy all the files and run next
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV PORT 4200
ENV HOST 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app
# Copy installed dependencies from dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY ./ ./

# Run the application under "node" user by default
RUN chown -R node:node .
USER node
EXPOSE 4200

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "start"]

# If you are using the NextJS built-int server:
# CMD ["dumb-init", "npm", "start"]

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
# FROM nginx:latest

# Set the working directory
# WORKDIR /usr/src/app
# Copy the build output to replace the default nginx contents.
# COPY --from=build /usr/src/app/dist/demo-ang17 /usr/share/nginx/html

# Expose port 80
# EXPOSE 80