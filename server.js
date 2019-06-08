const http = require("http");
const fs = require("fs").promises;
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const mime = require("mime");
const PORT = 8080;

console.log(`youtube-dl listening on ${PORT}...`);
const server = http.createServer();
server.on("request", (req, res) => {
  console.log(`request ${req.url}`);

  const errorHandler = err => {
    res.writeHead(500, { "content-type": "text/html" });
    const error = JSON.stringify(err, Object.getOwnPropertyNames(err));
    console.log(error)
    res.end(`Error: ${error}`);
  };

  const handler = ({ params = [] } = {}) => {
    const videoPath = req.url
      .split("/")
      .slice(2)
      .join("/");
    const urlToDownload = `https://www.${videoPath}` 
    const commandParams = [...params, 'print-json'].map(param => ` --${param}`).join('');
    const command = `/usr/local/bin/youtube-dl ${urlToDownload} ${commandParams.trim()}`
    console.log(`command: ${command}`)
    exec(command)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          console.warn(stderr);
        }
        const out = JSON.parse(stdout);
        const filename = out._filename;
        console.log(`filename: ${filename}`)
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("content-type", mime.getType(filename));
        return fs.readFile(filename, { encoding: null })
          .then(blob => {
            res.end(blob);
            return fs.unlink(filename)
          })
      })
      .catch(errorHandler);
  }

  if (req.url.startsWith("/video/")) {
    handler({ params: ['format bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best']})
  } else if (req.url.startsWith('/audio/')) {
    return handler({ params: ['extract-audio'] })
  } else {
    console.log(`404: ${res.url}`);
    res.writeHead(404);
    res.end();
  }
});
server.on("connect", () => {
  console.log("connected");
});

server.listen(PORT);
