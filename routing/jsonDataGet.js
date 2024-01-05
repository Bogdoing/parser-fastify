import fs from 'fs';

import filesPath from '';
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options, done) {
    fastify.get('/jsonData', async (request, reply) => {
        console.log('Routing jsonData')
        // Путь к папке с файлами
        const filesPath = '../json/19-12-2023.json';

        // Массив для хранения данных из файлов
        const filesData = [];

        try{
            // fs.readdirSync(filesPath).forEach((file) => {
            //     if (file.endsWith('.json')) {
            //         const filePath = `${filesPath}/${file}`;
            //         const fileData = fs.readFileSync(filePath, 'utf8');
            //         filesData.push(JSON.parse(fileData));
            //         console.log('filesData - ' + filesData)
            //     }
            // });

            //const ret = fs.readFileSync(filesPath)// json/2-1-2024.json

            // Отправка данных на клиент
            //reply.send(filesData);
            return ret

        } catch(e) { return 'Err - ' + e; }
        return 'Unkown error';
    })
    done();
}

export default routes