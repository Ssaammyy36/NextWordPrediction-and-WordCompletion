# Devcontainer verwenden 

[Quelle](https://code.visualstudio.com/docs/devcontainers/containers)

### ...

- Docker starten
- Ordner anlegen: `mkdir .devcontainer `
- Files anlegen:

    ```bash 
    cd .devcontainer
    touch Dockerfile
    touch decvontainer.json
    touch requirements.txt
    ```

- Dockerfile konfigurieren:

    ```bash
    # Inhalt 
    #...
    ```

- Dockerfile bauen: `docker build -t <my-container-name> .`

    ´docker build -t silvan-container .`
