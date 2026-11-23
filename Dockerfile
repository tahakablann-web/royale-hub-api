FROM node:20-alpine
WORKDIR /app
COPY server.js privacy-policy.html ./
COPY src/data/cardCatalog.js ./src/data/cardCatalog.js
EXPOSE 4000
CMD ["node", "server.js"]
