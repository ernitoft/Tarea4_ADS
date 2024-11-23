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

router.get('/:id', getOneUser);

router.post('/', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;