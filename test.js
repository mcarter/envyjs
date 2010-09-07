require("./jsio/jsio");
jsio('import base');
var logger = base.logging.get('test.js');
jsio('import .envy');

var test = process.argv[2]
jsio ('import .tests.test_' + test);