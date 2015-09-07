popcorntime_remote.init({debug:true});

if(view[view.length-1] == "mainbrowser") {
	$('.asd').text("mainbrowser");
} else if(view[view.length-1] == "movie-detail") {
	$('.asd').text("movie-detail");
}