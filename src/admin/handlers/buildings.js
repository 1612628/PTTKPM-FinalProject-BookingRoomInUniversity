const BuildingHandlers = buildingRepo => {
    return [
        {
            method: 'get',
            path: '/buildings',
            handler: getBuildings(buildingRepo)
        }
    ]
}

const getBuildings = buildingRepo => (req, res) => {
    const campusid = parseInt(req.query.campus || 0)
    buildingRepo.fetchByCampusId(campusid)
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
                console.log(result.msg)
                res.status(500).send('GET Buildings Error')
            }
        })
}

module.exports = {
    BuildingHandlers
}