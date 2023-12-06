import parser from './parser/parserSync.js'
import parserAs from './parser/parserAsync.js'


console.time("Время выполнения");

// let result = await parser()
// console.log(result)

let result = await parserAs()
console.log(result)

console.timeEnd("Время выполнения");
