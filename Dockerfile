FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install

COPY src ./src/

# Compile and cleanup
RUN npx tsc && yarn install --production && rm -rf src tsconfig.json

RUN mkdir -p /data && chown -R node:node /data
VOLUME /data
USER node

ENV NODE_ENV production
ENV DATA_DIR /data

CMD ["node", "dist"]
