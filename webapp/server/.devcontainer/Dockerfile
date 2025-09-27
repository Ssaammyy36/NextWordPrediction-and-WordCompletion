# Dockerfile for the Dev Container
FROM python:3.12-slim-bookworm

# Set the working directory to the server directory
WORKDIR /workspaces/umsetzung/webapp/server

# Install git and upgrade pip
RUN apt-get update && apt-get install -y git && python -m pip install --upgrade pip

# Copy and install requirements
# This is done in a separate layer to leverage Docker's build cache.
# The requirements are only re-installed if the requirements file changes.
COPY .devcontainer/dev-requirements.in ./.devcontainer/
RUN pip install -r .devcontainer/dev-requirements.in

