/*
    Author:     Giacomo Cerquone
    Email:      cerquone96@hotmail.it
    Website:    http://www.giacomocerquone.it

    This project is released under the GPL 3 license.
*/
var lib,
    isConnected = true,
    view = "",
    opt = {
        username: "popcorn", 
        password: "popcorn",
        ip: "127.0.0.1",
        port: "8008",
        debug: false
},
popcorntime_remote = {
    
    init: function(user_opt) {
        user_opt = $.extend(opt, user_opt);
        lib = this;

        lib.log('Initializing popcorntime_remote');
        lib.ping();
    },

    APIcall: function(api_method, api_params) {

        request         = {};
        request.id      = Math.floor((Math.random() * 100) + 1);
        request.jsonrpc = '2.0';
        request.method  = api_method;
        request.params  = (api_params) ? api_params : [];

        $.ajax({
            type: "POST",
            url: "http://" + opt.ip + ":" + opt.port,
            data: JSON.stringify(request),
            timeout: (api_method == 'listennotifications') ? 60000 : 3000,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', window.btoa(opt.username + ":" + opt.password));
            },
            success: function(data) {
                lib.handleData(data, api_method);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                lib.log("Connection time out: can't reach popcorn time. Try changing the settings.");
                isConnected = "false";
            },
            dataType: "json"
        });

    },

    handleData: function(data, method) {

        if (method == "ping") {
            if (data.error != undefined) {
                lib.log("Invalid login: Check username and password.");
                isConnected = false;
            }

        }
        
        lib.log(data);

    },

    log: function(msg) {
        if (opt.debug == true) console.log(msg);
    },

    //Everywhere
    ping: function() { lib.APIcall("ping"); },
    enter: function() { lib.APIcall("enter"); },
    back: function() { lib.APIcall("back"); },
    getviewstack: function() { lib.APIcall("getviewstack"); },

    //Tv Show Detail
    nextseason: function() { lib.APIcall("nextseason"); },
    previousseason: function() { lib.APIcall("previousseason"); },
    //Movie Detail
    togglequality: function() { lib.APIcall("togglequality"); },
    watchtrailer: function() { lib.APIcall("watchtrailer"); },
    //Player
    togglemute: function() { lib.APIcall("togglemute"); },
    togglefullscreen: function() { lib.APIcall("togglefullscreen"); },
    //Main Browser
    toggletab: function() { lib.APIcall("toggletab"); },
    showslist: function() { lib.APIcall("showslist"); },
    animelist: function() { lib.APIcall("animelist"); },
    movieslist: function() { lib.APIcall("movieslist"); },

    showwatchlist: function() { lib.APIcall("showwatchlist"); },
    showfavourites: function() { lib.APIcall("showfavourites"); },
    showabout: function() { lib.APIcall("showabout"); },
    showsettings: function() { lib.APIcall("showsettings"); },

    togglewatched: function() { lib.APIcall("togglewatched"); },
    togglefavourite: function() { lib.APIcall("togglefavourite"); },

    clearsearch: function() { lib.APIcall("clearsearch"); },

    filtergenre: function(params) { lib.APIcall("filtergenre", params); },
    filtersorter: function(params) { lib.APIcall("filtersorter", params); },
    filtertype: function(params) { lib.APIcall("filtertype", params); },
    filtersearch: function(params) { lib.APIcall("filtersearch", params); },

    up: function() { lib.APIcall("up"); },
    down: function() { lib.APIcall("down"); },
    right: function() { lib.APIcall("right"); },
    left: function() { lib.APIcall("left"); }

};