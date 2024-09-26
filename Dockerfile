# Alternatively we could use node:22.9.0-alpine3.20
FROM node:22.9.0-alpine3.20

# Needed for as long as @synonymdev/pubky remains private
# Set the build argument for NPM_TOKEN
ARG NPM_TOKEN

# Set working directory
WORKDIR /usr/src/app

# Copy pubky-app
COPY . .

# Use the NPM_TOKEN to access private packages
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# Install dependencies
RUN npm install

# The command to run the pubky web server
CMD ["npm", "run", "start:prod"]
