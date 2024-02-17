
 const express = require('express')
 const router = express.Router()
 const adminController = require('../controllers/adminController.js')
 

 router.post('/register', adminController.register);
 router.get('/verify-email/:token', adminController.verifyEmail);
 router.post('/signin', adminController.signIn);
 router.delete('/delete/:id' , adminController.deleteAdmin)
 router.put('/update/:id', adminController.updateAdmin)
 router.get('/allAdmins' , adminController.getAllAdmins)
 router.get('/totalAdmins' , adminController.getTotalNumberOfAdmins)
 
 module.exports = router;

