FROM node:26-alpine

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY app.js server.js ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
 
USER node

CMD ["node", "server.js"]