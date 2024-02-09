const http = require('http');
const { Gitlab } = require('@gitbeaker/node');
const { ProjectsBundle } = require('@gitbeaker/node');
const fs = require('fs');

// configure GitBreaker
// set NODE_TLS_REJECT_UNAUTHORIZED=0
const api = new Gitlab({
	token: 'glpat-Ag8BcYP_AQaGNLa-s2XJ',
	host: 'https://gitlab-gi.group.net/'
});

// configure HTTP server
const hostname = '127.0.0.1';
const port = 3000;

const streamAllProj = fs.createWriteStream('./all_proj.txt');
const streamTree = fs.createWriteStream('./tree.txt');
const streamCommit = fs.createWriteStream('./commit.txt');
const streamDiff = fs.createWriteStream('./diff.txt');
const streamFileInRevision = fs.createWriteStream('./fileInRevision.txt');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  
  //const fileContent = api.RepositoryFiles.showRaw(464, 'src/main/java/com/lv/gi/rating/orchestration/marshaller/AbstractPolarisPayloadRequestMarshaller.java', {ref: 'master'}).then((value) => {
  //  console.log(value);
  //});
  
  //api.Groups.all().then((v) => {
  //  console.log("--1------------");
//	console.log(v.forEach((item) => console.log(item)));
//	console.log("--2------------");
//  });

	// console.log("--start all projects------------ " + new Date().toISOString());
	// api.Projects.all().then((projects) => {
	// 	projects.forEach((p) => {
	// 		streamAllProj.write(JSON.stringify(p));
	// 		api.Repositories.tree(p.id, '/').then((tree) => {
	// 			streamTree.write("-----------------------------" + p.name + "-----------------------------\n");
	// 			tree.forEach((tr) => {
	// 				streamTree.write(JSON.stringify(tr)+"\n");			
	// 			});
	// 		});
	// 	});
	// 	console.log("--end------------ " + new Date().toISOString());
	// });

	console.log("--start all commits ------------ " + new Date().toISOString());

	api.Commits.diff(464, '50584857d278dace9c4a022b862aa9654b8f4b5b').then((d) => {
		streamDiff.write(JSON.stringify(d));
		console.log("--end diff------------ " + new Date().toISOString());
	});
	const fileContent = api.RepositoryFiles.showRaw(464, 'src/main/java/com/lv/gi/rating/orchestration/flow/QuoteRequestFlowConfig.java', {ref: '50584857d278dace9c4a022b862aa9654b8f4b5b'}).then((value) => {
		streamFileInRevision.write(value);
		console.log("--end streamFileInRevision------------ " + new Date().toISOString());
	});
	api.Commits.all(464).then((commits) => {
		commits.forEach((commit) => {
			if (commit.id == '50584857d278dace9c4a022b862aa9654b8f4b5b' ) {
				streamCommit.write(JSON.stringify(commit));
			}	
		});
		console.log("--end commits------------ " + new Date().toISOString());
	});

	// let i=0;
	// api.Commits.all(464).then((commit) => {
	// 	if (i<10) {
	// 		api.Commits.diff(464, commit.id).then((d) => {
	// 			streamCommit.write(JSON.stringify(d));
	// 		});
	// 		// streamCommit.write(JSON.stringify(commit));
	// 	} else {
	// 		i = i + 1;
	// 	}
	// 	// api.Commits.diff(p.id, commit.sha).then((d) => {
	// 	// 	streamCommit.write(JSON.stringify(d));
	// 	// });
	// 	console.log("--end------------ " + new Date().toISOString());
	// });
});

// node server.js