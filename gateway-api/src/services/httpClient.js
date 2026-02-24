const fp = require("fastify-plugin");
const axios = require("axios");

module.exports = fp(async function (fastify) {
  fastify.decorate("httpClient", axios.create({ timeout: 15000 }));
});
