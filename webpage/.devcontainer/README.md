# Devcontainer

- Dockerfile bauen: `docker build -t silvan-container:$(date +%Y-%m-%d_%H-%M-%S) .`
- Devconatiner öffnen : `Str + P` und `Reopen in Container`

- JupyterServer starten: `jupyter notebook --ip=0.0.0.0 --no-browser --allow-root --NotebookApp.token=''`
- JupyterNotebook: `http://localhost:8888`