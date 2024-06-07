import Transaction from "./transaction.model";
import Account from "../account/account.model";

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
        return user;
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//RECORDAR QUE
// NO se puede eliminar la transaction...

export const createTransaction = async (req, res) => {
    // Podria mandarse "sourceAccount" automaticamente con el id del usuario...
    // "type" sera seleccionado por el usuario de lado del Frontend
    const { type, sourceAccount, destinationAccount, amount, enterprise, nit, description } = req.body;
    await validateUserRequest(req, res);
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const sourceAccountTransaction = await Account.findOne({Number})
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }




    handleResponse(res, Transaction.create({ type, sourceAccount, destinationAccount, amount, enterprise, nit, description }));





}

export const editTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    await validateUserRequest(req, res);
    const newData = { amount };
    handleResponse(res, Transaction.findByIdAndUpdate({ _id: id, status: true }, { $set: newData }, { new: true }));
}

//Obtención de transacciones y Filtrados...

export const getTransactions = async (req, res) => {
    // A que cuenta ingreso... dado en el Frontend
    const { sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ sourceAccount: sourceAccount }));
}

export const getTransaction = async (req, res) => {
    const { id } = req.params;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.findById(id));
}

export const getTransactionsByType = async (req, res) => {
    const { type, sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ type: type, status: true, sourceAccount: sourceAccount }));
}

export const getTransactionsByProcess = async (req, res) => {
    const { process, sourceAccount } = req.body;
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.find({ process: process, status: true, sourceAccount: sourceAccount }));
}

//Revertir la transacción...

export const revertTransaction = async (req, res) => {
    const { id } = req.params;


    
    await validateUserRequest(req, res);
    handleResponse(res, Transaction.findByIdAndUpdate({ _id: id, status: true }, { $set: { status: false } }, { new: true }));
}

