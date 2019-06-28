$(document).ready(function () {
    var datPhongTemplate = $('#dat-phong-template').html();
    var compliedDatPhongemplate = Handlebars.compile(datPhongTemplate);

    $.ajax("/partials/thanh-vien-trang-chu-chi-tiet-danh-sach-phong.html").done(function (chitietdanhsachphong_html) {
        $("body").append(chitietdanhsachphong_html);
        Handlebars.registerPartial("chiTietDatPhongPartial", $("#trang-chu-dat-phong-partial").html());

        $.ajax("/partials/thanh-vien-trang-chu-dat-phong.html").done(function (trangchudatphong) {
            $("body").append(trangchudatphong);
            Handlebars.registerPartial("datPhongPartial", $('#chuyen-trong-ngay-partial').html());
            
            $.ajax("/")
        });
        
    });
    
});

function createDatatable(){
    $('[id="dt-chuyen"]').each(function(){
        $(this).DataTable({
            'pagingType': 'first_last_numbers',
            "ordering": false,
            "info": false,
            "searching": false,
            "lengthChange": false,
        });
    });
    $('[class="dataTables_length"]').each(function(){
        console.log($(this));
        $(this).addClass('bs-select');
    });
}