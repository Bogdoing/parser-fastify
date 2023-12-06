//const fs = require('fs');
import fs from 'fs';

import parser from '../parser/parserSync.js'


async function save(){
    const data = await parser()

    const jsonData = JSON.stringify(data, null, 2); // Преобразование данных в JSON-строку с отступами

    const dataTime = './json/' + currData() + '.json' // ./json/data.json
    fs.writeFile(dataTime, jsonData, 'utf8', err => {
    if (err) {
        console.error(err);
    } else {
        console.log('Данные успешно сохранены в файле data.json');
    }
    });
    console.log('saving true')
}

function currData(){
    let date = new Date();
    date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
    //console.log(date);
    return date;
}

//datas()
save()

//export default save