const { Client } = require("pg");
const fs = require('fs');

async function initdb() {

const client = new Client('postgresql://postgres:random@localhost/shoppingcart');

await client.connect();

const sqlFileContent = fs.readFileSync('./structure-data.sql', 'utf8');
const result = await client.query(sqlFileContent)

// const result = await client.query('RELOAD;');

await client.end();

console.log(result.rows);

;}

console.log("read done");
initdb();


