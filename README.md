# Social UI Monorepo

## Start the app

To start the development server run `nx serve web`.
Open your browser and navigate to http://localhost:4200/.

## Setup .env vars

Create a `.env` file in the root of the project and add the following variables:

### Testnet

```
NEXT_PUBLIC_HOMESERVER=pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo
NEXT_PUBLIC_PKARR_RELAY=http://localhost:7258
```

### Mainnet

```
NEXT_PUBLIC_HOMESERVER=pk:4unkz8qto4xec6jhw9mie9oepgcurirebdx8axyq3o36fanooxxy
NEXT_PUBLIC_PKARR_RELAY=https://relay.pkarr.org
```
