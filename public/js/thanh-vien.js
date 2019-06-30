$(document).ready(function () {
    var datPhongTemplate = $('#dat-phong-template').html();
    var compliedDatPhongemplate = Handlebars.compile(datPhongTemplate);

    $.ajax("/partials/thanh-vien-trang-chu-chi-tiet-danh-sach-phong.html").done(function (chitietdanhsachphong_html) {
        $("body").append(chitietdanhsachphong_html);
        Handlebars.registerPartial("chiTietDatPhongPartial", $("#chi-tiet-danh-sach-phong-partial").html());

        $.ajax("/partials/thanh-vien-trang-chu-dat-phong.html").done(function (trangchudatphong) {
            $("body").append(trangchudatphong);
            Handlebars.registerPartial("datPhongPartial", $('#trang-chu-dat-phong-partial').html());
            
            $.ajax("/laydanhsachphong").done(function(dsphong){
                $('#dat-phong-container').html(compliedDatPhongemplate(dsphong));

                createDatatable();
                loadDanhSachCoSo();
                handleClick(compliedDatPhongemplate);

                // Get day for booking room
                var today=new Date();
                var dd = String(today.getDate()).padStart(2,'0');
                var mm = String(today.getMonth()+1).padStart(2,'0');
                var yyyy = today.getFullYear();
                var ngaydat=yyyy+"-"+mm+"-"+dd;
                setMyItem("ngay_dat",ngaydat);
            });
        });
        
    });
    
});

function createDatatable(){
    $('#dt-dat-phong').each(function(){
        $(this).DataTable({
            'pagingType': 'first_last_numbers',
            "ordering": false,
            "info": false,
            "lengthChange": false,
        });
    });
    $('[class="dataTables_length"]').each(function(){
        $(this).addClass('bs-select');
    });
}

function loadDanhSachCoSo(){
    $.ajax({
        url:'/laydanhsachtencoso',
        method:"GET",
        success: function(dstencoso){
            if(dstencoso){
                var options= [];
                for(var i=0;i<dstencoso.length;++i){
                    options.push('<option value='+dstencoso[i].ma_co_so+'>'+dstencoso[i].ten_co_so+'</option>');
                }
                $('#danh-sach-co-so').empty().append(options.join(' '));
            }
        }
    });
}

function handleClick(compliedDatPhongemplate){
    $('#btn-search-phong').click(function(){
        var coso=$('#danh-sach-co-so')[0].value;
        var ngay=$('#ngay')[0].value;

        if(coso && ngay){
            setMyItem("ngay_dat",ngay);
            $.ajax({
                url:'/timkiemdanhsachphong',
                method:"POST",
                contentType:'application/json',
                data:JSON.stringify({coso:coso,ngay:ngay}),
                success: function(dsphong){
                    $('#dat-phong-container').html(compliedDatPhongemplate(dsphong));
                    $("#dt-dat-phong").dataTable().fnDestroy();
                    createDatatable();
                }
            });
        }
    });
}

function chonTietBatDau(maphong){
    document.getElementById("btn-"+maphong+"").disabled=true;
    var selectTietBatDau = document.getElementById("bat_dau_"+maphong+"");
    var selectTietKetThuc =document.getElementById("ket_thuc_"+maphong+"");
    
    for(var i=0;i<selectTietBatDau.options.length;++i){
        selectTietBatDau.options[i].classList.remove('tiet-duoc-chon');
        selectTietKetThuc.options[i].classList.remove('tiet-duoc-chon');
        if(selectTietKetThuc.options[i].value!="Đã được đặt"){
            selectTietKetThuc.options[i].disabled=false;
        }
    }
    
    for(var j=0;j<selectTietBatDau.options.selectedIndex;++j){
        if(selectTietKetThuc.options[j].value!="Đã được đặt"){
            selectTietKetThuc.options[j].disabled=true;
        }
    }
    selectTietBatDau.options[selectTietBatDau.selectedIndex].classList.add('tiet-duoc-chon');
    selectTietKetThuc.options[selectTietBatDau.selectedIndex].classList.add('tiet-duoc-chon');
}

