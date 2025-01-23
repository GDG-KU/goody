#!/bin/bash

# Exit on error
set -e

gcloud config set project goody-447505
gcloud services enable artifactregistry.googleapis.com
gcloud auth configure-docker
docker buildx build -f dev.dockerfile --platform linux/amd64 -t gcr.io/goody-447505/goody:latest .
gcloud run deploy goody-service --image gcr.io/goody-447505/goody:latest --platform managed --region asia-northeast3 --allow-unauthenticated