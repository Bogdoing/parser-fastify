import { JSDOM } from 'jsdom';
import unirest from 'unirest'
import dataPars from './parsList.js'

const url_hh = dataPars.url_hh
const region_hh = dataPars.region_hh

const getData = async() => {
    try{
        for (let i = 0; i < url_arr.length; i++) {
            const url = url_arr[i]
            const response = await unirest.get(`https://hh.ru/search/vacancy?text=${url}&area=26`)
            const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
            var linksLength =
                dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent // console.log(Object.keys(dom.window.document.getElementsByClassName('bloko-header-section-3')[0])) // console.log(dom.window.document.getElementsByClassName('bloko-header-section-3')[0])
            //console.log(linksLength)

        }
        for (let i = 0; i < url_arr.length; i++) {
            const url = url_arr[i]
            const response = await unirest.get(`https://voronezh.hh.ru/search/resume?text=${url}&area=26&isDefaultArea=true&exp_period=all_time&logic=normal&pos=full_text&fromSearchLine=false`)
            const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
            var linksLength =
                dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent
            //console.log(linksLength)
        }
    }
    catch(e)
    {
        console.log(e);
    }
}

const getCountJob = async(url, region) => {
    try{
        const response = await unirest.get(`https://voronezh.hh.ru/search/vacancy?ored_clusters=true&search_field=name&search_field=company_name&hhtmFrom=vacancy_search_list&area=${region}&text=${url}&enable_snippets=false&L_save_area=true`)
                                        //  https://voronezh.hh.ru/search/vacancy?text=${url}&area=${region}&hhtmFrom=main&hhtmFromLabel=vacancy_search_line
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
        var linksLength = await
            dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent

        let linksLengthCount = linksLength.split(' ')
        if (linksLengthCount[0] == 'По') linksLengthCount[0] = '0'

        let linksLengthLang = linksLength.split('«')
        
        //console.log(linksLength)
        
        return linksLength = {
            'count' :  linksLengthCount[0],
            'lang'  :  linksLengthLang[1].split('»')[0],
            'region':  region
        } 
    }
    catch(e) { console.log('Eror - ' + e) }
}

const getJobReference = async(url, region) => {
    try{
        const response = await unirest.get(`https://voronezh.hh.ru/search/vacancy?text=${url}&area=${region}&hhtmFrom=main&hhtmFromLabel=vacancy_search_line`)
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
        var linksLength = await
            dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent

        let linksLengthCount = linksLength.split(' ')
        if (linksLengthCount[0] == 'По') linksLengthCount[0] = '0'

        let linksLengthLang = linksLength.split('«')
        
        //console.log(linksLength)
        
        return linksLength = {
            'count' :  linksLengthCount[0],
            'lang'  :  linksLengthLang[1].split('»')[0],
            'region':  region
        } 
    }
    catch(e) { console.log('Eror - ' + e) }
}

const getCountResum = async (url, region) => {
    try {
        const response = await unirest.get(`https://voronezh.hh.ru/search/resume?text=${url}&area=${region}&isDefaultArea=true&exp_period=all_time&logic=normal&pos=full_text&fromSearchLine=false`)
        //const response = await unirest.get(`https://voronezh.hh.ru/search/vacancy?area=${region}&hhtmFrom=resume_list&search_field=name&search_field=company_name&search_field=description&enable_snippets=false&text=${url}`)
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
        var linksLength = 
            dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent
            
        linksLength = linksLength.split(' ')
        
        //console.log(linksLength)
        
        return linksLength = {
            'resum': linksLength[1].slice(),
            'soisk': linksLength[4]
        }
    }
    catch (e) { console.log(e) }
}

async function fmtItems(item){
    let result = ''
    if (isNaN(Number(item))){
        let itemSplit = item.split('')
        switch (itemSplit.length) {
            case 5:
                result = itemSplit[0] + itemSplit[2] + itemSplit[3] + itemSplit[4]
                break;
            case 6:
                result = itemSplit[0] + itemSplit[1] + itemSplit[3] + itemSplit[4] + itemSplit[5]
                break;
            case 7:
                result = itemSplit[0] + itemSplit[1] + itemSplit[2] + itemSplit[4] + itemSplit[5] + itemSplit[6]
                break;
            case 9:
                result = itemSplit[0] + itemSplit[2] + itemSplit[3] + itemSplit[4] + itemSplit[6] + itemSplit[7] +  + itemSplit[8]
                break;
            default:
                result = 'ERROR: Unknown switch'
          }
        //console.log('fmtItems - ' + result)
        return result
    }
    else return item
}

function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

function currData(){
    let date = new Date();
    let month = date.getMonth() + 1;
    date = date.getFullYear() + '-' + month + '-' + date.getDate()
    return date;
}

async function pars(region){
    let result = [];

    for (let i = 0; i < url_hh.length; i++) {
        console.log('-----------------------------------------')
        
        let job = await getCountJob(url_hh[i], region)
        let jobReference = await getJobReference(url_hh[i], region)
        let resum = await getCountResum(url_hh[i], region)

        //
        while (typeof job === 'undefined') {
            sleep(1000)
            //console.log(i)
            job = await getCountJob(url_hh[i], region)
        }    
        while (typeof jobReference === 'undefined') {
            sleep(1000)
            //console.log(i)
            jobReference = await getJobReference(url_hh[i], region)
        }  
        while (typeof resum === 'undefined') {
            sleep(1000)
            //console.log(i)
            job = await getCountResum(url_hh[i], region)
        }   
        if (job && job.count) {
            job.count = await fmtItems(job.count);
        }
        if (jobReference && jobReference.count) {
            jobReference.count = await fmtItems(jobReference.count);
        }
        if (resum && resum.resum) {
            resum.resum = await fmtItems(resum.resum);
        }
        //

        result.push({
            'lang': job.lang,
            'vac': job.count,
            'vacRef': jobReference.count,
            'res': resum.resum,
            'region' : region,
            'data' : currData(),
        })
        // let res = {
        //     'lang': job.lang,
        //     'vac': job.count,
        //     'vacRef': jobReference.count,
        //     'res': resum.resum,
        //     'region' : region,
        //     'data' : currData(),
        // }
        
        
        // console.log({
        //     'lang': job.lang,
        //     'vac': job.count,
        //     'vacRef': jobReference.count,
        //     'res': resum.resum,
        //     'region' : region,
        //     'data' : currData(),
        // })
    }


    console.log('-----------------------------------------')
    return result 
}

export default pars


