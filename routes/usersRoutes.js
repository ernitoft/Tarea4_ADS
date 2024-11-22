const { 
    getOneUser, 
    createUser, 
    updateUser, 
    deleteUser, 
    getAllUsers 
} = require("../controllers/usersController");
const { Router } = require('express');

const router = Router();


router.get('/', getAllUsers );

router.post('/nuevo', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;