## Quick launch

Existing `docker-compose.yml` can be used to launch the whole app via docker-compose.

Type the command below in your terminal in the repository directory:

```bash
docker-compose up
```

The `/data` directory will be created by database container and binded to the postgres data within the container.

## Secrets

The directory `/secrets` must be initialized with the following files in it:

- `db_password.txt` - The password to be used when initializing PostgreSQL database as docker container (in plain text format)
