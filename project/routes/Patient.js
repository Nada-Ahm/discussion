const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const { body, validationResult } = require('express-validator');
const { query } = require("express");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
router.post("/addPatient", admin,
    body("name")
        .isString()
        .withMessage("please enter a valid name!")
        .isLength({ min: 3, max: 20 })
        .withMessage("name should be between (10-20)character"),
    body("email")
        .isEmail()
        .withMessage("please enter a valid email"),
    body("password")
        .isLength({ min: 8, max: 12 })
        .withMessage("password should be between (8-12)character"),
    body("phone")
        .isLength({ min: 11, max: 20 })
        .withMessage("please enter a valid phone!"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const query = util.promisify(conn.query).bind(conn);
            const checkEmailExists = await query("select * from users where email =?", [req.body.email]);
            if (checkEmailExists.length > 0) {
                res.status(400).json({
                    errors:
                        [
                            {
                                msg: "email already exists!",
                            }
                        ]
                })
                return
            }
            const patient = {
                email: req.body.email,
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                token: crypto.randomBytes(16).toString("hex"),
            }
            await query("insert into users set ?", patient);
            delete patient.password;
            res.status(200).json({
                msg: "patient created successfully",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }
)
router.put("/updatePatient/:id", admin,
    body("name")
        .isString().withMessage("please enter a valid name!").isLength({ min: 3, max: 20 }).withMessage("name should be between (3-20)character"),
    body("email")
        .isEmail().withMessage("please enter a valid email!"),
    body("phone")
        .isLength({ min: 11, max: 20 }).withMessage("please enter a valid phone!"),
    body("password")
        .isLength({ min: 8, max: 200 }).withMessage("password should be between (8-200)character"),
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const Patient = await query("select * from users where id = ?", [req.params.id])
            if (!Patient[0]) {
                res.status(404).json({ msg: "Patient not found" })
                return
            }
            const PatientObj = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: await bcrypt.hash(req.body.password, 10),
            }
            const checkEmailExists = await query("select * from users where email =?", [req.body.email]);
            if (checkEmailExists.length > 0) {
                if (Patient == checkEmailExists) {
                    res.status(200).json({
                        msg: "Patient updated successfully",
                    });
                }
                else {
                    res.status(400).json({
                        errors:
                            [
                                {
                                    msg: "email already exists!",
                                }
                            ]
                    })
                    return
                }
            }
            console.log(Patient, checkEmailExists)
            await query("update users set ? where id = ?", [PatientObj, Patient[0].id]);
            res.status(200).json({
                msg: "Patient updated successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.delete("/deletePatient/:id", admin,
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const Patient = await query("select * from users where id = ?", [req.params.id])
            if (!Patient[0]) {
                res.status(404).json({ msg: "Patient not found" })
                return
            }
            await query("delete from users where id = ?", [Patient[0].id]);
            res.status(200).json({
                msg: "Patient deleted successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.get("/listPatients", admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
        search = `where name LIKE '%${req.query.search}%' or email LIKE '%${req.query.search}%' or id LIKE '%${req.query.search}%'`;
    }
    const Patient = await query(`select * from users ${search}`);
    res.status(200).json(Patient);
})
router.get("/showPatient/:id", admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const Patient = await query("select * from users where id = ?", req.params.id);
    if (!Patient[0]) {
        res.status(404).json({ msg: "Patient not found" })
        return 0;
    }
    res.status(200).json(Patient);
})
router.post("/search",
    body("searchTerm"),
    body("user_id"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const query = util.promisify(conn.query).bind(conn);
            const userFound=await query("select * from users where id =?", req.body.user_id);
            if(!userFound[0])
            {
                res.status(404).json({ msg: "Patient not found" })
                return
            }
            const values = {
                searchTerm: req.body.searchTerm,
                user_id: req.body.user_id,
            }
            await query("insert into search set ?", values);
            res.status(200).json({
                msg: "history updated successfully",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }
)
router.get("/listHistory/:id",
    async (req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        const history = await query("select * from search where user_id = ?", req.params.id);
        res.status(200).json(history);
    })
module.exports = router;