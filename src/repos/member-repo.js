class SequelizeMemberRepo {
    constructor(sequelizeModels) {
        this.members = sequelizeModels.thanh_vien
        this.accounts = sequelizeModels.tai_khoan
    }

    fetchPage(_size, _page) {
        return this.members.findAndCountAll({
            ...(_page ? ({
                limit: _size,
                offset: _size * (_page - 1),
                order: [['updatedAt', 'DESC']],
            }) : {})
        }).then(result => {
            return Promise.all(result.rows.map(r => {
                return this.accounts.findByPk(r.ma_thanh_vien)
                    .then(account => ({
                        id: r.ma_thanh_vien,
                        username: account.ten_dang_nhap,
                        fullname: account.ho_va_ten,
                        cmnd: account.cmnd,
                        phone: account.sdt,
                        email: account.email,
                        point: r.diem_ca_nhan
                    }))
            })).then(members => ({
                ok: true,
                msg: {
                    members: members,
                    currentPage: _page,
                    lastPage: Math.ceil(result.count / _size),
                    total: result.count
                }
            }))
        }).catch(err => ({
            ok: false,
            msg: err
        }))
    }

    updateOne(_old, _new) {
        return this.accounts.update({
            ten_dang_nhap: _new.username,
            mat_khau: _new.password,
            ho_va_ten: _new.fullname,
            cmnd: _new.cmnd,
            sdt: _new.phone,
            email: _new.email
        }, {
                where: {
                    ma_tai_khoan: _old.id
                }
            }).then(() => {
                return this.members.update({
                    diem_ca_nhan: _new.point
                }, {
                        where: {
                            ma_thanh_vien: _old.id
                        }
                    })
            }).then(() => ({
                ok: true,
                msg: ''
            })).catch(err => ({
                ok: false,
                msg: err
            }))
    }

    addOne(_new) {
        return this.accounts.create({
            ten_dang_nhap: _new.username,
            mat_khau: _new.password,
            ho_va_ten: _new.fullname,
            cmnd: _new.cmnd,
            sdt: _new.phone,
            email: _new.email
        }).then(user => {
            return this.members.create({
                ma_thanh_vien: user.ma_tai_khoan,
                diem_ca_nhan: _new.point
            })
        }).then(() => ({
            ok: true,
            msg: ''
        })).catch(err => ({
            ok: false,
            msg: err
        }))
    }
}

module.exports = {
    SequelizeMemberRepo
}