const LIMIT = 5

const UserHandlers = adminRepo => {
    return [
        {
            method: 'get',
            path: '/users/admins',
            handler: getAdmins(adminRepo)
        },
        {
            method: 'post',
            path: '/users/admins/:id',
            handler: uploadAdmin(adminRepo)
        }
    ]
}

const getAdmins = adminRepo => (req, res) => {
    console.log('admins')
    const query = req.query
    const page = parseInt(query.page || 0)

    adminRepo.fetchPage(LIMIT, page)
        .then(result => {
            if (result.ok) {
                res.json(result.msg)
            } else {
                console.log(result.msg)
                res.status(500).send('GET Admins Error')
            }
        })
}

const uploadAdmin = adminRepo => (req, res) => {
    const add = req.query.addNew || false
    const admin = req.body
    const id = parseInt(req.params.id)
    if (!add && id !== parseInt(admin.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        adminRepo.addOne(admin)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    } else {
        adminRepo.updateOne({ id }, admin)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    }
}

module.exports = {
    UserHandlers
}