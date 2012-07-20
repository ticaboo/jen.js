/*jshint evil: false, bitwise:false, strict: true, undef: true, white:false, onevar:false, nomen:false, browser:true, plusplus:false */
/* */


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
    models data from 
        * fs: geniejs/template folder
          json (todo)
          http (todo)
*/
  
  //
  // https://github.com/daaku/nodejs-walker npm walker to dead repo. Meanwhile using extended version directly. 
  // package.json has makeerror dependancy for it to work. 
   var walk  = require('../lib/walker'); 
   var path = require('path');

   module.exports = TemplateModel;
    
   /*
    * @param root: the folder in jen/template/{root}
    * to read for files & dirs to be generated.
    *
    * @param done: callback when dir walk complete.
    *
    * result: generates files[] and dirs[] unless error.
    * 
    * Note: resultant paths stripped of root.
    *
    * Note: -ignores hidden dot prepended files and directories e.g. .DS_Store
    *       -does not hanle symlinks (though easy enough to add if required).
    */

    function TemplateModel(root, done) {
        "use strict";
        
        this.files   = [];
        this.dirs = [];
        this.optionFiles = [];
        this.error = null;
        this.root = root;
        var self = this;

        walk(this.root)
            .filter(function(obj, stat) {
                var base = obj.match(/^.*\/(.*)$/).pop();
                if (base && base.substring(0,1) === '.') {
                  return false;
                }
                return true;
              })
            .on('file', function(file) {
                if(file.indexOf('_options.js') === -1) {
                self.files.push(stripRoot(file));
                } else {
                    self.optionFiles.push(file);          
                }
            })
            .on('dir', function(dir) {
                self.dirs.push(stripRoot(dir));
            })
            .on('error', function(error, entry, stat) {
                self.error = error;
                done(self);
            })
            .on('end', function() {
                if(self.dirs[0] ==='') {
                    //first dir === root, so '',drop it.
                    self.dirs.shift();
                }
                done(self);
            });

        function stripRoot(str) {
            return str.replace(self.root, '');
        }
    }


