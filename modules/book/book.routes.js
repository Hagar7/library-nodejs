import {Router} from 'express'
import { validation } from '../../Middleware/validation.js';
import { auth } from '../../Middleware/auth.js';
import { asyncHandler } from '../../Utils/errorHandling.js';
import * as bookController from './book.controller.js'
import { validationaddBook, validationsearchborrow} from './book.validation.js';
import { myMulter, validationObg } from '../../Services/mymulter.js';

const router = Router()


router.post('/',validation(validationaddBook),asyncHandler(bookController.addBook))
router.get('/',asyncHandler(bookController.getBook))

router.put('/changebook',auth(),asyncHandler(bookController.addBookBorrow))
router.get('/getborow',asyncHandler(bookController.getBorrowDetails))
router.get('/book/serachByname',validation(validationsearchborrow),asyncHandler(bookController.searchBorrowBooks))

router.get('/late',auth(),asyncHandler(bookController.notreturned))

router.patch('/bookpic',myMulter({
    customvalidation:validationObg.image}).single('image'),asyncHandler(bookController.bookPicture))

export default router;