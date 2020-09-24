FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install

COPY src ./src/

# Compile and cleanup
RUN npx tsc && yarn install --production && rm -rf src tsconfig.json

VOLUME /data

ENV DATA_DIR /data

ENV NODE_ENV production
CMD ["node", "dist"]
