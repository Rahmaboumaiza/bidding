const express = require('express');
const { registerUser,loginUser,loginStatus,logoutUser,loginAsSeller,getUser,getuserBalance,getAllUser,estimateIncome,addFavorite,removeFavorite,getFavorites,getTopSellers} = require('../controllers/userController');
const { protect,isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const {upload} =require("../utils/fileUpload");


router.post('/register',upload.single("image"), registerUser);
router.post('/login', loginUser); 
router.get('/loggedin', loginStatus); 
router.get('/logout', logoutUser); 
router.post('/seller', loginAsSeller);
router.get('/getuser',protect ,getUser);
router.get('/sell-amount',protect ,getuserBalance);
router.get('/estimate-income',protect,isAdmin,estimateIncome);
router.get('/users',protect,isAdmin,getAllUser);//only access for admin users


// Favorites Routes (Corrected)
router.post('/favorites/:productId', protect, addFavorite);    // POST /api/users/favorites/:productId
router.get('/favorites', protect, getFavorites);               // GET /api/users/favorites
router.delete('/favorites/:productId', protect, removeFavorite); 

router.get('/top', getTopSellers);

module.exports = router;
