var Handlebars = require('handlebars');
require("../lib/utils.js");

    describe("string helper: toDash", function() { 
        it("formats from Camel", function() {
            expect("aBcDe".toDash()).toEqual("a-bc-de");
        });

        /*

     	it("converts to dashes format excluding first charcater", function() {
            expect("ABcDe".toDash()).toEqual("abc-de");
        });
     

	   it("converts dashes to pascal", function() {
            expect("a-bc-de".toDash()).toEqual("ABcDe");
        });

		*/

    });





     


