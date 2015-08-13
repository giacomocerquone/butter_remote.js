/*
    Author:     Giacomo Cerquone
    Email:      cerquone96@hotmail.it
    Website:    http://www.giacomocerquone.it

    This project is released under the GPL 3 license.
*/
;
(function($) {
    $.popcorntime_remote = function(options) {

        var plugin      = this,
            isConnected = true,
            view        = "";

        var init = function() {

            options = $.extend({
                username: "popcorn",
                password: "popcorn",
                ip: "127.0.0.1",
                port: "8008",
                debug: "false"
            }, options);

            log('Initializing popcorntime_remote');
            plugin.ping();
            //plugin.listennotifications();

        }


        /* PRIVATE METHODS */


        var APIcall = function(api_method, api_params) {

            request         = {};
            request.id      = Math.floor((Math.random() * 100) + 1);
            request.jsonrpc = '2.0';
            request.method  = api_method;
            request.params  = (api_params) ? api_params : [];

            $.ajax({
                type: "POST",
                url: "http://" + options.ip + ":" + options.port,
                data: JSON.stringify(request),
                timeout: (api_method == 'listennotifications') ? 60000 : 3000,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', window.btoa(options.username + ":" + options.password));
                },
                success: function(data) {
                    handleData(data, api_method);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (api_method == 'listennotifications') {
                        return plugin.listennotifications();
                    }
                    log("Connection time out: can't reach popcorn time. Try changing the settings.");
                    isConnected = "false";
                },
                dataType: "json"
            });

        }

        var handleData = function(data, method) {

            if (method == "ping") {
                if (data.error != undefined) {
                    log("Invalid login: Check username and password.");
                    isConnected = false;
                }
            }

            /*if (method == "listennotifications") {
                log(data);
                return plugin.listennotifications();
            }*/

            log(data);
        }

        var log = function(msg) {
            if (options.debug == true) console.log(msg);
        }

        plugin.listennotifications = function() {
            APIcall("listennotifications");
        }


        /* PUBLIC METHODS */

        //Everywhere
        plugin.ping = function() {
            APIcall("ping");
        }
        plugin.enter = function() {
            APIcall("enter");
        }
        plugin.back = function() {
            APIcall("back");
        }
        plugin.getviewstack = function() {
            APIcall("getviewstack");
        }


        //Tv Show Detail
        plugin.nextseason = function() {
            APIcall("nextseason");
        }
        plugin.previousseason = function() {
            APIcall("previousseason");
        }


        //Movie Detail
        plugin.togglequality = function() {
            APIcall("togglequality");
        }
        plugin.watchtrailer = function() {
            APIcall("watchtrailer");
        }


        //Player
        plugin.togglemute = function() {
            APIcall("togglemute");
        }
        plugin.togglefullscreen = function() {
            APIcall("togglefullscreen");
        }


        //Main Browser
        plugin.toggletab = function() {
            APIcall("toggletab");
        }
        plugin.showslist = function() {
            APIcall("showslist");
        }
        plugin.animelist = function() {
            APIcall("animelist");
        }
        plugin.movieslist = function() {
            APIcall("movieslist");
        }
        
        plugin.showwatchlist = function() {
            APIcall("showwatchlist");
        }
        plugin.showfavourites = function() {
            APIcall("showfavourites");
        }
        plugin.showabout = function() {
            APIcall("showabout");
        }
        plugin.showsettings = function() {
            APIcall("showsettings");
        }

        plugin.togglewatched = function() {
            APIcall("togglewatched");
        }
        plugin.togglefavourite = function() {
            APIcall("togglefavourite");
        }

        plugin.clearsearch = function() {
            APIcall("clearsearch");
        }

        plugin.filtergenre = function(params) {
            APIcall("filtergenre", params);
        }
        plugin.filtersorter = function(params) {
            APIcall("filtersorter", params);
        }
        plugin.filtertype = function(params) {
            APIcall("filtertype", params);
        }
        plugin.filtersearch = function(params) {
            APIcall("filtersearch", params);
        }

        plugin.up = function() {
            APIcall("up");
        }
        plugin.down = function() {
            APIcall("down");
        }
        plugin.right = function() {
            APIcall("right");
        }
        plugin.left = function() {
            APIcall("left");
        }

        init();

    };
}(jQuery));