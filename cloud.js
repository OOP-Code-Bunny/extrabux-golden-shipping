var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world ralf!22222');
});

AV.Cloud.define('hello1', function(request, response) {
    response.success('Hello world ralf!');
});

AV.Cloud.define('hello2', function(request, response) {
    
    
    
    response.success('Hello world ralfasdfasdf!');
});

module.exports = AV.Cloud;
