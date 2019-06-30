const RoomHandlers = (roomRepo,
    lectureTimeRepo,
    memberRepo,
    bookingRepo,
    roomDeviceRepo,
    mailerBuilder) => {
    return [
        {
            method: 'get',
            path: '/rooms/status',
            handler: getRoomStatuses(roomRepo)
        },
        {
            method: 'get',
            path: '/rooms/:roomid/lecture_times',
            handler: getRoomLectureTimes(lectureTimeRepo, memberRepo)
        },
        {
            method: 'post',
            path: '/rooms/:roomid/lecture_times',
            handler: uploadRoomBooking(bookingRepo, mailerBuilder)
        },
        {
            method: 'get',
            path: '/rooms/:roomid/devices',
            handler: getRoomDevices(roomDeviceRepo)
        },
        {
            method: 'post',
            path: '/rooms/:roomid/devices/:deviceid',
            handler: addDeviceToRoom(roomDeviceRepo)
        },
        {
            method: 'delete',
            path: '/rooms/:roomid/devices/:deviceid',
            handler: removeDeviceFromRoom(roomDeviceRepo)
        }
    ]
}

const getRoomStatuses = roomRepo => (req, res) => {
    console.log('rooms status')

    roomRepo.fetchRoomStatuses()
        .then(result => {
            if (result.ok) {
                const statuses = result.msg.map(s => ({
                    id: s.id,
                    label: s.name
                }))
                res.json({
                    choices: statuses
                })
            } else {
                res.status(500).send('GET Rooms Status Error')
            }
        })
}

const getRoomLectureTimes = (lectureTimeRepo, memberRepo) => (req, res) => {
    const room = parseInt(req.params.roomid)
    const date = req.query.date
    lectureTimeRepo.fetchByRoomId(room, { date: date })
        .then(result => {
            if (result.ok) {
                const lectureTimes = result.msg
                return Promise.all(lectureTimes.map(async lt => {
                    return Promise.all(lt.members.map(async mem => {
                        return memberRepo.fetchOneById(mem.id)
                            .then(result => {
                                if (result.ok) {
                                    const member = result.msg
                                    return {
                                        id: member.id,
                                        name: member.fullname,
                                        point: member.point,
                                        email: member.email,
                                        start: mem.start,
                                        end: mem.end,
                                        bookingId: mem.bookingId,
                                        roomId: mem.roomId,
                                        date: mem.date
                                    }
                                } else {
                                    res.status(500).send('GET Room Lecture Times Error: Unknown member found')
                                }
                            })
                    })).then(members => ({
                        ...lt,
                        members: members
                    }))
                })).then(lectureTimes => {
                    res.json({
                        lectureTimes: lectureTimes
                    })
                }).catch(err => {
                    console.log(err)
                    res.status(500).send('GET Room Lecture Times Error')
                })
            } else {
                console.log(result.msg)
                res.status(500).send('GET Room Lecture Times Error')
            }
        })
}

const uploadRoomBooking = (bookingRepo, mailerBuilder) => (req, res) => {
    const room = parseInt(req.params.roomid)
    const booking = req.body
    const date = req.query.date

    bookingRepo.updateBooking({ id: booking.id, room, date }
        , { ...booking, chosen: booking.chosenMember })
        .then(result => {
            if (result.ok) {
                const rejectMailer = mailerBuilder.buildBookingRejected('gmail')
                const acceptedMailer = mailerBuilder.buildBookingAccepted('gmail')
                const pendingMailer = mailerBuilder.buildBookingPending('gmail')
                Promise.all(booking.members.map(mem => ({
                    ...mem,
                    startId: mem.start,
                    endId: mem.end,
                    bookingDate: mem.date
                })).map(content => {
                    if (booking.chosenMember && content.id !== booking.chosenMember) {
                        return rejectMailer.send(content.email, content)
                    }
                    if (booking.chosenMember) {
                        return acceptedMailer.send(content.email, content)
                    }
                    return pendingMailer.send(content.email, content)
                })).then(() => {
                    res.json({ code: 'OK' })
                }).catch(err => {
                    console.log(err)
                    res.json({ code: 'FAILED', msg: err })
                })
            } else {
                res.json({ code: 'FAILED', msg: result.msg })
            }
        })
}

const getRoomDevices = roomDeviceRepo => (req, res) => {
    const room = parseInt(req.params.roomid)
    roomDeviceRepo.fetchByRoomId(room)
        .then(result => {
            if (result.ok) {
                res.json({
                    devices: result.msg
                })
            } else {
                res.status(500).send('GET Room Devices Error')
            }
        })
}

const addDeviceToRoom = roomDeviceRepo => (req, res) => {
    const room = parseInt(req.params.roomid)
    const device = req.body
    if (parseInt(req.params.deviceid) !== parseInt(device.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch device ID'
        })
    }
    roomDeviceRepo.addToRoom(device.id, room)
        .then(result => {
            if (result.ok) {
                res.json({ code: 'OK' })
            } else {
                res.json({ code: 'FAILED', msg: result.msg })
            }
        })
}

const removeDeviceFromRoom = roomDeviceRepo => (req, res) => {
    const room = parseInt(req.params.roomid)
    const device = parseInt(req.params.deviceid)
    roomDeviceRepo.removeFromRoom(device.id, room)
        .then(result => {
            if (result.ok) {
                res.json({ code: 'OK' })
            } else {
                res.json({ code: 'FAILED', msg: result.msg })
            }
        })
}

module.exports = {
    RoomHandlers
}