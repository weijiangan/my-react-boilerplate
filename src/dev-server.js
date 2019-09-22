const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const config = require("../config/webpack.dev");
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: "warn",
      publicPath: config.output.publicPath
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

app.use("/", express.static(path.join(__dirname, "..", "dist")));

// for SPAs: route non-file routes (without extension) to index
app.get("^[^\\.]+$", (req, res, next) => {
  // for use with graphql-yoga
  if (req.url === "/graphql") return next();
  res.sendFile(
    "index.html",
    { root: path.join(__dirname, "..", "dist") },
    err => {
      if (err) next(err);
    }
  );
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