function chonTietKetThuc(maphong){
    var selectTietBatDau = document.getElementById("bat_dau_"+maphong+"");
    var selectTietKetThuc =document.getElementById("ket_thuc_"+maphong+"");
    
    if(selectTietBatDau.options[selectTietBatDau.options.selectedIndex].classList.contains('tiet-duoc-chon')){
        for(var i=selectTietBatDau.options.selectedIndex;i<=selectTietKetThuc.options.selectedIndex;++i){
            if(selectTietKetThuc.options[i].value!="Đã được đặt"){
                selectTietKetThuc.options[i].classList.add('tiet-duoc-chon');
            }
        }
        for(var j=selectTietKetThuc.options.selectedIndex+1;j<selectTietKetThuc.options.length;++j){
            selectTietKetThuc.options[j].classList.remove('tiet-duoc-chon');
        }
        document.getElementById("btn-"+maphong+"").disabled=false;
    }
    
}

function datPhong(maphong){

    var selectTietBatDau = document.getElementById("bat_dau_"+maphong+"");
    var selectTietKetThuc =document.getElementById("ket_thuc_"+maphong+"");

    var thanh_vien_dat=getUser().user.ma_thanh_vien;
    var phong_dat=maphong;
    var postietbatdau=selectTietBatDau.options.selectedIndex;
    var ngay_dat = getMyItem('ngay_dat');
    var email=getUser().user.tai_khoan.email;

    if(selectTietBatDau && selectTietKetThuc && thanh_vien_dat && phong_dat && ngay_dat && email){
        
        for(var i = selectTietBatDau.options.selectedIndex;i<=selectTietKetThuc.options.selectedIndex;++i){
            var tietbatdau;
            var tietketthuc;    
            if(selectTietKetThuc.options[i].value=="Đã được đặt"){
                tietbatdau=postietbatdau+1;
                tietketthuc=i;
                var body={
                    thanh_vien_dat:thanh_vien_dat,
                    phong_dat:phong_dat,
                    tiet_bat_dau:tietbatdau,
                    tiet_ket_thuc:tietketthuc,
                    ngay_dat:ngay_dat,
                    email:email
                };
                $.ajax({
                        url:'/datphong',
                        method:"POST",
                        contentType:'application/json',
                        data:JSON.stringify(body),
                        success:function(res){
                            if(res.success){
                                Swal.fire({
                                    type: 'info',
                                    title: 'Đặt phòng thành công, thông tin đã được gửi đến email của bạn, vui lòng đợi quản trị viên duyệt!',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                            }else{
                                Swal.fire({
                                    type: 'info',
                                    title: 'Đặt phòng thất bại',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                            }
                        }
                });
            }else if( i==selectTietKetThuc.options.selectedIndex){
                tietbatdau=postietbatdau+1;
                tietketthuc=i+1;
                var body={
                    thanh_vien_dat:thanh_vien_dat,
                    phong_dat:phong_dat,
                    tiet_bat_dau:tietbatdau,
                    tiet_ket_thuc:tietketthuc,
                    ngay_dat:ngay_dat,
                    email:email
                };
                $.ajax({
                        url:'/datphong',
                        method:"POST",
                        contentType:'application/json',
                        data:JSON.stringify(body),
                        success:function(res){
                            if(res.success){
                                Swal.fire({
                                    type: 'info',
                                    title: 'Đặt phòng thành công, thông tin đã được gửi đến email của bạn, vui lòng đợi quản trị viên duyệt!',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                                setTimeout(function(){
                                    location.reload(true);                 
                                },2000);
                            }else{
                                Swal.fire({
                                    type: 'info',
                                    title: 'Đặt phòng thất bại',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                                setTimeout(function(){
                                    location.reload(true);                 
                                },2000);
                            }
                        }
                });
            }
            while(selectTietKetThuc.options[i].value=="Đã được đặt"){
                ++i;
                postietbatdau=i;
            }
        }
    }
    
}