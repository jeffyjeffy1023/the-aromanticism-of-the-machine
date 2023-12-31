// ==UserScript==
// @name           Aromanticism of the Machine
// @namespace      http://userscripts.org/users/23652
// @author Jeffy aka catboybeebop
// @description    Replaces "eroticism" with "aromanticism". on websites. Made with love, but no romance.
// @include        http://*
// @include        https://*
// @include        file://*
// @exclude        http://userscripts.org/scripts/review/*
// @exclude        http://userscripts.org/scripts/edit/*
// @exclude        http://userscripts.org/scripts/edit_src/*
// @exclude        https://userscripts.org/scripts/review/*
// @exclude        https://userscripts.org/scripts/edit/*
// @exclude        https://userscripts.org/scripts/edit_src/*
// @copyright      JoeSimmons
// @version        1.1.3
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://github.com/jeffyjeffy1023/the-aromanticism-of-the-machine/raw/main/aromanticism.user.js
// @updateURL https://github.com/jeffyjeffy1023/the-aromanticism-of-the-machine/raw/main/aromanticism.user.js
// Based on https://greasyfork.org/en/scripts/10976-replace-text-on-webpages/code
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
       //  'your a' : 'you\'re a',
       //  'imo' : 'in my opinion',
       // 'im\\*o' : 'matching an asterisk, not a wildcard',
       // '/\\bD\\b/g' : '[D]',

    // Forgot to comment these examples out before, I'm really sorry.

    ///////////////////////////////////////////////////////
    'eroticism':'aromanticism'};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());
