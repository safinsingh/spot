###############
# BUILD STAGE #
###############
FROM node:current-alpine as build

# Install curl for pnpm & just
RUN apk --no-cache add curl

# Set shell to busybox ash (bash is not present)
SHELL [ "/bin/ash", "-o", "pipefail", "-c" ]

# Install pnpm & just
RUN curl -sL https://unpkg.com/@pnpm/self-installer \
	| node
RUN curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh \
	| ash -s -- --to /usr/bin

# Copy over files
WORKDIR /app
COPY . .

# Build for production
RUN just install
RUN just build

# Cleanup
RUN pnpm prune --production
RUN find . -type f -name '*.ts' -delete

################
# DEPLOY STAGE #
################
FROM build as deploy

# Copy over built files
COPY --from=build . .

# Start
CMD [ "sh", "-c", "node ${PACKAGE}/dist/index.js" ]
