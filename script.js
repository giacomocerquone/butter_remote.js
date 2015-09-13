$(document).ready( function() {

    var pr = popcorntime_remote,
        tabs = [];;

    function getlist(tab) {
        //Delete the actual active tab
        $("#tabs a").removeClass("active");
        //Empty the item's list
        $("#list > ul").empty();
        //Set active the chosen tab
        $("#tabs > #"+tab).addClass("active");
        if(tab == "movies") {
            pr.getcurrentlist(function(data) {
                $.each(data.result.list, function(index, item) {
                    var html = '<li><a class="'+index+'" id="open-item"><img src="'+this.cover+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                    $("#list > ul").append(html);
                });
            });
        } else if(tab == "shows" || tab == "anime") {
            pr.getcurrentlist(function(data) {
                $.each(data.result.list, function(index, item) {
                    var html = '<li><a class="'+index+'" id="open-item"><img src="'+this.images['poster']+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                    $("#list > ul").append(html);
                });
            });
        }
    }

    $("#submit").click(function() {

        var ipVal = ( !$("#ip-address").val() ? "localhost" : $("#ip-address").val() );
        var portVal = ( !$("#port").val() ? "8008" : $("#port").val() );
        var usernameVal = ( !$("#username").val() ? "popcorn" : $("#username").val() );
        var passwordVal = ( !$("#password").val() ? "popcorn" : $("#password").val() );

        pr.init({ ip:ipVal, port: portVal, username: usernameVal, password: passwordVal }, function(data) {
            if(data.result) {
                $("#login").hide();
                $("#header").show();
                $("#controller").show();
            } else {
                alert("Couldn't connect. Check for username and password.");
            }
        });

        setInterval(function() {
            pr.listennotifications(function(data) {

                if(data.result.events.viewstack) {
                    view = data.result.events.viewstack[data.result.events.viewstack.length-1];
                }

                if(view == "main-browser") {
                   
                } else if(view == "movie-detail") {
                }
            });
            
            pr.getcurrenttab(function(data) {
                tabs.push(data.result.tab);
            });
            //Check if the user changed tab on the desktop app
            if(tabs.length >= 2 && tabs[tabs.length-1] != tabs[tabs.length-2]) {
                setTimeout(function() {
                    getlist(tabs[tabs.length-1]);
                }, 500);
            }
        }, 1000);


        //Tabs handling
        //Get the current tab
        pr.getcurrenttab(function(data) {
            //Call the function and pass the current tab to retrieve the right current items list
            getlist(data.result.tab);
        });
    });


    //Listen for a click on a item
    $(document).on("click", "#open-item", function() {
        //Retrieve the index of the item stored in its class
        var toSelect = $(this).attr('class');
        pr.setselection([toSelect]);
        pr.enter();
    });

    //UNIFICARE LE TRE FUNZIONI CLICK IN UNA SOLA CON LA VARIABILE
    //E COME SELETTORE USARE UN SEMPLICE E GENERALE #tabs > a

    //Movies tab pressed
    $("#movies").click(function() {
        //Switch to the tab
        pr.movieslist();
        //Wait 500ms to get the items list so popcorn time has time to load them 
        setTimeout(function() {
            getlist("movies");
        }, 1000);
    });
    $("#shows").click(function() {
        pr.showslist();
        setTimeout(function() {
            getlist("shows");
        }, 1000);   
    });
    $("#anime").click(function() {
        pr.animelist();
        setTimeout(function() {
            getlist("anime");
        }, 1000);   
    });



});