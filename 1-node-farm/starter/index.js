const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
// ////////////////////////
// FILES

// BLOCKING
// const textinput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textinput)
// const textOut = `this is what we know about the avacado ${textinput} created at ${Date.now()}`
// console.log(textOut)
// fs.writeFileSync('./txt/OutputText', textOut)
// console.log('written')

// NON-BLOCKING
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('error!  ')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('your file has been written!')
//             })
//         })
//     })
// })
//     console.log('will read file')

// ////////////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);

// console.log(slugify('Fresh Avacados',{lowercase:true}))
const slugs = dataObj.map(el => slugify(el.productName, { lowercase: true }));
console.log(slugs);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);
  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace(/%PRODUCT_CARDS%/g, cardsHTML);
    // const output = tempOverview.replace(`${%PRODUCT_CARDS%}`,cardsHTML)
    response.end(output);

    // PRODUCT PAGE
  } else if (pathname === "/product") {
    //   console.log(query)
    response.writeHead(200, { "Content-type": "application/json" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);
    // API
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(data);
  } else {
    //NOT FOUND
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world"
    });
    response.end("<h1>page not found - 404</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
