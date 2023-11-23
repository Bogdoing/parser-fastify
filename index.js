import Fastify from 'fastify'
import cors from '@fastify/cors'

import testRout from './routing/testRout.js'
import parsRout from './routing/parsRout.js'
import parsAsRout from './routing/parsAsRout.js'


const fastify = Fastify({
    logger: true
})

await fastify.register(cors, { 
  // put your options here
})


fastify.get('/', (request, reply) => {
    reply.send('Привет, мир!')
})
  
fastify.get('/about', (request, reply) => {
    reply.send('О нас')
})

fastify.register(testRout, {})
fastify.register(parsRout, {})
fastify.register(parsAsRout, {})


fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})





