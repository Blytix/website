(function(){
    window.addEventListener('scroll', invertNavbar )

    var headerAnchor =document.getElementsByClassName('header-page-anchor')
    if(headerAnchor.length > 0){
        window.addEventListener('scroll', activateAnchor )
    }
})();

function invertNavbar(){
    var vh =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var headerNav = document.getElementsByClassName('header-nav')
    headerNav = headerNav[0]
    if(window.scrollY >= vh){
        headerNav.classList.add("inverted")
    }else{
        headerNav.classList.remove("inverted")
    }
}

function activateAnchor(){
    var vh =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var headerAnchor = document.getElementsByClassName('header-page-anchor')
    headerAnchor = headerAnchor[0]   

    if(window.scrollY >= vh){
        headerAnchor.classList.remove("hide")
    }else{
        headerAnchor.classList.add("hide")
    }
}

$(".anchorLink").click(function(e){
    e.preventDefault();
    $(".anchorLink").children('div').removeClass('active')
    $(this).children('div').addClass('active')
    var this_offset = $(this).offset();
    var that_id     = $(this).attr("href");
    var that_offset = $(that_id).offset();
    var offset_diff = Math.abs(that_offset.top - this_offset.top);
   
    var base_speed  = 100; // Time in ms per 1,000 pixels
    var speed       = (offset_diff * base_speed) / 1000;
    
    $("html,body").animate({
      scrollTop: that_offset.top - 150
    }, speed);
});