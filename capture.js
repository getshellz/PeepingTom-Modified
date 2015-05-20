var page = require('webpage').create();
var system = require('system')

var url = system.args[1];
var filename = system.args[2];
page.viewportSize = { width: 1024, height: 768 };
page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };
//page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.settings.resourceTimeout = parseInt(system.args[3])

// for debugging solo runs of capture.js

page.onResourceRequested = function(requestData, networkRequest) {
    console.log('********** onResourceRequested **********');
    console.log('[*] URL: ' + requestData.url);
};

page.onResourceError = function(resourceError) {
    console.log('********** onResourceError **********');
    console.log('[!] Unable to load resource #' + resourceError.id);
    console.log('[!] URL: ' + resourceError.url + ')');
    console.log('[!] Error code: ' + resourceError.errorCode);
    console.log('[!] Description: ' + resourceError.errorString);
};

page.onError = function(msg, trace) {
    console.log('********** onError **********');
    var msgStack = ['[!] Error: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.log(msgStack.join('\n'));
};

// end debugging

page.onResourceTimeout = function(request) {
    console.log('********** onResourceTimeout **********');
    console.log('[!] Response (#' + request.id + '): ' + JSON.stringify(request));
    phantom.exit(1);
};

page.open(url, function(status) {
    //console.log('[*] Status: ' + status);
    if (status !== 'success') {
        console.log('[!] Unable to render: ' + page.url);
        phantom.exit(1)
    } else {
        window.setTimeout(function() {
            page.render(filename);
            console.log('[!] Successfully rendered: ' + url);
            phantom.exit(0);
        }, 500);
    }
});
