$(document).ready( function() {

    var pr = popcorntime_remote,
        connected = false;

    function getlist(tab) {
        //Delete the actual active tab
        $("#tabs a").removeClass("active");
        //Empty the item's list
        $("#list > ul").empty();
        //Set active the chosen tab
        $("#tabs > #"+tab).addClass("active");
        if(tab == "movies") {
            setInterval(function() {
                pr.movieslist();
            }, 500);
            pr.getcurrentlist(function(data) {
                console.log(data);
                $.each(data.result.list, function(index, item) {
                    var html = '<li><a class="'+index+' open-item"><img src="'+this.cover+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                    $("#list > ul").append(html);
                });
            });
        } else if(tab == "shows") {
            setInterval(function() {
                pr.showslis();
            }, 500);
            pr.getcurrentlist(function(data) {
                $.each(data.result.list, function(index, item) {
                    var html = '<li><a class="'+index+' open-item"><img src="'+this.images['poster']+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                    $("#list > ul").append(html);
                });
            });
        } else if(tab == "anime") {

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

                tabs = [];
                pr.getcurrenttab(function(data) {
                    tabs.push(data.result.tab);
                });
                //Check if the user changed tab on the desktop app
                if(tabs.length == 2 && tabs[tabs.length-1] != tabs[length-2]) {
                    $('#'+tabs).trigger("click");
                }

            })
        }, 1000);


        //Tabs handling
        //Get the current tab
        pr.getcurrenttab(function(data) {
            //Call the function and pass the current tab to retrieve the right current items list
            getlist(data.result.tab);
        });
    });



    $(document).on("click", ".open-item", function() {
        var toSelect = $(this).attr('class');
        pr.setselection(toSelect);
        pr.enter();
    });

    $("#movies").click(function() {
        getlist("movies");
    });
    $("#shows").click(function() {
        getlist("shows");
    });
    $("#anime").click(function() {
        
    });



});