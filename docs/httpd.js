const express = require('express');
const app = express();
app.use(express.static("./"));
const server = app.listen(8080, () => console.log("Listening for HTTP on port 8080\n"));