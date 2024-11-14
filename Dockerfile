# Alternatively we could use node:22.9.0-alpine3.20
FROM node:22.9.0-slim

# Set working directory
WORKDIR /usr/src/app

# Declare build arguments
ARG NEXT_PUBLIC_HOMESERVER
ARG NEXT_PUBLIC_NEXUS
ARG NEXT_PUBLIC_TESTNET

# Copy pubky-app
COPY . .

# Install dependencies
RUN npm install --omit=dev

# Remove devDependencies to reduce image size
RUN npm prune --production

# Build
RUN npm run build

# The command to run the pubky web server
CMD ["npm", "run", "serve:prod"]
