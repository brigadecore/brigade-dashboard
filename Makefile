SHELL ?= /bin/bash

.DEFAULT_GOAL := build

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
# Build
################################################################################

.PHONY: build
build:
	docker login $(DOCKER_REGISTRY) -u $(DOCKER_USERNAME) -p $${DOCKER_PASSWORD}
	docker buildx build \
		-t $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) \
		-t $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG) \
		--platform linux/amd64,linux/arm64 \
		.

################################################################################
# Publish                                                                      #
################################################################################

.PHONY: push
push:
	docker login $(DOCKER_REGISTRY) -u $(DOCKER_USERNAME) -p $${DOCKER_PASSWORD}
	docker buildx build \
		-t $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) \
		-t $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG) \
		--platform linux/amd64,linux/arm64 \
		--push \
		.

.PHONY: publish-chart
publish-chart:
	$(HELM_DOCKER_CMD) sh	-c ' \
		helm registry login $(HELM_REGISTRY) -u $(HELM_USERNAME) -p $${HELM_PASSWORD} && \
		cd charts/brigade-dashboard && \
		helm dep up && \
		helm package . --version $(VERSION) --app-version $(VERSION) && \
		helm push brigade-dashboard-$(VERSION).tgz oci://$(HELM_REGISTRY)$(HELM_ORG) \
	'

################################################################################
# Targets to facilitate hacking                                                #
################################################################################

.PHONY: hack-build
hack-build:
	docker build \
		-t $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG) \
		-t $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG) \
		--build-arg VERSION='$(VERSION)' \
		--build-arg COMMIT='$(GIT_VERSION)' \
		.

.PHONY: hack-push
hack-push: hack-build
	docker push $(DOCKER_IMAGE_NAME):$(IMMUTABLE_DOCKER_TAG)
	docker push $(DOCKER_IMAGE_NAME):$(MUTABLE_DOCKER_TAG)

IMAGE_PULL_POLICY ?= Always

.PHONY: hack-deploy
hack-deploy:
ifndef BRIGADE_API_ADDRESS
	@echo "BRIGADE_API_ADDRESS must be defined" && false
endif
	helm dep up charts/brigade-dashboard && \
	helm upgrade brigade-dashboard charts/brigade-dashboard \
		--install \
		--create-namespace \
		--namespace brigade-dashboard \
		--timeout 60s \
		--set image.repository=$(DOCKER_IMAGE_NAME) \
		--set image.tag=$(IMMUTABLE_DOCKER_TAG) \
		--set image.pullPolicy=$(IMAGE_PULL_POLICY) \
		--set brigade.apiAddress=$(BRIGADE_API_ADDRESS)

.PHONY: hack
hack: hack-push hack-deploy
