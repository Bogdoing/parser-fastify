import fs from 'fs';

import parser from '../parser/parserSync.js'
import parserGit from '../parser/parsGitHub.js'
import dataPars from '../parser/parsList.js'

const region_hh = dataPars.region_hh


async function saveJSON(){
    console.time("Время выполнения");
    saveGIT()
    saveHH()
    console.timeEnd("Время выполнения");
}

// async function saveGIT(){
//     const dataCurr = currData()
//     let all_data = {
//         [dataCurr] : []
//     }

//     const data = await parserGit()
//     all_data[dataCurr].push(data);

//     const jsonData = await JSON.stringify(data, null, 2);
//     const dataTime = './json/GIT-' + currData() + '.json' 
//     fs.writeFile(dataTime, jsonData, 'utf8', err => {
//         if (err) { console.error(err); } 
//         else { console.log('Данные успешно сохранены в файле ' + dataTime); }
//     });

//     appendToJsonFile('./json/GIT.json', all_data)
// }

async function saveGIT(){
    const dataCurr = currData()
    let all_data = {}; // Изменяем структуру на пустой объект {}

    const data = await parserGit()
    all_data[dataCurr] = data; // Добавляем объект данных напрямую в all_data

    const jsonData = await JSON.stringify(data, null, 2);
    const dataTime = './json/GIT-' + currData() + '.json' 
    fs.writeFile(dataTime, jsonData, 'utf8', err => {
        if (err) { console.error(err); } 
        else { console.log('Данные успешно сохранены в файле ' + dataTime); }
    });


    appendToJsonFile('./json/GIT.json', all_data)
    //console.log(all_data);
}

// async function saveHH(){
//     const dataCurr = currData()
//     let all_data = {
//         [dataCurr] : []
//     }
//     for (let i = 0; i < region_hh.length; i++) {
//         const data = await parser(region_hh[i])
//         all_data[dataCurr].push(data);
//         const jsonData = await JSON.stringify(data, null, 2);
//         const dataTime = './json/HH-' + currData() + '-' + region_hh[i] + '.json' 
//         fs.writeFile(dataTime, jsonData, 'utf8', err => {
//             if (err) { console.error(err); } 
//             else { console.log('Данные успешно сохранены в файле ' + dataTime); }
//         });
//     }

//     //appendToJsonFile('./json/HH.json', all_data)
//     console.log(all_data)
// }

async function saveHH(){
    const dataCurr = currData()
    let all_data = {}; // Изменяем структуру на пустой объект {}

    for (let i = 0; i < region_hh.length; i++) {
        const data = await parser(region_hh[i]);
        all_data[dataCurr + '-' + region_hh[i]] = data; // Добавляем объект данных напрямую в all_data

        const jsonData = await JSON.stringify(data, null, 2);
        const dataTime = './json/HH-' + currData() + '-' + region_hh[i] + '.json' 
        fs.writeFile(dataTime, jsonData, 'utf8', err => {
            if (err) { console.error(err); } 
            else { console.log('Данные успешно сохранены в файле ' + dataTime); }
        });
    }

    appendToJsonFile('./json/HH.json', all_data)
    //console.log(all_data);
}

function currData(){
    let date = new Date();
    let month = date.getMonth() + 1;
    date = date.getFullYear() + '-' + month + '-' + date.getDate()
    return date;
}

function appendToJsonFile(filename, data) {
    // Открываем файл существующего JSON-объекта
    fs.readFile(filename, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
            return;
        }
        try {
            // Преобразуем содержимое файла в объект
            const json = JSON.parse(fileData);
            // Дописываем переданные значения в объект
            Object.assign(json, data);
            // Преобразуем объект обратно в строку JSON
            const updatedJson = JSON.stringify(json, null, 2);
            // Записываем обновленную строку в файл
            fs.writeFile(filename, updatedJson, 'utf8', (err) => {
                if (err) { console.error('Ошибка при записи в файл:', err); } 
                else { console.log('Значения успешно добавлены в файл', filename); }
            });

            //
            // const filteredData = []; 
            // Object.values(data).forEach((entries) => { 
            //     entries.forEach((entry) => { 
            //         if (entry.lang === "TypeScript or ts") { 
            //             filteredData.push(entry); 
            //         } 
            //     }); 
            // });
            // console.log(filteredData);
            //


        } catch (err) { console.error('Ошибка при разборе содержимого файла:', err); }
    });
}

saveJSON()

//export default save
