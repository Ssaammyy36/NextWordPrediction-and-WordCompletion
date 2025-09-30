# Dockerfile for the Smart Keyboard Server (Production)

# --- Stage 1: Builder ---
# This stage prepares all dependencies and downloads the ML model.
FROM python:3.12-bookworm AS builder

# Install build tools: git is needed by transformers to download from the hub.
RUN apt-get update && \
    pip install --no-cache-dir --upgrade pip

WORKDIR /app

# Copy the requirements
COPY requirements.txt .

# Download all dependencies as wheel files for faster, offline installation in the next stage.
# We add the --extra-index-url for torch to find the correct CPU version.
RUN pip wheel --no-cache-dir --wheel-dir=/wheels --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Download the model from Hugging Face.
# This layer is cached as long as the model name doesn't change.
RUN pip install --no-cache-dir --find-links=/wheels transformers[torch] --extra-index-url https://download.pytorch.org/whl/cpu && \
    python -c "from transformers import AutoTokenizer, AutoModelForCausalLM; \
               model_name = 'dbmdz/german-gpt2'; \
               model_dir = '/app/app/static/models/german-gpt2'; \
               AutoTokenizer.from_pretrained(model_name).save_pretrained(model_dir); \
               AutoModelForCausalLM.from_pretrained(model_name).save_pretrained(model_dir)"


# --- Stage 2: Final Production Image ---
# This stage builds the small, secure final image.
FROM python:3.12-bookworm


RUN addgroup --system app && adduser --system --group app

WORKDIR /app


# Copy requirements and wheels
COPY --from=builder /app/requirements.txt .
COPY --from=builder /wheels /wheels

# Install Python packages from local wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy application code and model
COPY ./app ./app
COPY --from=builder /app/app/static/models/german-gpt2 ./app/static/models/german-gpt2

# Set ownership for all files
RUN chown -R app:app /app

# (Optional) Diagnose file permissions
RUN ls -laR /app

# Switch to non-root user
USER app

# Start Gunicorn server
CMD ["gunicorn", "--workers", "2", "--bind", "0.0.0.0:5000", "--log-level", "debug", "app.main:app"]
