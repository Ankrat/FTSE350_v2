// IE10 fixes conditional comment
  function getInternetExplorerVersion(){
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    } else if (navigator.appName == 'Netscape'){
      var ua = navigator.userAgent;
      var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  }
  var r = getInternetExplorerVersion();
  console.log(r);

  if( r >= 10 ){
    applyCSS();
  }

  function applyCSS(){
    $(".welcomeImag").css("width", "220px");
    $(".cyberStrapline").css("width", "610px");
    $(".welcomeText").css("width", "610px");
    $(".welcomeLinks .greenBtn").css("float", "none");
    $(".welcomeLinks .greenBtn").css("width", "295px");

  }