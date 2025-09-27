# Dockerfile for the Smart Keyboard Server (Production)
# This version uses a pre-generated 'requirements.txt' file.

# --- Stage 1: Builder ---
# This stage prepares all dependencies and downloads the ML model.
FROM python:3.12-slim-bookworm AS builder

# Install build tools: git is needed by transformers to download from the hub.
RUN apt-get update && apt-get install -y git && pip install --no-cache-dir --upgrade pip

WORKDIR /app

# Copy the pre-generated requirements.txt file.
COPY requirements.txt .

# Download all dependencies as wheel files for faster, offline installation in the next stage.
# We add the --extra-index-url for torch to find the correct CPU version.
RUN pip wheel --no-cache-dir --wheel-dir=/wheels --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Download the model from Hugging Face.
# This layer is cached as long as the model name doesn't change.
RUN pip install --no-cache-dir transformers[torch] --extra-index-url https://download.pytorch.org/whl/cpu && \
    python -c "from transformers import AutoTokenizer, AutoModelForCausalLM; \
               model_name = 'dbmdz/german-gpt2'; \
               model_dir = '/app/app/static/models/german-gpt2'; \
               AutoTokenizer.from_pretrained(model_name).save_pretrained(model_dir); \
               AutoModelForCausalLM.from_pretrained(model_name).save_pretrained(model_dir)"


# --- Stage 2: Final Production Image ---
# This stage builds the small, secure final image.
FROM python:3.12-slim-bookworm

# Create a non-root user and group for security.
RUN addgroup --system app && adduser --system --group app

WORKDIR /app

# Copy the requirements.txt from the builder stage.
COPY --from=builder /app/requirements.txt .

# Copy the downloaded Python package wheels from the builder stage.
COPY --from=builder /wheels /wheels

# Install Python packages from local wheels without internet access.
# We add the --extra-index-url here as well to be safe.
RUN pip install --no-cache-dir --no-index --find-links=/wheels --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy the application code from the current directory into the container.
COPY ./app ./app

# Copy the pre-downloaded model from the builder stage.
COPY --from=builder /app/app/static/models/german-gpt2 ./app/static/models/german-gpt2

# Change ownership of all files to the non-root user.
RUN chown -R app:app /app

# Switch to the non-root user.
# USER app # <-- Temporarily disabled for testing as root

# Expose port 5000 for Gunicorn.
EXPOSE 5000

# --- TEMPORARY TEST --- 
# Run the app with the built-in Flask development server to isolate the problem.
# This CMD will be used instead of the Gunicorn one.
CMD ["python", "app/main.py"]
