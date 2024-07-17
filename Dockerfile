# Use Node.js version 19.3.0 as base
ARG NODE_VERSION=19.3.0
FROM node:${NODE_VERSION}-alpine as base

# Set working directory
WORKDIR /usr/src/app

# Install dependencies (separate stage for caching dependencies)
FROM base as deps

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install production dependencies
RUN yarn install --production --frozen-lockfile

# Install all dependencies including dev dependencies for build
FROM deps as build

# Install all dependencies (including dev dependencies) for building
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN yarn build

# Final stage for production
FROM base as final

# Set environment variables
ENV NODE_ENV production

# Switch to a non-root user
USER node

# Copy package.json and production dependencies from deps stage
COPY package.json yarn.lock ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy built application files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose port 8000 (adjust as needed)
EXPOSE 8000

# Command to run the NestJS application
CMD ["node", "dist/main"]
