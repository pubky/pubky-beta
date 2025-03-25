Install all the stack

### Pubky-core

> Working directory, `pubky-core/pubky-testnet`

We need to run `testnet` homeserver. This binary will have hook up apart:

- `homeserver` (`:6286`)
- `pkarr-relay` (`:15411`)
- `http-relay`(`:15412`)

First we will configure testnet homeserver

```bash
cd pubky-core/pubky-homeserver/src
# clone the config.example.toml
cp config.example.toml config.toml
# uncomment secret_key, with this homeserver the homeserver will create the default pubky for the homeserver
# 8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo
secret_key = "0000000000000000000000000000000000000000000000000000000000000000"
```

Once it is configured,

```bash
cd ../.. # go back to the pubky-core directory
cd pubky-testnet
# run testnet homeserver
cargo run
```

Once it is running, we can create an invite codes. The password we will have in the `admin.password` value on `config.toml`. Default one `admin`

```bash
curl -X GET "http://localhost:6286/admin/generate_signup_token" -H "X-Admin-Password: admin"
```

### Pubky-nexus

> Working directory, `pubky-nexus`

Add the following `conf.toml` file in `nexusd/src` (you can find there the template)

```toml
[api]
# Service name used for tracing, logging, and metrics in OpenTelemetr
name = "nexusd.api"
public_addr = "127.0.0.1:8080"

[watcher]

# Service name used for tracing, logging, and metrics in OpenTelemetry
name = "nexusd.watcher"
testnet = true

# PROD: Watcher will from from staging server
# homeserver = "8um71us3fyw6h8wbcxb5ar3rwusy1a6u49956ikzojg3gcwd1dty"
# STAGING
#homeserver = "ufibwbmed6jeq9k4p583go95wofakh9fwpp4k734trq79pd9u1uy"
# DEV
homeserver = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo"
events_limit = 50
watcher_sleep = 5000

[stack]

# Logging, options: error, warn, info, debug and trace
log_level = "debug"
files_path = "./nexus-api/static/files"
# OTLP_ENDPOINT is set to empty by default. If you want to enable tracing, set it to the OpenTelemetry Collector endpoint
#otlp_endpoint="http://localhost:4317"

[stack.db]
redis = "redis://127.0.0.1:6379"

[stack.db.neo4j]
uri = "bolt://localhost:7687"
# Not needed in the Community Edition
password = "12345678"
```

We will need to spin up the db: `Neo4j` and `redis`

```bash
cd ../.. # go back to the pubky-core directory
cd docker
# copy the .env.example file to .env and set the variables
cp .env.example .env
# spin up the containers
docker compose up -d
```

Once all the containers are up, run `nexusd`

```bash
cd .. # go back to the pubky-core directory
cargo run -p nexusd -- --config
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

If you want to see the pubky.app respository files, run `pubky-explorer`
, [here](https://github.com/pubky/pubky-explorer) but first, we need to setup an environment variable to choose which homeserver we want to connect

```bash
# Read from the local homeserver (testnet one)
VITE_TESTNET=true
```
