/*
# This file is part of "Butter Remote Controller by Giacomo Cerquone".
#
# Copyright(c) 2015 Giacomo Cerquone
# cerquone96@hotmail.it
# http://www.giacomocerquone.com
#
# This file is released under of the GNU General Public License Version 3.
*/
$(document).ready( function() {

    var bt = butter_remote;

    function getList() {
        bt.getcurrenttab(function(data) { 
            tab = data.result.tab;
            //Delete the actual active tab
            $("#tabs a, #right i").removeClass("active");
            //Set active the chosen tab
            $("#tabs > #"+tab+", #right > #"+tab).addClass("active");
            //Repeats the function until butter loaded the items so that can respond correctly
            var interval = setInterval(function() {
                bt.getcurrentlist(function(data) {
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
                    } else {
                        $("#container").empty();
                    }

                });
            }, 100);
        });
    }

    function itemDetails() {
        //Empty the item's list
        bt.getselection(function(data) {
            var cover, genres = '', playButtons = '';
            if(data.result.type=="movie" || data.result.type=="bookmarkedmovie") { 
                cover = data.result.cover;
                playButtons = '<a id="watch-now">Watch Now</a> <a id="watch-trailer">Watch Trailer</a> <a id="toggle-quality"></a>';

                data.result.genre.forEach(function(item, i) {
                    trailingSlash = (i != data.result.genre.length-1 ? "/" : "");
                    genres += item+trailingSlash;
                });
            } else if(data.result.type=="show" || data.result.type=="bookmarkedshow") {
                cover = data.result.images.poster;
                playButtons = '<a id="watch-now">Watch Now</a>';

                data.result.genres.forEach(function(item, i) {
                    trailingSlash = (i != data.result.genres.length-1 ? "/" : "");
                    genres += item+trailingSlash;
                });
            }
            console.log(data.result);
            var htmlDetail = '<section id="item-detail"><div id="item-image"><img src="'+cover+'" width="500" /></div> <div id="item-descr"><p id="title">'+data.result.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+data.result.year+' | '+data.result.runtime+'min. | '+genres+' | IMDB: '+data.result.rating+'</p><p>'+data.result.synopsis+'</p> '+playButtons+' <i id="toggle-favourite" class="fa fa-heart"></i> <i id="toggle-watched"class="fa fa-eye-slash"></i> </div><div style="clear:both;"></div></section>';
            $("#container").html(htmlDetail);

        });
    }

    $("#submit").click(function(e) {
        e.preventDefault();

        var ipVal = ( !$("#ip-address").val() ? "localhost" : $("#ip-address").val() );
        var portVal = ( !$("#port").val() ? "8008" : $("#port").val() );
        var usernameVal = ( !$("#username").val() ? "popcorn" : $("#username").val() );
        var passwordVal = ( !$("#password").val() ? "popcorn" : $("#password").val() );

        bt.init({ ip:ipVal, port: portVal, username: usernameVal, password: passwordVal }, function(data) {
            if(data.result) {
                $("#login").hide();
                $("#header").show();
            } else {
                alert("Couldn't connect. Check for username and password.");
            }
        });

        //Get the first viewstack
        bt.getviewstack(function(data) {
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
            bt.listennotifications(function(data) {
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


    //Click on an item
    $(document).on("click", "#open-item", function() {
        //Retrieve the index of the item stored in its class
        var toSelect = $(this).attr('class');
        bt.setselection([toSelect]);
        bt.enter();
    });

    //Click on a tab 
    $("#tabs > a, #right > i").click(function() {
        id = $(this).attr("id");
        //Switch to the clicked tab
        if(id == "movies") { 
            bt.movieslist(); 
        } else if(id == "shows") {
            bt.showslist(); 
        } else if(id == "anime") { 
            bt.animelist(); 
        } else if(id == "Favorites") { 
            bt.showfavourites(); 
        } else if(id == "Watchlist") { 
            bt.showwatchlist(); 
        }
    });

    //Click on search
    $('#search-button').click(function() {
        $('.search-input').toggleClass('search-input-animated');
        $('.search-input').focus();
    });
    $('.search-input').focusout(function() {
        $('.search-input').removeClass('search-input-animated');
    });
    //Enter when the search is focused
    $(document).keypress(function(e) {
        if(e.which == 13 && $(".search-input").is(":focus")) {
            bt.filtersearch([$(".search-input").val()]);
            getList();
        }
    });

    //Click on watch trailer or watch now
    $(document).on("click", "#watch-now", function() {
        bt.enter();
    });
    $(document).on("click", "#watch-trailer", function() {
        bt.watchtrailer();
    });
    //Click on favourite or seen
    $(document).on("click", "#toggle-favourite", function() {
        bt.togglefavourite();
    });
    $(document).on("click", "#toggle-watched", function() {
        bt.togglewatched();
    });

});
