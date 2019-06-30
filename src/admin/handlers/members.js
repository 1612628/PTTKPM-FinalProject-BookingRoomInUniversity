const LIMIT = 5

const MemberHandlers = memberRepo => {
    return [
        {
            method: 'get',
            path: '/users/members',
            handler: getMembers(memberRepo)
        },
        {
            method: 'post',
            path: '/users/members/:id',
            handler: uploadMember(memberRepo)
        }
    ]
}

const getMembers = memberRepo => (req, res) => {
    console.log('admins')
    const query = req.query
    const page = parseInt(query.page || 0)

    memberRepo.fetchPage(LIMIT, page)
        .then(result => {
            if (result.ok) {
                res.json(result.msg)
            } else {
                console.log(result.msg)
                res.status(500).send('GET Members Error')
            }
        })
}

const uploadMember = memberRepo => (req, res) => {
    const add = req.query.addNew || false
    const member = req.body
    const id = parseInt(req.params.id)
    if (!add && id !== parseInt(member.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        memberRepo.addOne(member)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    } else {
        memberRepo.updateOne({ id }, member)
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
    MemberHandlers
}