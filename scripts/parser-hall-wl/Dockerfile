# syntax=docker/dockerfile:1
# https://docs.docker.com/go/dockerfile-reference/

FROM node:${NODE_VERSION}-bookworm AS runner

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Create a directory for the application code.
WORKDIR /usr/src/app

RUN apt-get -y update && apt-get install -y xvfb python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN python3 -m pip install --upgrade pip setuptools wheel --break-system-packages \
    && pip3 install --break-system-packages -r requirements.txt \
    && mkdir /ms-playwright \
    && playwright install chromium --with-deps --no-shell \
    && rm -rf /var/lib/apt/lists/* \
    && chmod -R 777 /ms-playwright

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["yarn", "start"]
