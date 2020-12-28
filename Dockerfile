FROM node:latest

# Panic on errors caused by piped commands
SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

# Install `pnpm`
RUN curl -L https://unpkg.com/@pnpm/self-installer | node

# Install `just`
RUN curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/bin

# Set working directory
WORKDIR /app

# Copy repository
COPY . .

# Run build/dep scripts
RUN just install-ci
RUN just build

# Start
CMD [ "just", "start" ]
