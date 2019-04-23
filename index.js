////////////////////
// INIT GREENLOCK //
////////////////////

var path = require('path');
var os = require('os')
var Greenlock = require('greenlock');

var greenlock = Greenlock.create({
  version: 'draft-12'
, server: acmeServer()

  // Use the approveDomains callback to set per-domain config
  // (default: approve any domain that passes self-test of built-in challenges)
, approveDomains: approveDomains

  // the default servername to use when the client doesn't specify
, servername: 'example.com'

  // If you wish to replace the default account and domain key storage plugin
, store: require('le-store-fs').create({
    configDir: path.join(os.homedir(), 'acme/etc')
  , webrootPath: '/tmp/acme-challenges'
  })
});

/////////////////////
// ACME Server //
/////////////////////
function acmeServer() {
  console.log(`Using ${process.env.NODE_ENV} API`);
  if (process.env.NODE_ENV === 'production') {
    return 'https://acme-v02.api.letsencrypt.org/directory';
  } else {
    return 'https://acme-staging-v02.api.letsencrypt.org/directory';
  }
}



/////////////////////
// APPROVE DOMAINS //
/////////////////////

var http01 = require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' });
function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated
  // email addresses with domains and agreements and such

  // Opt-in to submit stats and get important updates
  opts.communityMember = true;

  // If you wish to replace the default challenge plugin, you may do so here
  opts.challenges = { 'http-01': http01 };

  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  // certs.domains;
  // certs.altnames;
  opts.email = 'aws@cygnus.com';
  opts.agreeTos = true;

  // NOTE: you can also change other options such as `challengeType` and `challenge`
  // opts.challengeType = 'http-01';
  // opts.challenge = require('le-challenge-fs').create({});

  cb(null, { options: opts, certs: certs });
}

////////////////////
// CREATE SERVERS //
////////////////////

var redir = require('redirect-https')();
require('http').createServer(greenlock.middleware(redir)).listen(80);

require('https').createServer(greenlock.tlsOptions, function (req, res) {
  res.end('Hello, Secure World!');
}).listen(443);

