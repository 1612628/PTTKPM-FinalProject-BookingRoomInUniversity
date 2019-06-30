
$(document).ready(function(){
    handleClick();
});

function handleClick(){
    $('#btn-dang-nhap').click(function(){
        
        var tenDangNhap = $('#ten-dang-nhap')[0].value;
        var matKhau = $('#mat-khau')[0].value;
        console.log(tenDangNhap,matKhau);
        if(tenDangNhap && matKhau){
            body={
                tendangnhap:tenDangNhap,
                    matkhau:matKhau
            }
            $.ajax({
                url:'/dangnhap',
                method: "POST",
                contentType:'application/json',
                data:JSON.stringify(body),
                success:function(thanhvien){
                    if(thanhvien.success){                        
                        setCookie("token",thanhvien.token);
                        setUser(thanhvien.thanhvien);


                        $.ajax({
                            url: "/trangchu",
                            method: "GET",                       
                            success: function(html){
                                document.open();
                                document.write(html);
                                document.close();
                            }
                        });
                    }else{
                        Swal.fire({
                            type: 'info',
                            title: thanhvien.message,
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                }
            });
        }
    }); 
}
