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

    });






});





