import { JSDOM } from 'jsdom';
import unirest from 'unirest'
import dataPars from './parsList.js'

const lang_github = dataPars.lang_github

function convertNumberString(numberString) {
    const numberMap = {
        'k': 1000,
        'M': 1000000,
        'B': 1000000000,
    };
  
    const numberRegex = /^(\d+(\.\d+)?)([kMB])?$/;
    const matches = numberString.match(numberRegex);
    //console.log(matches);
    if (matches) {
        const number = parseFloat(matches[1]);
        const unit = matches[3];
    
        if (unit) {
            const multiplier = numberMap[unit];
            return (number * multiplier).toString();
        }
    
        return number.toString();
    }
  
    return '';
}

const getLangGitHub = async(url) => {
    try{
        const response = await unirest.get(`https://github.com/search?q=language%3A${url}&type=repositories`)
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере

        var linksElement = dom.window.document.getElementsByClassName('Box-sc-g0xbh4-0 cgQapc')[0];
        var linksLength = linksElement ? linksElement.textContent : '';
        
        return linksLength = {
            'count' : linksLength,
            'lang' :  url,
        }

    }
    catch(e) { console.log('Eror - ' + e) }
    
}

function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

function currData(){
    let date = new Date();
    let month = date.getMonth() + 1;
    date = date.getFullYear() + '-' + month + '-' + date.getDate()
    return date;
}

async function pars(){
    let result = []
    for (let i = 0; i < lang_github.length; i++) {
        let getRes = await getLangGitHub(lang_github[i])
        while (getRes.count == '') {
            sleep(1000)
            //console.log(i)
            getRes = await getLangGitHub(lang_github[i]) 
        }       
        //console.log(getRes)

        getRes.count = convertNumberString(getRes.count.split(' ')[0]);
        console.log(getRes)

        result.push({
            'count': getRes.count,
            'lang': getRes.lang,
            'data': currData()
        })
    }
    return result 
}

//pars()

export default pars