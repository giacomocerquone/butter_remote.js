$(document).ready( function() {

    var pr = popcorntime_remote,
        connected = false;

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

                console.log(data);

                if(view == "main-browser") {
                    $('.movie').hide();
                    $('.main').show();
                    $('.main').html("main-browser")
                } else if(view == "movie-detail") {
                    $('.main').hide();
                    $('.movie').show();
                    $('.movie').html("movie-detail")
                }

            })
        }, 1000);

        pr.getcurrentlist(function(data) {
            $.each(data.result.list, function(index, item) {
                var html = '<li><a class="'+index+'"><img src="'+this.cover+'" width="134" /><p>'+this.title+'</p><p style="color:#5b5b5b; font-size:0.75em;">'+this.year+'</p></a></li>';
                $("#movies > ul").append(html);
            });
            console.log(data.result.list);
        });

    });

    $(document).on("click", "#movies > ul > li > a", function() {
        var toSelect = $(this).attr('class');
        pr.setselection(toSelect);
        pr.enter();
    });


});





