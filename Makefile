SHELL ?= /bin/bash

.DEFAULT_GOAL := push

################################################################################
# Version details                                                              #
################################################################################

# This will reliably return the short SHA1 of HEAD or, if the working directory
# is dirty, will return that + "-dirty"
GIT_VERSION = $(shell git describe --always --abbrev=7 --dirty --match=NeVeRmAtCh)

################################################################################
# Config                                                                       #
################################################################################

ifdef DOCKER_REGISTRY
	DOCKER_REGISTRY := $(DOCKER_REGISTRY)/
endif

ifdef DOCKER_ORG
	DOCKER_ORG := $(DOCKER_ORG)/
endif

DOCKER_IMAGE_NAME := $(DOCKER_REGISTRY)$(DOCKER_ORG)brigade-dashboard

ifdef VERSION
	MUTABLE_DOCKER_TAG := latest
else
	VERSION            := $(GIT_VERSION)
	MUTABLE_DOCKER_TAG := edge
endif

IMMUTABLE_DOCKER_TAG := $(VERSION)

ifdef HELM_REGISTRY
	HELM_REGISTRY := $(HELM_REGISTRY)/
endif

ifdef HELM_ORG
	HELM_ORG := $(HELM_ORG)/
endif

HELM_CHART_NAME := $(HELM_REGISTRY)$(HELM_ORG)brigade-dashboard

################################################################################
# Tests                                                                        #
################################################################################

.PHONY: lint-chart
lint-chart:
	$(HELM_DOCKER_CMD) sh -c ' \
		cd charts/brigade-dashboard && \
		helm dep up && \
		helm lint . \
	'

################################################################################
# Image security                                                               #
################################################################################

.PHONY: scan
scan:
	grype $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) -f medium

.PHONY: generate-sbom
generate-sbom:
	syft $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) \
		-o spdx-json \
		--file ./artifacts/brigade-dashboard-$(VERSION)-SBOM.json

.PHONY: publish-sbom
publish-sbom: generate-sbom
	ghr \
		-u $(GITHUB_ORG) \
		-r $(GITHUB_REPO) \
		-c $$(git rev-parse HEAD) \
		-t $${GITHUB_TOKEN} \
		-n ${VERSION} \
		${VERSION} ./artifacts/brigade-dashboard-$(VERSION)-SBOM.json

################################################################################
# Publish                                                                      #
################################################################################

.PHONY: push
push:
	docker buildx build \
		-t $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) \
		-t $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG) \
		--platform linux/amd64,linux/arm64/v8 \
		--push \
		.

.PHONY: sign
sign:
	docker pull $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG)
	docker pull $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG)
	docker trust sign $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG)
	docker trust sign $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG)
	docker trust inspect --pretty $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG)
	docker trust inspect --pretty $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG)

.PHONY: publish-chart
publish-chart:
	$(HELM_DOCKER_CMD) sh	-c ' \
		helm registry login $(HELM_REGISTRY) -u $(HELM_USERNAME) -p $${HELM_PASSWORD} && \
		cd charts/brigade-dashboard && \
		helm dep up && \
		helm package . --version $(VERSION) --app-version $(VERSION) && \
		helm push brigade-dashboard-$(VERSION).tgz oci://$(HELM_REGISTRY)$(HELM_ORG) \
	'
