const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next()
    }
    res.status(403).json({msg: 'Access denied. Log in first!'})
    return res.redirect('/login')
}
module.exports = isAuthenticated;