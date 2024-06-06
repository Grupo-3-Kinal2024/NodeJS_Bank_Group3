import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";

export const isToken = async (req, res) => {
    const token = req.headers['token'] ;
    if (!token) {
        return res.status(403).json({ msg: 'No token provied.' });
    }
    const user = await verifyToken(token, res);
    return user;
}

const verifyToken = async (token, res) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded.uid});
        if (!user) {return res.status(404).json({ msg: 'The user does not exist.' });
        } else if (user.estado === false) {return res.status(400).json({ msg: 'The user does not active.'});}
        return user;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'The token has expired, please log in agin.' });
        }else {return res.status(401).json({ msg: 'Invalid token. ' + error});}
          
    }
}
