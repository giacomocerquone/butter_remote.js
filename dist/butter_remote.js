/*
    Author:     Giacomo Cerquone
    Email:      cerquone96@hotmail.it
    Website:    http://www.giacomocerquone.com

    This library is released under the GPL 3 license.
*/
var butter_remote = {
    //LIB PROPERTIES
    lib: this,
    isConnected: true,
    opt: {
        username: "popcorn", 
        password: "popcorn",
        ip: "127.0.0.1",
        port: "8008",
        debug: false
    },

    //LIB METHODS
    init: function(user_opt, callback) {
        lib = this;
        user_opt = lib.extend(lib.opt, user_opt);
        lib.ping(callback);
    },

    APIcall: function(api_method, api_params, callback) {
        request         = {};
        request.id      = Math.floor((Math.random() * 100) + 1);
        request.jsonrpc = '2.0';
        request.method  = api_method;
        request.params  = (api_params) ? api_params : [];

        var ajax = new XMLHttpRequest();
        ajax.open('POST', "http://" + lib.opt.ip + ":" + lib.opt.port, true);
        ajax.setRequestHeader('Authorization', window.btoa(lib.opt.username + ":" + lib.opt.password));
        ajax.setRequestHeader('Accept', 'application/json;');
        ajax.timeout = 3000;

        ajax.onreadystatechange = function() {
          if (this.readyState === 4) {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                lib.handleData(data, api_method);

                if(callback) callback(data);
            } else {
 
                lib.log("Connection time out: can't reach butter. Try changing the settings.");
                lib.isConnected = "false";
            }
          }
        };

        ajax.send(JSON.stringify(request));
        ajax = null;

    },

    handleData: function(data, method) {

        if (method == "ping") {
            if (data.error != undefined) {
                lib.log("Invalid login: Check username and password.");
                lib.isConnected = false;
            }
        }


        lib.log(data);
    },

    log: function(msg) {
        if (lib.opt.debug == true) console.log(msg);
    },

    extend: function(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
          continue;

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key))
            out[key] = arguments[i][key];
        }
      }

      return out;
    },

    //BUTTER METHODS
    ping:               function(callback) { lib.APIcall("ping", false, callback); },
    enter:              function() { lib.APIcall("enter"); },
    back:               function() { lib.APIcall("back"); },
    getviewstack:       function(callback) { lib.APIcall("getviewstack", false, callback); },
    getgenres:          function(callback) { lib.APIcall("getgenres", false, callback); },
    getsorters:         function(callback) { lib.APIcall("getsorters", false, callback); },
    gettypes:           function(callback) { lib.APIcall("gettypes", false, callback); },
    getcurrenttab:      function(callback) { lib.APIcall("getcurrenttab", false, callback); },
    getfullscreen:      function(callback) { lib.APIcall("getfullscreen", false, callback); },
    getplayers:         function(callback) { lib.APIcall("getplayers", false, callback); },
    startstream:        function(params) { lib.APIcall("startstream", params); },
    setplayer:          function(params) { lib.APIcall("setplayer", params); },
    listennotifications:function(callback) { lib.APIcall("listennotifications", false, callback); },
    nextseason:         function() { lib.APIcall("nextseason"); },
    previousseason:     function() { lib.APIcall("previousseason"); },
    selectepisode:      function(params) { lib.APIcall("selectepisode", params); },
    togglequality:      function() { lib.APIcall("togglequality"); },
    watchtrailer:       function() { lib.APIcall("watchtrailer"); },
    getselection:       function(params, callback) { if (typeof params === "function") { callback = params; params = false; } lib.APIcall("getselection", params, callback); },
    getcurrentlist:     function(params, callback) { if (typeof params === "function") { callback = params; params = false; } lib.APIcall("getcurrentlist", params, callback); },
    getsubtitles:       function(callback) { lib.APIcall("getsubtitles", false, callback); },
    togglemute:         function() { lib.APIcall("togglemute"); },
    togglefullscreen:   function() { lib.APIcall("togglefullscreen"); },
    toggleplaying:      function() { lib.APIcall("toggleplaying"); },
    volume:             function(params, callback) { if (typeof params === "function") { callback = params; params = false; } lib.APIcall("volume", params, callback); },
    getplaying:         function(callback) { lib.APIcall("getplaying", false, callback) },
    seek:               function(params) { lib.APIcall("seek", params); },
    subtitleoffset:     function(params) { lib.APIcall("subtitleoffset", params); },
    setsubtitle:        function(params) { lib.APIcall("setsubtitle", params); },
    getstreamurl:       function(callback) { lib.APIcall("getstreamurl", false, callback); },   
    toggletab:          function() { lib.APIcall("toggletab"); },
    showslist:          function() { lib.APIcall("showslist"); },
    animelist:          function() { lib.APIcall("animelist"); },
    movieslist:         function() { lib.APIcall("movieslist"); },
    showwatchlist:      function() { lib.APIcall("showwatchlist"); },
    showfavourites:     function() { lib.APIcall("showfavourites"); },
    showabout:          function() { lib.APIcall("showabout"); },
    showsettings:       function() { lib.APIcall("showsettings"); },
    togglewatched:      function() { lib.APIcall("togglewatched"); },
    togglefavourite:    function() { lib.APIcall("togglefavourite"); },
    clearsearch:        function() { lib.APIcall("clearsearch"); },
    filtergenre:        function(params) { lib.APIcall("filtergenre", params); },
    filtersorter:       function(params) { lib.APIcall("filtersorter", params); },
    filtertype:         function(params) { lib.APIcall("filtertype", params); },
    filtersearch:       function(params) { lib.APIcall("filtersearch", params); },
    setselection:       function(params) { lib.APIcall("setselection", params); },
    up:                 function() { lib.APIcall("up"); },
    down:               function() { lib.APIcall("down"); },
    right:              function() { lib.APIcall("right"); },
    left:               function() { lib.APIcall("left"); }
};
