difine([],function () {
function getHostName() {
    var host_name = window.location.host;
    var host_protocol = window.location.protocol;
    var url = host_protocol + "//" + host_name;
    var host_port = window.location.port;
    if (host_port != "80" && host_port != "")
        return url + ":" + host_port;
    else
        return url;
}
var domain = getHostName();

var method = {
	"ddd" : "ddd"
};
var api = {};
api.post = function(url,methods,callback) {
 $.ajax({
     type: "POST",
     data: methods,
     url: url,
     success: function(data) {
        callback(data)
     },
     error: function() {}
 });
};
})
