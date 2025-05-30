const express = require('express');
const { createProduct,getAllProducts,getProduct, getAllSoldProducts ,deleteProduct,updateProduct,getAllProductsOfUser,getWonProducts,verifyAndCommissionProductByAdmin, getAllProductsByAmdin,deleteProductsByAmdin,updateVerify,markProductAsExpired} = require('../controllers/productController');
const { protect,isAdmin,isSeller} = require('../middleware/authMiddleware');
const {upload} =require("../utils/fileUpload");
const router = express.Router();


router.post('/',protect,isSeller,upload.single("image"), createProduct);
router.get('/',getAllProducts);
router.get('/sold',getAllSoldProducts);
router.get('/won-products', protect, getWonProducts);
router.get('/user',protect,getAllProductsOfUser);


router.get('/:id',getProduct);
router.delete('/:id',protect,isSeller,deleteProduct);
router.put('/:id',protect,isSeller,upload.single("image"), updateProduct);


router.patch("/:id/expire", markProductAsExpired);

//only access for admin user
router.patch('/admin/product-verified/:id',protect,isAdmin,verifyAndCommissionProductByAdmin);
router.get('/admin/products',protect,isAdmin,getAllProductsByAmdin);
router.delete('/admin/products',protect,isAdmin,deleteProductsByAmdin);
router.patch('/admin/verify/:id', protect, isAdmin, updateVerify);
module.exports = router;
