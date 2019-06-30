class SequelizeAdminRepo {
    constructor(sequelizeModels) {
        this.admins = sequelizeModels.quan_tri_vien
        this.accounts = sequelizeModels.tai_khoan
    }

    fetchPage(_size, _page) {
        return this.admins.findAndCountAll({
            ...(_page ? ({
                limit: _size,
                offset: _size * (_page - 1),
                order: [['updatedAt', 'DESC']],
            }) : {})
        }).then(result => {
            return Promise.all(result.rows.map(r => {
                return this.accounts.findByPk(r.ma_quan_tri)
                    .then(account => ({
                        id: r.ma_quan_tri,
                        username: account.ten_dang_nhap,
                        fullname: account.ho_va_ten,
                        cmnd: account.cmnd,
                        phone: account.sdt,
                        email: account.email,
                        department: r.phong_ban
                    }))
            })).then(admins => ({
                ok: true,
                msg: {
                    admins: admins,
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
                return this.admins.update({
                    phong_ban: _new.department
                }, {
                        where: {
                            ma_quan_tri: _old.id
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
            return this.admins.create({
                ma_quan_tri: user.ma_tai_khoan,
                phong_ban: _new.department
            })
        }).then(() => ({
            ok: true,
            msg: ''
        })).catch(err => ({
            ok: false,
            msg: err
        }))
    }

    fetchOneByUsername(username) {
        return this.accounts.findOne({ where: { ten_dang_nhap: username } })
            .then(account => {
                return this.admins.findByPk(account.ma_tai_khoan)
                    .then(admin => {
                        return ({
                            id: admin.ma_quan_tri,
                            username: account.ten_dang_nhap,
                            password: account.mat_khau,
                            fullname: account.ho_va_ten,
                            cmnd: account.cmnd,
                            phone: account.sdt,
                            email: account.email,
                            department: admin.phong_ban
                        })
                    })
                    .then(admin => {
                        return {
                            ok: true,
                            msg: admin
                        }
                    })
                    .catch(err => {
                        return {
                            ok: false,
                            msg: err
                        }
                    })
            })
    }
}

module.exports = {
    SequelizeAdminRepo
}