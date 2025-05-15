Install all the stack

### Pubky-core

> Working directory, `pubky-core/pubky-testnet`

We need to run the `testnet` homeserver binary in our local network, exposing these services:

- `homeserver` (`:6286`)
- `admin-homeserver` (`:6288`)
- `pkarr-relay` (`:15411`)
- `http-relay`(`:15412`)

```bash
# run testnet homeserver
cargo run
```

Once it is running, we can create an invite codes. The password we will have in the `admin_password` value on `config.toml`. Default one `admin`

```bash
curl -X GET "http://localhost:6288/generate_signup_token" -H "X-Admin-Password: admin"
```

### Pubky-nexus

> Working directory, `pubky-nexus`

First, we will need to spin up the db: `Neo4j` and `redis`

```bash
cd docker
# copy the .env.example file to .env and set the variables
cp .env.example .env
# spin up the containers
docker compose up -d
```

Once all the containers are up, run `nexusd`

```bash
# Return to the pubky-nexus directory
cd ..
# Start the Nexus daemon (nexusd)
# On first run, a config.toml will be created at ~/.pubky-nexus/config.toml
# By default, it connects to the Synonym homeserver
cargo run -p nexusd
# To switch to the Pubky testnet homeserver, edit ~/.pubky-nexus/config.toml:
#   testnet = true
#   homeserver = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo"
# Then restart the service: STOP (ctrl + c) and run again
cargo run -p nexusd
# EXTRA COMMANDS
# To specify a custom config file, add the --config flag:
cargo run -p nexusd -- --config="/path/to/config.toml"
# To clear Redis and the graph database and re-index from scratch:
cargo run -p nexusd -- db clear
cargo run -p nexusd
# More info about nexus: https://github.com/pubky/pubky-nexus/blob/main/README.md#%EF%B8%8F-setting-up-the-development-environment
```

You will be able to access:

- neo4j in `http://localhost:7474`
- redis in `http://localhost:8001`

### Pubky-app

Repository [readme](https://github.com/pubky/pubky-app/blob/dev/README.md)

- Install node with nvm, check [`Dockerfile`](https://github.com/pubky/pubky-app/blob/dev/Dockerfile) to know the version of node
- Copy the `.env` variables, set `# Testnet Homeserver`
- `npm install`

Setup the `.env` file in `pubky-app`

```bash
cp .env.example .env
# set the variables uncommenting the following lines
# Testnet Homeserver
NEXT_PUBLIC_HOMESERVER=8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo
NEXT_PUBLIC_NEXUS=http://localhost:8080
NEXT_PUBLIC_TESTNET=true
NEXT_PUBLIC_DEFAULT_HTTP_RELAY=http://localhost:15412/link/
```

```bash
# Run the client
npm run start:dev
```

---

## Extra

### Pubky-explorer

If you want to see the `pubky.app` respository files, run `pubky-explorer`
, [here](https://github.com/pubky/pubky-explorer) but first, we need to setup an environment file to choose which homeserver we want to connect

```bash
# Read from the local homeserver (testnet one)
VITE_TESTNET=true
```
