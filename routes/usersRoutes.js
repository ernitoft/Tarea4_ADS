const { getOneUser } = require("../controllers/usersController");
const router = Router();


router.get('/{id}', getOneUser);

module.exports = router;