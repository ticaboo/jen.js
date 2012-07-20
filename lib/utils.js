/*jshint evil: false, bitwise:false, strict: true, undef: true, white:false, onevar:false, nomen:false, browser:true, plusplus:false */
/* require, process */

/*
 * Copyright (c) 2012 Henry Kemp
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */


/*
    utils, shared Handlebar custom helpers.
    Note: add your own project/generator specific handlebar helpers and partials in
    template/??/_setup.js.
*/
(function() {
  "use strict";

var Handlebars = require('handlebars');


String.prototype.toCamel = function(){
    return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

String.prototype.toPascal = function(){
    return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

String.prototype.toDash = function(){
    return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};


String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};



Handlebars.registerHelper('toCamel', function(str) {
  return str.toCamel();
});


Handlebars.registerHelper('toDash', function(str) {
  return str.toDash();
});

Handlebars.registerHelper('toUnderscore', function(str) {
  return str.toUnderscore();
});


Handlebars.registerHelper('trim', function(str) {
  return str.trim();
});

Handlebars.registerHelper('toPascal', function(str) {
    var result = str.toCamel();
    return result.toUpperCase().charAt(0) + result.substring(1);
});
     


})();
