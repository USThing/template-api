# syntax=docker/dockerfile:1
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=25

FROM node:${NODE_VERSION}-alpine AS builder

# Enable the corepack, which supports the Yarn 2+ package manager.
RUN corepack enable

# Create a directory for the application code.
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
    --mount=type=cache,target=/root/.yarn \
    yarn install --immutable

# Copy the rest of source files
COPY . .

# Build the application
RUN yarn build

FROM node:${NODE_VERSION}-alpine AS runner

# Use production node environment by default.
ENV NODE_ENV=production

# Enable the corepack, which supports the Yarn 2+ package manager.
RUN corepack enable

# Run the application as a non-root user.
USER node

# Create a directory for the application code.
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
    --mount=type=cache,target=/root/.yarn \
    yarn install --immutable

# Copy the package.json and yarn.lock files to the container.
COPY package.json yarn.lock .yarnrc.yml ./

# Copy the built application from the builder stage.
COPY --from=builder /usr/src/app/dist dist

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["yarn", "start"]
