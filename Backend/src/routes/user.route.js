import { Router } from "express";
import { adminSignup, adminLogin, logout, refreshAccessToken, getCurrentUser, createEmployee, getEmployees, editEmployee, getAdminName, deleteEmployee} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

router.route("/register").post(
    adminSignup
)

router.route("/login").post(adminLogin)

router.route("/logout").get(verifyJWT, logout)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/cur-user").get(verifyJWT, getCurrentUser)

router.route("/create-employee").post(
    verifyJWT,
    upload.single('f_Image'),
    createEmployee
)

router.route("/get-employees").get(verifyJWT, getEmployees)

router.route("/get-admin-name").get(verifyJWT, getAdminName)

router.route('/edit-employee').put(
    verifyJWT, 
    upload.single('f_Image'),
    editEmployee
);

router.route("/delete-employee/:email").delete(verifyJWT, deleteEmployee)

export default router