const CampusHandlers = campusRepo => {
    return [
        {
            method: 'get',
            path: '/campus',
            handler: getCampuses(campusRepo)
        }
    ]
}

const getCampuses = campusRepo => (req, res) => {
    campusRepo.fetchAll()
        .then(result => {
            if (result.ok) {
                const campuses = result.msg.map(c => ({
                    id: c.id,
                    label: c.name
                }))
                res.json({
                    choices: campuses
                })
            } else {
                res.status(500).send('GET Campus Error')
            }
        })
}

module.exports = {
    CampusHandlers
}