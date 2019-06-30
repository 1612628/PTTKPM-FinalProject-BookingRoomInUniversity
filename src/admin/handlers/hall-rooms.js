const LIMIT = 5

const HallRoomHandlers = hallRoomRepo => {
    return [
        {
            method: 'get',
            path: '/rooms/halls',
            handler: getHallRooms(hallRoomRepo)
        },
        {
            method: 'post',
            path: '/rooms/halls/:id',
            handler: uploadHallRoom(hallRoomRepo)
        }
    ]
}

const getHallRooms = hallRoomRepo => (req, res) => {
    console.log('hall rooms')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    const campus = parseInt(query.campus || 0)
    const options = { status, campus }

    hallRoomRepo.fetchPage(LIMIT, page, options)
        .then(result => {
            if (result.ok) {
                res.json(result.msg)
            } else {
                console.log(result.msg)
                res.status(500).send('GET Hall Rooms Error')
            }
        })
}

const uploadHallRoom = hallRoomRepo => (req, res) => {
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
        hallRoomRepo.addOne(room)
            .then(result => {
                if (result.ok) {
                    res.json({ code: 'OK' })
                } else {
                    console.log(result.msg)
                    res.json({ code: 'FAILED', msg: result.msg })
                }
            })
    } else {
        hallRoomRepo.updateOne({ id }, room)
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
    HallRoomHandlers
}