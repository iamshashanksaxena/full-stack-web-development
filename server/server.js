const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer(handleRequest);
server.listen(3000, onServerStart);

function handleRequest(req, res) {
	if (req.method === 'GET' && req.url === '/') {
		fs.readFile('index.html', (err, data) => {
			if(err) {
				res.writeHead(500, { 'Content-Type' : 'text/html'});
				res.write(`<p>Error Loading Form.</p>`);
				res.end();
			}
			
			res.writeHead(200, { 'Content-Type' : 'text/html'});
			res.write(data);
			res.end();

		});
	}
	
	else if (req.method === 'POST' && req.url === '/submit') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
				const parsedData = querystring.parse(body);
				
				
				fs.readFile('form_response.html', 'utf-8', (err, data) => {
					if(err) {
						res.writeHead(500, { 'Content-Type' : 'text/html'});
						res.write(`<p>Error Loading Form.</p>`);
						res.end();
					}
					
					let page = data
						.replace('{{name}}', parsedData.name)
						.replace('{{email}}', parsedData.email);
					
					res.writeHead(200, { 'Content-Type' : 'text/html'});
					res.write(page);
					res.end();

				});
		});
	}
	
	else {
		res.writeHead(404, { 'Content-Type' : 'text/html'});
		res.write(`<p>Page Not Found.</p>`);
		res.end();
	}
}

function onServerStart() {
	console.log("Server Started.");
}
