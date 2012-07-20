/*jshint evil: false, bitwise:false, strict: true, undef: true, white:false, onevar:false, nomen:false, browser:true, plusplus:false */
/* require */

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
    issues in progress:
    
    å
    ignore {{name}} if matches current folder name.
    empty folders not saved in git. (.file / toJson )
    
    ∫
    _setup.js files. get required.
    for meta: param info.
    
    ç
    handlbar helper registration, partial registration.
    data defaults.

*/

var path = require('path');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync;
var sys = require('util');//why mutate utils to sys -untis?
var Handlebars = require('handlebars');
var cmdr = require('commander');

var util = require('../lib/utils');
var TemplateModel = require('../lib/template-model');



(function(){
   "use strict";

    exports.Generator = function Generator(args) {
        
        var version = '0.0.1';
        //cl : command line interface
        var cl = cmdr.version(version);  

        //todo: read .options
        cl.option('-s --sourcetemplate [value]','Set the source template folder (absolute path). Defaults to jen/template/');
        cl.option('bbqreq','backbone with require generators.');

        cl.parse(process.argv);

        var defaultOptionsPath = path.join(__dirname, 'default-options.json');
        var defaultOptions = fs.readFileSync(defaultOptionsPath,'ascii');
            defaultOptions = JSON.parse(defaultOptions);

        //change template source. (options -s)
        if(cl.sourcetemplate) {
            //commander mutates response: true if flag with no value, if value set, then value. 
            if(cl.sourcetemplate === true){
                console.log("template source folder currently", getSourceTemplate());
            } else
            if (path.existsSync(cl.sourcetemplate)) {
                defaultOptions.sourceTemplateFolder = cl.sourcetemplate;
                fs.writeFileSync(defaultOptionsPath, JSON.stringify(defaultOptions));
                console.log('Template source folder set to:' + defaultOptions.sourceTemplateFolder);
            } else {
                console.log("Folder not found: ", cl.sourcetemplate, ". Template Source folder not changed.");
            }
            process.exit();
        } 

   
        var templateFolder =  defaultOptions.sourceTemplateFolder !=='' ? defaultOptions.sourceTemplateFolder :  path.join(__dirname, '/../template/');
        
        var sourceRoot = path.join(templateFolder, args[1]);
        var destRoot = path.join(process.cwd());
        var destDir = destRoot.match(/^.*\/(.*)$/).pop();

        //console.log('--------------------');
        //console.log('Ready to Generate', args[1], args[2], 'TO:', destRoot);
        


        if(args.length < 2) {
            console.log('insufficent arguments. Enter jen {generatorName}');
            return;
        }

        // todo: 
        // after readning template _options, check arg number,
        // show help if not enough args 
        // also show help if jen -h templatename.




        new TemplateModel(sourceRoot, function(config) {

            if(config.error) {
                console.log('Error loading template: ', config.error);
            } else {
            
                var options = _loadCustomOptions(config.optionFiles);
                _logPreRun(config, options);
                
                cl.confirm('Continue? ', function(confirmed){               
                    if(confirmed) {
                        for(var j in config.dirs) {
                            _createDir(path.join(destRoot,config.dirs[j]), options);
                        }
                        for(var i in config.files) {
                            _createFile(options, config.files[i], sourceRoot, destRoot);
                        }
                        console.log('Done');
                    } else {
                        console.log('Cancelled');
                    }
                     process.exit();
                });
            }

        });
            

            
        function getSourceTemplate() {
            return  defaultOptions.sourceTemplateFolder !=='' ? defaultOptions.sourceTemplateFolder :  path.join(__dirname, '/../template/');
        }

        /*
         * _options.js files in template folders loadeer.
         */
        function _loadCustomOptions(optionFiles) {
            console.log("loading custom javascript options:\n",optionFiles);
            for(var i in optionFiles) {
               var Option =  require(optionFiles[i]);
               var option = new Option(Handlebars);

                var requiredParams =  option.info.params;  
                var requiredParamsLength = requiredParams.length; //+1 for template name.
                var argLength = args.length -1;
                //console.log(argLength, requiredParamsLength);
                if(argLength -1  < requiredParamsLength) {
                    console.log('For Generator, Was expecting at least ', requiredParamsLength, ' arguments');
                    console.log(requiredParams);
                process.exit();
                } else {

                    var options={
                    app: args[2].toDash()
                    };
                    console.log('options made' , options);
                    return options;
                }
            }
            
        };

        /*
         _templatePathName
         handle {{params}} in file names/paths
        */
        function _templatePathName(path, options) {
            if(path.indexOf('{{') !== -1) {
                var tmpl = Handlebars.compile(path);
                path = tmpl(options);
            }
            return path;
        }

        /*
        * user feedback of outcome before running generator.
        */
        function _logPreRun(config, options) {

            sys.puts('Folders:');
            for(var i in config.dirs) {
              var path = _templatePathName(config.dirs[i], options);
              sys.puts(path);
            }

            sys.puts('Files:');
            for(var j in config.files) {
              var filePath = _templatePathName(config.files[j], options);
              sys.puts(filePath);
            }
            console.log('--------------------');
        }


        function _createFile(options, fileName, sourceRoot, destRoot) {
            var err;
            var dest = path.join(destRoot, fileName) ;
            dest = _templatePathName(dest, options);

            if(existsSync(dest)) {
                err = 'file exists: ' + '  ' + dest + '   -Not Overwritten.';
                sys.puts(err);
            }

            var sourceFile = path.join(sourceRoot, fileName );
            if(!existsSync(sourceFile)) {
                err = 'template file not found' + ' ' + sourceFile + '. Halting generation of: ' + dest;
                sys.puts(err);
            }

            if (!err) {
                var sourceTemplate = fs.readFileSync(sourceFile, 'ascii');
                var template = Handlebars.compile(sourceTemplate);

                var result = template(options);
                fs.writeFileSync(dest, result);
                sys.puts('created file: ' + dest);
            }
        }

        function _createDir(dir, options) {
            dir = _templatePathName(dir, options);
            if (existsSync(dir)) {
                sys.puts('dir exists:' + '  ' + dir);
            } else {
                fs.mkdirSync(dir);
                sys.puts('created dir: ' + '  ' + dir);
            }
        }
    };


})();
