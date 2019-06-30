const LIMIT = 5

const NormalRoomHandlers = normalRoomRepo => {
    return [
        {
            method: 'get',
            path: '/rooms/normals',
            handler: getNormalRooms(normalRoomRepo)
        },
        {
            method: 'post',
            path: '/rooms/normals/:id',
            handler: uploadNormalRoom(normalRoomRepo)
        }
    ]
}

const getNormalRooms = normalRoomRepo => (req, res) => {
    console.log('normal rooms')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    const building = parseInt(query.building || 0)
    const campus = parseInt(query.campus || 0)
    const options = { status, building, campus }

    normalRoomRepo.fetchPage(LIMIT, page, options)
        .then(result => {
            if (result.ok) {
                res.json(result.msg)
            } else {
                console.log(result.msg)
                res.status(500).send('GET Normal Rooms Error')
            }
        })
}

const uploadNormalRoom = normalRoomRepo => (req, res) => {
    const add = req.query.addNew || false
    const room = req.body
    const id = parseInt(req.params.id)
    if (!add && id !== parseInt(room.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }

    if (add) {
        normalRoomRepo.addOne(room)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    } else {
        normalRoomRepo.updateOne({ id }, room)
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
    NormalRoomHandlers
}