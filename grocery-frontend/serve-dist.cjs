const fs = require("fs");
const http = require("http");
const path = require("path");

const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "127.0.0.1";
const apiTarget = process.env.API_TARGET || "http://localhost:8080";
const root = path.resolve(__dirname, "dist");

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    if (req.url.startsWith("/api")) {
      const proxyRequest = http.request(`${apiTarget}${req.url}`, {
        method: req.method,
        headers: {
          ...req.headers,
          host: new URL(apiTarget).host,
        },
      }, (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.pipe(res);
      });

      proxyRequest.on("error", () => {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Backend API is unavailable" }));
      });

      req.pipe(proxyRequest);
      return;
    }

    const requestPath = decodeURIComponent(req.url.split("?")[0]);
    const relativePath = requestPath === "/" ? "/index.html" : requestPath;
    const filePath = path.join(root, relativePath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
          if (fallbackError) {
            res.writeHead(404);
            res.end("Not found");
            return;
          }

          res.writeHead(200, {
            "Content-Type": "text/html",
            "Cache-Control": "no-store",
          });
          res.end(fallback);
        });
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`FreshCart frontend http://${host}:${port}/`);
  });
