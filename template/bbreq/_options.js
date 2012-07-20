/*jshint evil: false, bitwise:false, strict: true, undef: true, white:false, onevar:false, nomen:false, browser:true, plusplus:false */
/* require */
  
  /*
   * Options setup the generator for specific configuration.
   *
   * info: documents usage. format: description, params, helpers, partials.
   * 		params are used to validate command line arg count, and names mapped to handlebar data.
   * Handlebar Helpers
   * Handlbar Partials
   * Note: since the template folder can be anywhere. dependency Handlebars is passed 
   * in for path resolution.
   * 
   */
   
  module.exports = Option;

  function Option(Handlebars) {
	"use strict";

	var path = require('path');

		this.info = {
			description : 'describe',
			params: [
				{'paramX': 'describe'}
			],
			helpers: [
				{'helperX': 'describe'}
			],
			partials: [
				{'partialX' : 'describe'}
			]
		}; 

		/*
		Handlebars.registerHelper('helperX', function() {
			return result;
		});

		Handlebars.registerPartial('partialX', function() {
			return result;
		});
		*/

};