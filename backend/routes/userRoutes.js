const express = require('express');
const { registerUser,loginUser,loginStatus,logoutUser,loginAsSeller,getUser,getuserBalance,getAllUser,estimateIncome} = require('../controllers/userController');
const { protect,isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser); 
router.get('/loggedin', loginStatus); 
router.get('/logout', logoutUser); 
router.post('/seller', loginAsSeller);
router.get('/getuser',protect ,getUser);
router.get('/sell-amount',protect ,getuserBalance);
router.get('/estimate-income',protect,isAdmin,estimateIncome);
router.get('/users',protect,isAdmin,getAllUser);//only access for admin users

module.exports = router;
