/*!
{
  "name": "3rd Party Cookies",
  "property": "cookies3rdparty",
  "tags": ["storage"],
  "authors": ["chethan879", "philippsimon"]
}
!*/
/* DOC
Detects whether cross domain 3rd party cookie access is supported.

```PHP
<?php
$cookie_name = 'test';
$cookie_val = '1';

if (array_key_exists('type', $_GET)) {
  switch ($_GET['type']) {
    case 'set':
      setcookie($cookie_name, $cookie_val, time() + 60, "/");
      echo $_GET['callback'] . '()';
      break;
    case 'exists':
      $cookie_exists = array_key_exists($cookie_name, $_COOKIES) && $_COOKIES[$cookie_name] == $cookie_val;
      echo $_GET['callback'] . '(' . ($cookie_exists ? 'true' : 'false') . ')';
      break;
    case 'clear':
      setcookie($cookie_name, $cookie_val, 0, "/");
      echo $_GET['callback'] . '()';
      break;
  }
}
?>
```
*/

define(['Modernizr', 'createElement', 'test/cookies'], function(Modernizr, createElement) {

  Modernizr.addAsyncTest(function() {

    var thirdPartyTestURL = 'http://hbbtv-extern-fe01.sim-technik.de/chethan/send_callback.php';

    jsonp(thirdPartyTestURL + '?type=set', function(error) {
      if (error) {
        Modernizr.addTest('cookies3rdparty', false);
        return;
      }
      jsonp(thirdPartyTestURL + '?type=exists', function(error, thirdPartyCookiesSupported) {
        if (error) {
          Modernizr.addTest('cookies3rdparty', false);
          return;
        }
        jsonp(thirdPartyTestURL + '?type=clear', function() {
          Modernizr.addTest('cookies3rdparty', !!thirdPartyCookiesSupported);
        });
      });
    });
  });

  /**
   * Make a JSONP request
   *
   * @param {string} url
   * @param {function} callback
   */
  function jsonp(url, callback) {
    var callbackName = 'callback_' + Math.floor(Math.random() * 1000000000);
    window[callbackName] = function(data) {
      clearTimeout(timeout);
      setTimeout(function() {
        delete window[callbackName];
        script.parentElement.removeChild(script);
        callback(undefined, data);
      }, 0);
    };
    var timeout = setTimeout(function() {
      delete window[callbackName];
      script.parentElement.removeChild(script);
      callback('timeout');
    }, 5000);
    var script = createElement('script');
    script.type = 'text/javascript';
    script.src = url + (url.match(/\?/) ? '&' : '?') + 'callback=' + callbackName;
    window.document.getElementsByTagName('head')[0].appendChild(script);
  }

});
