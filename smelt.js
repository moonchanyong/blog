#!/bin/env node

const fs = require('fs');

const html = fs.readFileSync("./pages/Describing Blog.html").toString();

fs.writeFileSync("./pages/Describing Blog.html", html.replace(/<a h/g, '<a target="content" h'));
