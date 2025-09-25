# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY ./app /app

# Expose port 5000 for the Flask app
EXPOSE 5000

# Run Gunicorn to serve the Flask app
# 'app.main:app' refers to the 'app' object in 'app/main.py'
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.main:app"]
