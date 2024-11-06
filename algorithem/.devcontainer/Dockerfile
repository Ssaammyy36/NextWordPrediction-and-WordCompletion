# Basisimage
FROM python:3.10-slim

# Installiere apt
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl \
    wget \
    git

# Install pip
COPY requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt

# Setze den Arbeitsordner
WORKDIR /workspace

# Standardkommando
EXPOSE 8888
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--allow-root",  "--NotebookApp.token=''"]
