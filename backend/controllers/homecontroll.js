
exports.home = (req, res) =>
{
    if (req.session.username && req.session.userid)
    {
        credentials = {}
        credentials.username = req.session.username;        
        credentials.loggedin = true;
        credentials.userid = req.session.userid;
        res.status(200).json(credentials);
    }else{
        res.status(400).json({loggedin: false});
    }
}

