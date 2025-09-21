import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';
import User from '../model/user.model.js';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { 
        expiresIn: '15m' 
    });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d' 
    });

    return { accessToken, refreshToken };
}
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}


export const login = async (req, res) => {
    try {
        const {email,password} = req.body;
        
        const user =await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            const {accessToken, refreshToken} = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            return res.status(200).json({
                message:"Login successful", 
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                role:user.role
            });
        
        }else{
            return res.status(401).json({message:"Invalid email or password"});
        }
    } catch (error) {
        console.log("error in login controller", error);
        res.status(500).json({message:"Server error", error: error.message});
    }
}

export const logout = async (req, res) =>  {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({message:"Logged out successfully"});

    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message});
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message:"No refresh token provided"});
        }

        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redis.get(`refresh_token:${decode.userId}`);


        if(refreshToken !== storedToken){
            return res.status(403).json({message:"Invalid refresh token"});
        }

        const accessToken = jwt.sign({userId: decode.userId}, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({message:" token refreshed successfully"});



    } catch (error) {
        console.log("error in refresh token controller", error);
        res.status(500).json({message:"Server error", error: error.message});
    }
}
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};