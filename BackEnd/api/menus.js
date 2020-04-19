
module.exports = app => {
    get = async (req, res) => {
        app.db('menus')
            .then(menus => {
                app.db('menu_items')
                    .orderBy('order', 'asc')
                    .then(menuItems => {
                        let menuIndex

                        menuItems.forEach(items => {
                            menuIndex = menus.findIndex(menu => menu.id === items.menu_id)

                            if (menus[menuIndex].menuItems === undefined) {
                                menus[menuIndex].menuItems = []
                            }

                            menus[menuIndex].menuItems.push(items)
                        })

                        res.json(menus)
                    })
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    return { get }
}