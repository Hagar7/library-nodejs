import {Router} from 'express'
import { auth } from '../../Middleware/auth.js';
import { validation } from '../../Middleware/validation.js';
import { myMulter, validationObg } from '../../Services/mymulter.js';
import { asyncHandler } from '../../Utils/errorHandling.js';
import * as userController from './user.controller.js'
import { changepassValidation, changeUserPass, forgetValidation, signInValidation, signupValidation } from './user.validation.js';

const router = Router()


router.post('/adduser',validation(signupValidation),asyncHandler(userController.signup))
router.post('/login',validation(signInValidation),asyncHandler(userController.signIn))
router.get('/logout',auth(),asyncHandler(userController.logOut))
router.post('/forgetpasss',validation(forgetValidation),asyncHandler(userController.forgetPass))
router.put('/changepass',validation(changepassValidation),asyncHandler(userController.changepassCode))
router.get('/confirmationEmail/:token',asyncHandler(userController.confirmEmail))
router.delete('/',auth(),asyncHandler(userController.deleteUser))
router.put('/',auth(),asyncHandler(userController.updateUser))
router.delete('/softDelete',auth(),asyncHandler(userController.softDeletedUser))
router.put('/changeUserPass',auth(),validation(changeUserPass),asyncHandler(userController.chnageUserPass))


router.patch('/profilepic',auth(),myMulter({
    customvalidation:validationObg.image}).single('image'),asyncHandler(userController.userProfile))







export default router;