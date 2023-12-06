import { JSDOM } from 'jsdom';
import unirest from 'unirest'
import dataPars from './parsList.js'

const url_arr = dataPars.url_hh
const regions = dataPars.region_hh


const getCountJobArr = async(url, region) => {
	let linksLengthCount;
	try {
		let result = []
		for (let i in url) {
			let response = await unirest.get(`https://voronezh.hh.ru/search/vacancy?ored_clusters=true&search_field=name&search_field=company_name&hhtmFrom=vacancy_search_list&area=${region}&text=${url[i]}&enable_snippets=false&L_save_area=true`)
			
			const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
			let linksLength = await
				dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent

			linksLengthCount = linksLength.split(' ')
			if (linksLengthCount[0] == 'По') linksLengthCount[0] = '0'

			let linksLengthLang = linksLength.split('«')

			result.push({
				'count': linksLengthCount[0],
				'lang': linksLengthLang[1].split('»')[0],
			})
		}
		console.log(result)
		return result
	} catch (e) {
		console.log('Eror - ' + e)
	}   
}

const getCountJob = async(url, region) => {
    try{
        const response = await unirest.get(`https://voronezh.hh.ru/search/vacancy?ored_clusters=true&search_field=name&search_field=company_name&hhtmFrom=vacancy_search_list&area=${region}&text=${url}&enable_snippets=false&L_save_area=true`)
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
        var linksLength = await
            dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent

        let linksLengthCount = linksLength.split(' ')
        if (linksLengthCount[0] == 'По') linksLengthCount[0] = '0'

        let linksLengthLang = linksLength.split('«')
        
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
        const dom = new JSDOM(response.body); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
        var linksLength = 
            dom.window.document.getElementsByClassName('bloko-header-section-3')[0].textContent
            
        linksLength = linksLength.split(' ')
        
        return linksLength = {
            'resum': linksLength[1].slice(),
            'soisk': linksLength[4]
        }
    }
    catch (e) { console.log(e) }
}

function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

const startGetCountJob = async(url) => {
	let job = await getCountJob(url, regions[2])
	while (typeof job === 'undefined') {
		sleep(1000)
		job = await getCountJob(url, regions[2])
	}  
	return job  
}

const startGetCountRes = async(url) => {
	let res = await getCountResum(url, regions[2])
	while (typeof res === 'undefined') {
		sleep(1000)
		res = await getCountResum(url, regions[2])
	}  
	return res  
}

function splitArrayIntoMatrix(arr, cols) {
	var matrix = [];
	for (var i = 0; i < arr.length; i += cols) {
		matrix.push(arr.slice(i, i + cols));
	}
	return matrix;
}



const pars = async () => {
	//const prArr = splitArrayIntoMatrix(url_arr, 1);
	const promisesJob = []//[getCountJob(url_arr, regions[0])]
	const promisesRes = []
  
	for (let i = 0; i < url_arr.length; i++) {
		promisesJob.push(startGetCountJob(url_arr[i]));
		promisesRes.push(startGetCountRes(url_arr[i]));
	}

	try {
	  const resultsJob = await Promise.all(promisesJob);
	  const resultsRes = await Promise.all(promisesRes);
	  //console.log(results);
	  return {
		'resultsJob' : resultsJob,
		'resultsRes': resultsRes
	  };
	} catch (error) {
	  console.log(error);
	}
  };
  
// console.time("Время выполнения");
// let p = await pars();
// console.log(p);
// console.timeEnd("Время выполнения");
export default pars