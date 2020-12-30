###############
# BUILD STAGE #
###############
FROM node:latest as build

# Install pnpm & just
RUN curl -sL https://unpkg.com/@pnpm/self-installer \
	| node && \
	curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh \
	| bash -s -- --to /usr/bin

# Copy over files
WORKDIR /app
COPY . .

# Build for production
RUN just install-ci build-ci

################
# DEPLOY STAGE #
################
FROM node:current-alpine as deploy

# Copy over built files
COPY --from=build . .
WORKDIR /app

# Start
CMD [ "sh", "-c", "npm start --prefix ${PACKAGE}" ]
