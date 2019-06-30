$(document).ready(function(){
    var headerTemplate = $('#header-template').html();
    var compliedHeaderTemplate = Handlebars.compile(headerTemplate);
    $.ajax("/partials/header.html").done(function(header_html){
        $('body').append(header_html);
        Handlebars.registerPartial("headerPartial",$("#header-partial").html());
        $('#header-container').html(compliedHeaderTemplate(getUser()));
    });

    var footerTemplate = $('#footer-template').html();
    var compliedFooterTemplate = Handlebars.compile(footerTemplate);
    $.ajax("/partials/footer.html").done(function(footer_html){
        $('body').append(footer_html);
        Handlebars.registerPartial("footerPartial",$('#footer-partial').html());
        $('#footer-container').html(compliedFooterTemplate({}));
    });
});

function dangXuat(){
    
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

    $.ajax({
        url: '/',
        method:"GET",
        success: function(html){
            document.open();
            document.write(html);
            document.close();
        }
    })
}