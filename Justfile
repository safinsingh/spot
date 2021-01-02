########
# PROD #
########

prod:
	docker-compose build --parallel
	docker-compose up --remove-orphans

###############
# DEVELOPMENT #
###############

dev:
	pnpm recursive run dev

install:
	pnpm recursive install

build:
	pnpm recursive run build

fix:
	just fmt
	just lint

fmt:
	pnpm recursive run fmt

lint:
	pnpm recursive run lint
	markdownlint --fix *.md

######
# CI #
######

ci:
	just install-ci
	just build-ci
	# just fmt-ci
	# just lint-ci

install-ci:
	pnpm recursive install \
		--frozen-lockfile --prefer-offline

build-ci:
	pnpm recursive run build
	pnpm prune --production 2>/dev/null
	find . -type f -maxdepth 4 \
		-name '*.ts' -delete

fmt-ci:
	pnpm recursive run fmt:ci

lint-ci:
	pnpm recursive run lint:ci
	markdownlint *.md
	hadolint Dockerfile
