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

    var pr = popcorntime_remote;

    function getList() {
        pr.getcurrenttab(function(data) { 
            tab = data.result.tab;
            //Delete the actual active tab
            $("#tabs a, #right i").removeClass("active");
            //Set active the chosen tab
            $("#tabs > #"+tab+", #right > #"+tab).addClass("active");
            //Repeats the function until popcorntime loaded the items so that can respond correctly
            var interval = setInterval(function() {
                pr.getcurrentlist(function(data) {
                    //if errors are not returned
                    if(!data.error) {
                        var htmlList = "";
                        //Cycle the elements of the list
                        $.each(data.result.list, function(index, item) {
                            //Given the differences between the movies and the shows/anime object, they have to be filtered differently
                            if(this.type=="movie" || this.type=="bookmarkedmovie") { cover=this.image; } else if(this.type=="show" || this.type=="bookmarkedshow") { cover=this.images.poster; }
                            //Build the html
                            htmlList += '<li><a class="'+index+'" id="open-item"><div style="width:134px; height:201px; background-color:#000;background-size:cover; background-image:url('+cover+');"></div><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                        });
                        $("#container").html("<section id='list'><ul>"+htmlList+"</ul></section>");
                        clearInterval(interval);
                    }
                });
            }, 100);
        });
    }

    function itemDetails() {
        //Empty the item's list
        pr.getselection(function(data) {
            if(data.result.type=="movie" || data.result.type=="bookmarkedmovie") { cover=data.result.image; } else if(data.result.type=="show" || data.result.type=="bookmarkedshow") { cover=data.result.images.poster; }
            var htmlDetail = '<img src="'+cover+'" width="134" /><p>'+data.result.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+data.result.year+'</p>';
            $("#container").html("<section id='itemdetail'><ul>"+htmlDetail+"</ul></section>");
            console.log(data);
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

        //Get the first viewstack
        pr.getviewstack(function(data) {
            view = data.result.viewstack[data.result.viewstack.length-1];
            if(view == "main-browser") {
                getList();
            } else if(view == "movie-detail" || view == "shows-container-contain") {
                itemDetails();
            }
            
        });

        //Lets repeat operations every second
        setInterval(function() {
            //Listen for notifications
            pr.listennotifications(function(data) {
                if(data.result.events.viewstack) {
                    view = data.result.events.viewstack[data.result.events.viewstack.length-1];
                    if(view == "main-browser") {
                        getList();
                    } else if(view == "movie-detail" || view == "shows-container-contain") {
                        itemDetails();
                    }

                }
                
            });

        }, 1000);
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

    //Listen for a click on search
    $('#search-button').click(function() {
        $('.search-input').toggleClass('search-input-animated');
        $('.search-input').focus();
    });
    $('.search-input').focusout(function() {
        $('.search-input').removeClass('search-input-animated');
    });
    //Listen for enter when the search is focused
    $(document).keypress(function(e) {
        if(e.which == 13 && $(".search-input").is(":focus")) {
            pr.filtersearch([$(".search-input").val()]);
            getList();
        }
    });



});
