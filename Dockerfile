FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock tsconfig.json webpack.config.ts ./
RUN yarn install

COPY src ./src/

# Compile and cleanup
RUN npx tsc && rm -rf dist/client && npx webpack && yarn install --production && rm -rf src tsconfig.json webpack.config.ts

RUN mkdir -p /data && chown -R node:node /data
VOLUME /data
USER node

ENV NODE_ENV production
ENV DATA_DIR /data

CMD ["node", "dist/server"]
