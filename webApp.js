module.exports = function(webApp){
	webApp.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
	});
}