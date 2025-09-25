# Dockerfile for the Smart Keyboard Server

# --- Build Stage ---
FROM python:3.12-slim-bookworm AS builder

# Set the working directory
WORKDIR /app

# Set a global timeout for all pip operations
ENV PIP_DEFAULT_TIMEOUT=100

# Install pip-tools
RUN pip install --no-cache-dir pip-tools

# Copy the requirements file
COPY requirements.in .

# Compile requirements to be compatible with the container's environment
RUN pip-compile --strip-extras -o requirements.txt requirements.in

# --- Final Stage --- 
# Use an official Python runtime as a parent image
FROM python:3.12-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy the compiled requirements.txt from the builder stage
COPY --from=builder /app/requirements.txt .

# Install the python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY ./app /app

# Expose port 5000 for the Flask app
EXPOSE 5000

# Run Gunicorn to serve the Flask app
# 'app.main:app' refers to the 'app' object in 'app/main.py'
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.main:app"]
