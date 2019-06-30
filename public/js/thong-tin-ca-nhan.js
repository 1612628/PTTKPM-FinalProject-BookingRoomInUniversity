$(document).ready(function(){
    var thongtincanhanTemplate = $('#thong-tin-ca-nhan-template').html();
    var compilethongtincanhantemplate=Handlebars.compile(thongtincanhanTemplate);

    $.ajax('/partials/thong-tin-ca-nhan.html').done(function(thongtincanhan_html){
        $('body').append(thongtincanhan_html);
        Handlebars.registerPartial('thongTinCaNhanPartial',$('#thong-tin-ca-nhan-partial').html());

        $('#thong-tin-ca-nhan-container').html(compilethongtincanhantemplate(getUser()));
    });
});