docker:
	docker-compose build --parallel
	just docker-run

docker-run:
	docker-compose up --remove-orphans

start:
	pnpm recursive run start

install:
	pnpm recursive install

install-ci:
	pnpm recursive install --frozen-lockfile

build:
	pnpm recursive run build

lint:
	pnpm recursive run lint && \
	markdownlint --fix *.md

lint-ci:
	pnpm recursive run lint:ci && \
	markdownlint *.md && \
	hadolint Dockerfile

fmt:
	pnpm recursive run fmt

fmt-ci:
	pnpm recursive run fmt:ci
