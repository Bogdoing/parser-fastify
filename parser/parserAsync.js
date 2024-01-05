import { JSDOM } from 'jsdom';
import unirest from 'unirest'
import dataPars from './parsList.js'
import { promisify } from 'util';

const url_arr = dataPars.url_hh
const regions = dataPars.region_hh

const getCountJob = async(url, region) => {
    try{
        const response = await unirest
			.get(`https://voronezh.hh.ru/search/vacancy?ored_clusters=true&search_field=name&search_field=company_name&hhtmFrom=vacancy_search_list&area=${region}&text=${url}&enable_snippets=false&L_save_area=true`)
			.timeout(50000)

		console.log(response ? 'undefined' : 'true'); 

        const dom = new JSDOM(response.body);
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
        const dom = new JSDOM(response.body);
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
		sleep(1500)
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


const pars = async () => {
	const promisesJob = []
	const promisesRes = []
	let result = []
  
	for (let i = 0; i < url_arr.length; i++) {
		promisesJob.push(startGetCountJob(url_arr[i]));
		promisesRes.push(startGetCountRes(url_arr[i]));
	}

	try {
		const resultsJob = await Promise.all(promisesJob);
		const resultsRes = await Promise.all(promisesRes);
		// return {
		// 	'resultsJob' : resultsJob,
		// 	'resultsRes': resultsRes
		// };

		result.push({
            'lang': resultsJob.lang,
            'vac': resultsJob.count,
            'res': resultsRes.resum,
            'result' : Number(resultsRes.resum) / Number(resultsJob.count)
        })
		return { result };
	} catch (error) {
		console.log(error);
	}
};
  

export default pars