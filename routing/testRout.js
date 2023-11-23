// our-first-route.js

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options, done) {
    fastify.get('/test', async (request, reply) => {
        return { hello: '/test' }
    })
    done();
}

export default routes
//module.exports = routes
