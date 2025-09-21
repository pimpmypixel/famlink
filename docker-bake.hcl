# Docker Bake configuration for FamLink
# This optimizes builds for ARM64 and enables parallel building

variable "TAG" {
  default = "latest"
}

variable "REGISTRY" {
  default = "ghcr.io"
}

variable "REPOSITORY" {
  default = "pimpmypixel/famlink"
}

variable "PLATFORMS" {
  default = "linux/amd64,linux/arm64"
}

variable "RUNTIME_TAGS" {
  default = ["${REGISTRY}/${REPOSITORY}:latest"]
}

# Base configuration shared across targets
target "_common" {
  platforms = ["${PLATFORMS}"]
  args = {
    BUILDKIT_INLINE_CACHE = "1"
  }
  cache-from = [
    "type=gha,scope=build-${replace(PLATFORMS, ",", "-")}",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:buildcache"
  ]
  cache-to = [
    "type=gha,scope=build-${replace(PLATFORMS, ",", "-")},mode=max",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:buildcache,mode=max"
  ]
}

# Runtime target - final application image
target "runtime" {
  inherits = ["_common"]
  target = "runtime"
  tags = RUNTIME_TAGS
  cache-from = [
    "type=gha,scope=runtime-${replace(PLATFORMS, ",", "-")}",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:runtime-cache"
  ]
  cache-to = [
    "type=gha,scope=runtime-${replace(PLATFORMS, ",", "-")},mode=max",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:runtime-cache,mode=max"
  ]
}

# Node.js builder target - builds frontend assets
target "node-builder" {
  inherits = ["_common"]
  target = "node-builder"
  tags = ["${REGISTRY}/${REPOSITORY}:node-builder-${TAG}"]
  cache-from = [
    "type=gha,scope=node-builder-${replace(PLATFORMS, ",", "-")}",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:node-builder-cache"
  ]
  cache-to = [
    "type=gha,scope=node-builder-${replace(PLATFORMS, ",", "-")},mode=max",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:node-builder-cache,mode=max"
  ]
}

# Vendor target - builds PHP dependencies
target "vendor" {
  inherits = ["_common"]
  target = "vendor"
  tags = ["${REGISTRY}/${REPOSITORY}:vendor-${TAG}"]
  cache-from = [
    "type=gha,scope=vendor-${replace(PLATFORMS, ",", "-")}",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:vendor-cache"
  ]
  cache-to = [
    "type=gha,scope=vendor-${replace(PLATFORMS, ",", "-")},mode=max",
    "type=registry,ref=${REGISTRY}/${REPOSITORY}:vendor-cache,mode=max"
  ]
}

# Development target with dev dependencies
target "development" {
  inherits = ["_common"]
  target = "development"
  tags = ["${REGISTRY}/${REPOSITORY}:dev-${TAG}"]
  args = {
    APP_ENV = "local"
    APP_DEBUG = "true"
  }
}

# Build all targets in parallel
group "default" {
  targets = ["node-builder", "vendor", "runtime"]
}

# Build only production runtime
group "production" {
  targets = ["runtime"]
}

# Build all including development
group "all" {
  targets = ["node-builder", "vendor", "runtime", "development"]
}