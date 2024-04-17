# Pubky App

This is the frontend application for the Pubky Social.

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

```
NEXT_PUBLIC_HOMESERVER=pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo
NEXT_PUBLIC_PKARR_RELAY=http://localhost:7258
```

### :earth_americas: Mainnet Configuration

```
NEXT_PUBLIC_HOMESERVER=pk:4unkz8qto4xec6jhw9mie9oepgcurirebdx8axyq3o36fanooxxy
NEXT_PUBLIC_PKARR_RELAY=https://relay.pkarr.org
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
