import Router from 'express'
import { createProduct, getProduct} from '../controllers/user.controller'

const router = Router();

router.post('/', createProduct);
router.get('/', getProduct);

export default router;
