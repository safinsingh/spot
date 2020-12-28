docker:
	docker-compose build
	just docker-run

docker-run:
	docker-compose up

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
	markdownlint *.md

fmt:
	pnpm recursive run fmt

fmt-ci:
	pnpm recursive run fmt:ci
