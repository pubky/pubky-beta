# Pubky App

- This is the Pubky-app MVP presented in BTC Prague, and currently live at https://pubky.app
- This code is **deprecated** and will be replaced this summer with the WIP at https://github.com/pubky/franky/
- **DO NOT** contribute code here, this is a **dead-end repository**, but you are welcome to submit issues!
- This is a sandbox built on moving parts. The code is **VERY hacky**, **DO NOT** use this for **learning purposes**.
- If you want to build a compatible social client, start here: https://www.npmjs.com/package/pubky-app-specs

### Introduction

Pubky App is a social-media-like experience built over [Pubky Core](https://notes.pubky.app//Pubky-Core/Introduction). It serves as a working example on how to build over Pubky Core to create simple or complex applications. Its social components (profiles, tagging, etc) are intended for re-use in any other Pubky application that requires of social features.

For a deeper dive on the Pubky app please refer to our [Notes](https://notes.pubky.app/Pubky-App/Introduction)

This repository holds the frontend application for the social Pubky App. For the specialized backend (aggregator/indexer/API) check out [Pubky-Nexus](https://github.com/pubky/pubky-nexus)

- [Setup Env Variables](#gear-setup-env-variables)
  - [Testnet Configuration](#test_tube-testnet-configuration)
  - [Mainnet Configuration](#earth_americas-mainnet-configuration)
- [Running Scripts](#running-running-scripts)
  - [Installation](#package-installation)
  - [Development](#computer-development-server)
  - [Production](#factory-production-build-and-server)

## :gear: Setup `.env` Variables

Create a `.env` file at the root of the project and include the following environment variables:

### :test_tube: Testnet Configuration

For that build, you will need to have running the following pieces:

- [nexus service](https://github.com/pubky/pubky-nexus?tab=readme-ov-file#%EF%B8%8F-setting-up-the-development-environment), the REST API server that provides access to indexed data
- [nexus watcher](https://github.com/pubky/pubky-nexus?tab=readme-ov-file#%EF%B8%8F-setting-up-the-development-environment), the event aggregator that listens for homeserver events
- [testnet homeserver](https://github.com/pubky/pubky-core/tree/dev/pubky-homeserver), the core data availability provider responsible for storing and serving user-generated content, ensuring distributed data persistence

```.env
NEXT_PUBLIC_HOMESERVER=8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo
NEXT_PUBLIC_NEXUS=http://localhost:8080
NEXT_PUBLIC_DEFAULT_HTTP_RELAY=http://localhost:15412/link/
NEXT_PUBLIC_TESTNET=true
```

### :earth_americas: Mainnet Configuration

```.env
NEXT_PUBLIC_HOMESERVER=ufibwbmed6jeq9k4p583go95wofakh9fwpp4k734trq79pd9u1uy
NEXT_PUBLIC_NEXUS=https://nexus.staging.pubky.app
NEXT_PUBLIC_DEFAULT_HTTP_RELAY=https://httprelay.staging.pubky.app/link
```

## :running: Running Scripts

You can manage the application's development and production builds using the following npm scripts specified in your package.json. Here are examples of how to run each script from the terminal:

### :package: Installation

Run the following command to install the dependencies:

```bash
npm install
```

### :computer: Development Server

Start the development server with:

```bash
npm run start:dev
```

This script uses nx serve web to launch the development server.

### :factory: Production Build and Server

To build for production and start the server, use:

```bash
npm run start:prod
```

This command compiles the application with nx build web and then serves the production version with nx serve web --prod.

### :hammer_and_wrench:Build Application

For building the application without starting a server, run:

```bash
npm run build
```

This will execute nx build web to compile the application into static files ready for production deployment.

These commands offer flexible ways to manage and test your application during development and before deployment.
