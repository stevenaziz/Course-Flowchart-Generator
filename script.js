const fs = require('fs');

const data = fs.readFileSync('Majors.txt', 'utf-8');
//console.log("We got this far");
//console.log(data);

const nodes = data.split('\n');

//console.log(nodes[1]);

const classcode = nodes[0].split(',')[0];

console.log(classcode);

