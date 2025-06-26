# Installation Guide

## 🚀 Quick Start

For a complete local development environment setup, please follow our detailed guide:

**📄 [Local Development Setup Guide](./local.md)**

This guide covers the complete Pubky stack setup including:

- Pubky Core (Testnet homeserver)
- Pubky Nexus (Backend API and indexer)
- Pubky App (Frontend application)

---

## 🌐 Environment Configurations

### :test_tube: Testnet Configuration

For local development with the testnet homeserver:

```env
NEXT_PUBLIC_HOMESERVER=8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo
NEXT_PUBLIC_NEXUS=http://localhost:8080
NEXT_PUBLIC_DEFAULT_HTTP_RELAY=http://localhost:15412/link/
NEXT_PUBLIC_TESTNET=true
```

### :earth_americas: Mainnet Configuration

For production/staging environment:

```env
NEXT_PUBLIC_HOMESERVER=ufibwbmed6jeq9k4p583go95wofakh9fwpp4k734trq79pd9u1uy
NEXT_PUBLIC_NEXUS=https://nexus.staging.pubky.app
NEXT_PUBLIC_DEFAULT_HTTP_RELAY=https://httprelay.staging.pubky.app/link
```

---

## :running: Development Scripts

### :package: Installation

```bash
npm install
```

### :computer: Development Server

```bash
npm run start:dev
```

### :factory: Production Build and Server

```bash
npm run start:prod
```

### :hammer_and_wrench: Build Application

```bash
npm run build
```

---

## 📋 Prerequisites

Ensure you have the following services running for local development:

- **[Nexus service](https://github.com/pubky/pubky-nexus)** - REST API server
- **[Nexus watcher](https://github.com/pubky/pubky-nexus)** - Event aggregator
- **[Testnet homeserver](https://github.com/pubky/pubky-core/tree/main/pubky-testnet)** - Core data provider

For detailed setup instructions, see **[Local Development Guide](./local.md)**.
