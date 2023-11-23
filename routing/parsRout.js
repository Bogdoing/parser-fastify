import parser from '../parser/parserSync.js'
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options, done) {
    fastify.get('/pars', async (request, reply) => {
        console.log('start Parsing')
        let result = await parser()
        console.log(result)
        return { result }
    })
    done();
}

export default routes
//module.exports = routes
