# syntax=docker/dockerfile:1
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=22.6.0

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

FROM node:${NODE_VERSION}-bookworm AS runner

# Use production node environment by default.
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Enable the corepack, which supports the Yarn 2+ package manager.
RUN corepack enable

# Create a directory for the application code.
WORKDIR /usr/src/app

# Setup hall-wl script dependencies
RUN apt-get -y update && apt-get install -y xvfb python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies before Node's to take advantage of Docker's caching.
# This is because Python dependencies are typically more stable and change less frequently than Node.js dependencies.
COPY --from=builder /usr/src/app/scripts scripts
RUN python3 -m pip install --upgrade pip setuptools wheel --break-system-packages \
    && pip3 install --break-system-packages -r scripts/parser-hall-wl/requirements.txt \
    && mkdir /ms-playwright \
    && playwright install chromium --with-deps --no-shell \
    && rm -rf /var/lib/apt/lists/* \
    && chmod -R 777 /ms-playwright

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
