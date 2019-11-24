#!/bin/env node

const fs = require('fs');
const replacer = str => {
  if (str.indexOf('linkedin') > 0 || str.indexOf('github') > 0) return str.slice(0, str.length - 1) + ' target="tab"' + ">";
  else return str.slice(0, str.length - 1) + ' target="content"' + ">";
}

const html = fs.readFileSync("./pages/Describing Blog.html").toString();

fs.writeFileSync("./pages/Describing Blog.html",
html.replace(/<\s*a [^>]*>/g, replacer));
