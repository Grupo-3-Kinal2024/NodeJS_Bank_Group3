import { isToken } from '../../helpers/tk-methods.js';
import { validateUser } from '../../helpers/data-methods.js';
import Favorite from './favorite.model.js';
import Account from '../account/account.model.js'
import User from '../user/user.model.js'

const handleResponse = (res, promise) => {
    promise
        .then(data => res.status(200).json(data))
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const validateUserRequest = async (req, res) => {
    try {
        const user = await isToken(req, res);
        validateUser(user._id);
        return true;    
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


export const getAllFavorites = async(req, res) =>{
    await validateUserRequest(req, res);
    handleResponse(res, Favorite.find({status: true}))
}

export const deleteFavorite = async(req, res)=>{
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Favorite.findByIdAndUpdate({_id: id, status: false})) 
}

export const addFavorite = async (req, res) =>{
    console.log("Iniciando addFavorite");
    const { numberAccount, DPIFavorite, DPIPersonal, alias } = req.body

    if(!numberAccount || !DPIFavorite || !DPIPersonal || !alias ){
        return res.status(400).json({ error: `All fields are required` });
    }
    try{
        const userValidate = await validateUserRequest(req, res);
        if (!userValidate) return;

        const accountValidate = await Account.findOne({ numberAccount });
        if(!accountValidate){
            return res.status(404).json({error: `Account doesnt exist`});
        }

        const favoriteDPIExist = await User.findOne({ DPI: DPIPersonal });
        if(!favoriteDPIExist){
            return res.status(404).json({msg: 'Favorite DPI doesnt exist'})
        }

        const personalDPIExist = await User.findOne({DPI: DPIFavorite});
        if(!personalDPIExist){
            return res.status(404).json({msg: 'Personal DPI doesnt exist'})
        }
        
        const newFavorite = new Favorite({
            numberAccount, DPIFavorite, DPIPersonal, alias
        });

        handleResponse(res, newFavorite.save());
    } catch (e){
        console.error('Error:', e);
        res.status(500).json({error: 'Internal Server Error'})
    }

}