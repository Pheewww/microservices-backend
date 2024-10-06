import Router from 'express'
import { createProduct, getProduct, getAllProduct, updateInventory} from '../controllers/user.controller'
import {verifyToken} from '@repo/shared/auth';

const router = Router();

router.post('/', verifyToken, createProduct);
router.get('/:id', getProduct); // get one product
router.get('/', getAllProduct); // get all products
router.put('/bulk', updateInventory); // update products stock


export default router;
