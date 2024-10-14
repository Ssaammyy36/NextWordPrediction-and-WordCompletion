# Git-Repo Erstellen

### SSH-Key erzeugen 

- Open Git Bash
- Schlüsselpaar erzeugen: `ssh-keygen -t ed25519 -C "my.email@beispiel.com" -f ~/.ssh/<my-ssh-key-name>`
- Config anpassen: 

    ```bash
    # Git Config
    Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/<my-ssh-key>
    ```

- Agent aktivieren: `eval "$(ssh-agent -s)"`
- Schlüssen hinzufügen: `ssh-add ~/.ssh/<my-ssh-key>`

### Repo erstellen 

- Öffne Git im Browser
- Erstelle das Repository 
- Überprüfe den SSH-Schlüssel

### Repo local aufsetzen

- git clone <my-ssh-url>

