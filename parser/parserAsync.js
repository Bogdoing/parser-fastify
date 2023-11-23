import { JSDOM } from 'jsdom';
import unirest from 'unirest'
import dataPars from './parsList.js'

const url_arr = dataPars.url_arr
const regions = dataPars.region_arr


const getCountJob = async(url, region) => {
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

function splitArrayIntoMatrix(arr, cols) {
	var matrix = [];
	for (var i = 0; i < arr.length; i += cols) {
		matrix.push(arr.slice(i, i + cols));
	}
	return matrix;
}



const pars = async () => {
	const prArr = splitArrayIntoMatrix(url_arr, 1);
	const promises = [getCountJob(url_arr, regions[0])]
  
	// for (let i = 0; i < prArr.length; i++) {
	//   promises.push(getCountJob(prArr[i], regions[0]));
	// }

	try {
	  const results = await Promise.all(promises);
	  console.log(results);
	  return results;
	} catch (error) {
	  console.log(error);
	}
  };
  

  //pars();

export default pars