/*
# This file is part of "Popcorn Time Remote Controller by Giacomo Cerquone".
#
# Copyright(c) 2015 Giacomo Cerquone
# cerquone96@hotmail.it
# http://www.giacomocerquone.com
#
# This file is released under of the GNU General Public License Version 3.
*/
$(document).ready( function() {

    var pr = popcorntime_remote,
        tabs = [];

    function getlist(tab) {
        //Delete the actual active tab
        $("#tabs a, #right i").removeClass("active");
        //Empty the item's list
        $("#list > ul").empty();
        //Set active the chosen tab
        $("#tabs > #"+tab+", #right > #"+tab).addClass("active");
        //Given the differences between the movies and the shows/anime object, they have to be filtered differently
        pr.getcurrentlist(function(data) {
            //while(!data) { }
            console.log(data);
            $.each(data.result.list, function(index, item) {
                if(this.type=="movie" || this.type=="bookmarkedmovie") { cover=this.cover; } else if(this.type=="show" || this.type=="bookmarkedshow") { cover=this.images.poster; }
                var html = '<li><a class="'+index+'" id="open-item"><img src="'+cover+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                $("#list > ul").append(html);
            });
        });

    }

    $("#submit").click(function(e) {
        e.preventDefault();

        var ipVal = ( !$("#ip-address").val() ? "localhost" : $("#ip-address").val() );
        var portVal = ( !$("#port").val() ? "8008" : $("#port").val() );
        var usernameVal = ( !$("#username").val() ? "popcorn" : $("#username").val() );
        var passwordVal = ( !$("#password").val() ? "popcorn" : $("#password").val() );

        pr.init({ ip:ipVal, port: portVal, username: usernameVal, password: passwordVal }, function(data) {
            if(data.result) {
                $("#login").hide();
                $("#header").show();
            } else {
                alert("Couldn't connect. Check for username and password.");
            }
        });

        setInterval(function() {
            //Listen for changes of the viewstack
            pr.listennotifications(function(data) {
                if(data.result.events.viewstack) {
                    view = data.result.events.viewstack[data.result.events.viewstack.length-1];
                    if(view == "main-browser") {
                        pr.getcurrenttab(function(data) {
                            //Call the function and pass the current tab
                            getlist(data.result.tab);
                        });
                    } else if(view == "movie-detail") {
                        $("#list > ul").empty();
                    }
                }
                
            });

            //Listen for changes of the active tab
            pr.getcurrenttab(function(data) {
                //Collect the current tab every second
                tabs.push(data.result.tab);
                //Delete the oldest tab to not collect too much items in array
                if(tabs.length == 3) {
                    tabs.splice(0, 1);
                }
                //Check if the user changed tab on the desktop app
                if(tabs.length == 2 && tabs[tabs.length-1] != tabs[tabs.length-2]) {
                    //Wait 500ms to get the items list so popcorn time has time to load them 
                    setTimeout(function() {
                        getlist(tabs[tabs.length-1]);
                    }, 500);
                }
            });
            

        }, 1000);

        //Get the first viewstack
        pr.getviewstack(function(data) {
            view = data.result.viewstack[data.result.viewstack.length-1];
            if(view == "main-browser") {
                //Get the current tab
                pr.getcurrenttab(function(data) {
                    //Call the function and pass the current tab
                    getlist(data.result.tab);
                });
            } else if(view == "settings-container-contain") {

            } else if(view == "") {

            }
            
        });
        
    });


    //Listen for a click on an item
    $(document).on("click", "#open-item", function() {
        //Retrieve the index of the item stored in its class
        var toSelect = $(this).attr('class');
        pr.setselection([toSelect]);
        pr.enter();
    });

    //Listen for a click on a tab 
    $("#tabs > a, #right > i").click(function() {
        id = $(this).attr("id");
        //Switch to the clicked tab
        if(id == "movies") { 
            pr.movieslist(); 
        } else if(id == "shows") {
            pr.showslist(); 
        } else if(id == "anime") { 
            pr.animelist(); 
        } else if(id == "Favorites") { 
            pr.showfavourites(); 
        } else if(id == "Watchlist") { 
            pr.showwatchlist(); 
        }
    });



});
