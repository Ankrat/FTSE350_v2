// IE10 fixes conditional comment
  var isIE10 = false;
  /*@cc_on
      if (/^10/.test(@_jscript_version)) {
          isIE10 = true;
      }
  @*/
  console.log(isIE10);
  if( isIE10 ){
    applyCSS();
  }

  function applyCSS(){
    $(".welcomeImag").css("width", "220px");
    $(".cyberStrapline").css("width", "610px");
    $(".welcomeText").css("width", "610px");
    $(".welcomeLinks .greenBtn").css("float", "none");
    $(".welcomeLinks .greenBtn").css("width", "295px");

  }