
exports.home = (req, res) =>
{
    if (req.session.username)
    {
        credentials = {}
        credentials.username = req.session.username;        
        credentials.loggedin = true;
        res.status(200).json(credentials);
    }else{
        res.status(400).json({loggedin: false});
    }
}

