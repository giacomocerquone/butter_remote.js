# popcorntime_remote.js
Popcorntime_remote is a javascript library that provides an easy way to make an application or whatever you want to control the interface of [popcorn time](https://popcorntime.io/) through the json rpc protocol.<br>
The plugin is developed with simplicity in mind so, for example, the methods name are the same that you can find in the [popcorn time documention](https://git.popcorntime.io/popcorntime/desktop/blob/master/docs/json-rpc-api.md) and there are many other conveniences.

##Download
You can get the plugin in different ways:

1. Downloading the raw file in the dist folder choosing the [clean]() or [minified]() version.
2. If you want to take a look at the demo, you can directly [download the repo](https://github.com/giacomocerquone/jQuery.popcorntime_remote/archive/master.zip).
3. Go to the releases tab and download the [Source code.zip]()

##Include and Initialize
Firstly you should obviously include the library on the page you want to use it:
```html
<script src="popcorntime_remote.min.js"></script>
```
After initialize the plugin in this way:
```javascript
popcorntime_remote.init(
//If you don't need to change these settings you can remove this whole part
  {
    username: "popcorn",
    password: "popcorn",
    ip: "127.0.0.1",
    port: "8008",
    debug: "false"
  }
//If you don't need to change these settings you can remove this whole part
);
```
From now on you'll call every method like this:
```javascript
popcorntime_remote.nameofthemethod(...);
```
Pretty simple uh?

##Usage
As you can understand from the popcorn time documentation, there are "three kinds" of methods.

1. Methods which performs actions without any parameter needed.<br>
  These are {listing methods}:<br>
  ```javascript
  popcorntime_remote.ping();
  ```
2. Methods that need parameters to performs certain actions.<br>
  These are {listing methods}:<br>
  ```javascript
  popcorntime_remote.filtergenres(["Adventure"]);
  ```
3. Methods which performs actions and return some data. Here you have a callback function and the data can be accessed in this way:
  ```javascript
  //This get the current volume in the player
  popcorntime_remote.volume(function(data) {
    console.log(data);
  });
  //This set the current volume in the player
  popcorntime_remote.volume([2]);
  ```

##Conclusion
If you don't know if parameters are needed or what you have to pass to the methods and for every other information, as I already said, you can look at the [popcorn time documentation](https://git.popcorntime.io/popcorntime/desktop/blob/master/docs/json-rpc-api.md). Despite that doc has been written with the json rpc protocol in mind, the information about the usage of the methods are compatible for this library too... actually you will not even notice that you're using this library.

##License
Released under the GNU 3 license.<br>
Copyright © 2015, Giacomo cerquone.<br>
All rights reserved.
