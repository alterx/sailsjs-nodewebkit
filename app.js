/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */
// Ensure a "sails" can be located:
(function() {

    var Readable = require("stream").Readable,
        util = require("util"),
        sails,
        loaded = false,
        rc;

    /*
        If you're going to use other nodejs modules (most likely yes),
        you're going to need this custom implementation of stdin
        since node-wenkit doesn't implement it

        Thanks, http://www.rodrigopandini.com/blog/getting-started-with-johnny-five-and-node-webkit/
    */
    util.inherits(MyStream, Readable);

    function MyStream(opt) {
        Readable.call(this, opt);
    }

    MyStream.prototype._read = function() {};

    process.__defineGetter__("stdin", function() {
        if (process.__stdin) return process.__stdin;
        process.__stdin = new MyStream();
        return process.__stdin;
    });

    /*
      This function is exported and accessible in the front end
      check out splash.html
    */
    exports.onLoad = function() {
        var gui = window.require('nw.gui');

        gui.Window.get(window).on('loaded', function() {
            if (loaded) {
                return;
            }

            window.location.href = "http://localhost:1337/";
            loaded = true;
        });

        try {
            sails = require('sails');
        } catch (e) {
            console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
            console.error('To do that, run `npm install sails`');
            console.error('');
            console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
            console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
            console.error('but if it doesn\'t, the app will run with the global sails instead!');
            return;
        }

        // Try to get `rc` dependency
        try {
            rc = require('rc');
        } catch (e0) {
            try {
                rc = require('sails/node_modules/rc');
            } catch (e1) {
                console.error('Could not find dependency: `rc`.');
                console.error('Your `.sailsrc` file(s) will be ignored.');
                console.error('To resolve this, run:');
                console.error('npm install rc --save');
                rc = function() {
                    return {};
                };
            }
        }

        // Start server
        sails.lift(rc('sails'));
    }
})();
