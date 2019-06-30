class SequelizeRoomRepo{
    constructor(db,SequelizeModels){
        this.sequelize=db.sequelize;
        this.RoomBookingDetail=SequelizeModels.chi_tiet_dat_phong;
    }

    getFullNormalRoomUnBookedList(){
        return new Promise((resolver,reject)=>{
            this.sequelize.query("select ma_phong,ten_phong,phong_hoc_thuongs.mo_ta_phong,\
            tinh_trang_phongs.mo_ta,toa_nhas.ten_toa_nha,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoc_thuongs on phongs.ma_phong=phong_hoc_thuongs.ma_phong_hoc_thuong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join toa_nhas on toa_nhas.ma_toa_nha=phong_hoc_thuongs.thuoc_toa_nha \
            join co_sos on co_sos.ma_co_so=toa_nhas.thuoc_co_so cross join tiet_hocs \
            where phongs.tinh_trang=1\
            except\
            select ma_phong,ten_phong,phong_hoc_thuongs.mo_ta_phong,tinh_trang_phongs.mo_ta,\
            toa_nhas.ten_toa_nha,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc from phongs \
            join phong_hoc_thuongs on phongs.ma_phong=phong_hoc_thuongs.ma_phong_hoc_thuong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join toa_nhas on toa_nhas.ma_toa_nha=phong_hoc_thuongs.thuoc_toa_nha \
            join co_sos on co_sos.ma_co_so=toa_nhas.thuoc_co_so \
            join chi_tiet_dat_phongs on phongs.ma_phong=chi_tiet_dat_phongs.phong_dat \
            cross join tiet_hocs \
            where tiet_hocs.ma_tiet_hoc between chi_tiet_dat_phongs.tiet_bat_dau and chi_tiet_dat_phongs.tiet_ket_thuc \
            and chi_tiet_dat_phongs.ngay_dat=now()::date\
            order by ma_phong,ma_tiet_hoc;"
            ,{type: this.sequelize.QueryTypes.SELECT})
            .then(phong=>{
               if(phong){
                   return resolver(phong);
               }else{
                   return reject(null);
               }
            });
        });    
    }

    getFullHallUnBookedList(){
        return new Promise((resolver,reject)=>{
            this.sequelize.query("select ma_phong,ten_phong,phong_hoi_truongs.mo_ta_hoi_truong,\
            tinh_trang_phongs.mo_ta,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoi_truongs on phongs.ma_phong=phong_hoi_truongs.ma_phong_hoi_truong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join co_sos on co_sos.ma_co_so=phong_hoi_truongs.thuoc_co_so cross join tiet_hocs \
            where phongs.tinh_trang=1\
            except\
            select ma_phong,ten_phong,phong_hoi_truongs.mo_ta_hoi_truong,\
            tinh_trang_phongs.mo_ta,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoi_truongs on phongs.ma_phong=phong_hoi_truongs.ma_phong_hoi_truong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join co_sos on co_sos.ma_co_so=phong_hoi_truongs.thuoc_co_so \
            join chi_tiet_dat_phongs on phongs.ma_phong=chi_tiet_dat_phongs.phong_dat \
            cross join tiet_hocs \
            where tiet_hocs.ma_tiet_hoc between chi_tiet_dat_phongs.tiet_bat_dau and chi_tiet_dat_phongs.tiet_ket_thuc \
            and chi_tiet_dat_phongs.ngay_dat=now()::date\
            order by ma_phong,ma_tiet_hoc;"
            ,{type: this.sequelize.QueryTypes.SELECT})
            .then(phong=>{
                if(phong){
                   return resolver(phong);
                }else{
                   return reject(null);
                }
            });
        });
    }

    getFullNormalRoomUnBookedWithSpecificCampusAndDateList(coso,ngay){
        return new Promise((resolver,reject)=>{
            this.sequelize.query("select ma_phong,ten_phong,phong_hoc_thuongs.mo_ta_phong,\
            tinh_trang_phongs.mo_ta,toa_nhas.ten_toa_nha,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoc_thuongs on phongs.ma_phong=phong_hoc_thuongs.ma_phong_hoc_thuong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join toa_nhas on toa_nhas.ma_toa_nha=phong_hoc_thuongs.thuoc_toa_nha \
            join co_sos on co_sos.ma_co_so=toa_nhas.thuoc_co_so cross join tiet_hocs \
            where phongs.tinh_trang=1 and co_sos.ma_co_so="+coso+"\
            except\
            select ma_phong,ten_phong,phong_hoc_thuongs.mo_ta_phong,tinh_trang_phongs.mo_ta,\
            toa_nhas.ten_toa_nha,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc from phongs \
            join phong_hoc_thuongs on phongs.ma_phong=phong_hoc_thuongs.ma_phong_hoc_thuong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join toa_nhas on toa_nhas.ma_toa_nha=phong_hoc_thuongs.thuoc_toa_nha \
            join co_sos on co_sos.ma_co_so=toa_nhas.thuoc_co_so \
            join chi_tiet_dat_phongs on phongs.ma_phong=chi_tiet_dat_phongs.phong_dat \
            cross join tiet_hocs \
            where tiet_hocs.ma_tiet_hoc between chi_tiet_dat_phongs.tiet_bat_dau and chi_tiet_dat_phongs.tiet_ket_thuc \
            and co_sos.ma_co_so="+coso+" and chi_tiet_dat_phongs.ngay_dat='"+ngay+"'\
            order by ma_phong,ma_tiet_hoc;"
            ,{type: this.sequelize.QueryTypes.SELECT})
            .then(phong=>{
                if(phong){
                   return resolver(phong);
                }else{
                   return reject(null);
                }
            });
        });
    }
    getFullHallRooUnBookedWithSpecificCampusAndDateList(coso,ngay){
        return new Promise((resolver,reject)=>{
            this.sequelize.query("select ma_phong,ten_phong,phong_hoi_truongs.mo_ta_hoi_truong,\
            tinh_trang_phongs.mo_ta,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoi_truongs on phongs.ma_phong=phong_hoi_truongs.ma_phong_hoi_truong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join co_sos on co_sos.ma_co_so=phong_hoi_truongs.thuoc_co_so cross join tiet_hocs \
            where phongs.tinh_trang=1 and co_sos.ma_co_so="+coso+"\
            except\
            select ma_phong,ten_phong,phong_hoi_truongs.mo_ta_hoi_truong,\
            tinh_trang_phongs.mo_ta,co_sos.ten_co_so,tiet_hocs.ma_tiet_hoc \
            from phongs join phong_hoi_truongs on phongs.ma_phong=phong_hoi_truongs.ma_phong_hoi_truong \
            join tinh_trang_phongs on tinh_trang_phongs.ma_tinh_trang_phong=phongs.tinh_trang \
            join co_sos on co_sos.ma_co_so=phong_hoi_truongs.thuoc_co_so \
            join chi_tiet_dat_phongs on phongs.ma_phong=chi_tiet_dat_phongs.phong_dat \
            cross join tiet_hocs \
            where tiet_hocs.ma_tiet_hoc between chi_tiet_dat_phongs.tiet_bat_dau and chi_tiet_dat_phongs.tiet_ket_thuc \
            and co_sos.ma_co_so="+coso+" and chi_tiet_dat_phongs.ngay_dat='"+ngay+"'\
            order by ma_phong,ma_tiet_hoc;"
            ,{type: this.sequelize.QueryTypes.SELECT})
            .then(phong=>{
                if(phong){
                   return resolver(phong);
                }else{
                   return reject(null);
                }
            });
        });
    }
    
    bookRoom(details){
        return new Promise((resolver,reject)=>{
            this.RoomBookingDetail.create(details)
            .then(bookedroomdetail=>{
                if(bookedroomdetail){
                    resolver(bookedroomdetail);
                }else{
                    reject(null);
                }
            });
        });
    }
}   
module.exports={
    SequelizeRoomRepo
}