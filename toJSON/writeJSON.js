import fs from 'fs';

import parser from '../parser/parserSync.js'
import parserGit from '../parser/parsGitHub.js'
import dataPars from '../parser/parsList.js'

const region_hh = dataPars.region_hh


async function save(){
    // for (let i = 0; i < region_hh.length; i++) {
    //     const data = await parser(region_hh[i])
    //     const jsonData = await JSON.stringify(data, null, 2);
    //     const dataTime = './json/HH-' + currData() + '-' + region_hh[i] + '.json' 
    //     fs.writeFile(dataTime, jsonData, 'utf8', err => {
    //         if (err) { console.error(err); } 
    //         else { console.log('Данные успешно сохранены в файле ' + dataTime); }
    //     });
    // }

    const data = await parserGit()
    const jsonData = await JSON.stringify(data, null, 2);
    const dataTime = './json/GIT-' + currData() + '.json' 
    fs.writeFile(dataTime, jsonData, 'utf8', err => {
        if (err) { console.error(err); } 
        else { console.log('Данные успешно сохранены в файле ' + dataTime); }
    });
}

function currData(){
    let date = new Date();
    let month = date.getMonth() + 1;
    date = date.getFullYear() + '-' + month + '-' + date.getDate()
    return date;
}

save()

//export default save