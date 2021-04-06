var express = require('express');
const helmet = require('helmet');
var app = express();


// Hide Express API header
app.use(helmet.hidePoweredBy());

// frameguard deny can help prevent clickjacking attacks
app.use(helmet.frameguard({
    action: "deny",
  })
);

// disables broswer cross site scripting filter
app.use(helmet.xssFilter());

// prevent browser from MIME sniffing content
app.use(helmet.noSniff());

// prevent internet explorer from executing untrusted html files
app.use(helmet.ieNoOpen());

// using a security policy called HSTS to force HTTPS

const nightydaysinseconds = 90*24*60*60;
app.use(helmet.hsts({
maxAge: nightydaysinseconds,
// force is their to override repl.it's own hsts header
force: true
})
);

// disabling dns prefetch
// To improve performance, most browsers prefetch DNS records for the links in a page. In that way the destination ip is already known when the user clicks on a link. This may lead to over-use of the DNS service (if you own a big website, visited by millions people…), privacy issues (one eavesdropper could infer that you are on a certain page), or page statistics alteration (some links may appear visited even if they are not). If you have high security needs you can disable DNS prefetching, at the cost of a performance penalty.
app.use(helmet.dnsPrefetchControl());

// disabling caching
// If you are releasing an update for your website, and you want the users to always download the newer version, you can (try to) disable caching on client’s browser. It can be useful in development too. Caching has performance benefits, which you will lose, so only use this option when there is a real need.

app.use(helmet.noCache());

// setting up a CSP (Content Security Policy) which can help prevent cross site script attacks

app.use(helmet.contentSecurityPolicy({
directives: {
  defaultSrc : ["'self'"],
  scriptSrc: ["'self'",'trusted-cdn.com'],

}
})
);



// in the real world, its better to use app.use(helmet) because that includes evrything except CSP and noCache
// individual componets can be turned on an off with congiurable objects

// Example
/*
app.use(helmet({
  frameguard: {         // configure
    action: 'deny'
  },
  contentSecurityPolicy: {    // enable and configure
    directives: {
      defaultSrc: ["self"],
      styleSrc: ['style.com'],
    }
  },
  dnsPrefetchControl: false     // disable
}))
*/

module.exports = app;
var api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
