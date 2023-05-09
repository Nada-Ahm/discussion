const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const { body, validationResult } = require('express-validator');
const upload = require("../middleware/uploadImages")
const { query } = require("express");
const util = require("util");
const fs = require("fs");
router.post("/create", admin,
    upload.single('image'),
    body("medicineName")
        .isString()
        .withMessage("please enter a valid medicine name")
        .isLength({ min: 3 })
        .withMessage("medicine name should be at least 3 characters"),
    body("medicineDesc")
        .isString()
        .withMessage("please enter a valid medicine description")
        .isLength({ min: 10 })
        .withMessage("description should be at least 10 characters"),
    body("price")
        .isFloat()
        .withMessage("please enter a valid medicine price"),
    body("expirationDate")
        .isString()
        .withMessage("please enter a valid medicine date"),
    body("categoryID")
        .isDecimal()
        .withMessage("please enter a valid categoryID"),
    async (req, res) => {
        try {
            console.log(req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if (!req.file) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "image is required"
                        }
                    ]
                })
            }
            const medicine = {
                medicineName: req.body.medicineName,
                medicineDesc: req.body.medicineDesc,
                price: req.body.price,
                expirationDate: req.body.expirationDate,
                categoryID: req.body.categoryID,
                image_url: req.file.filename,
            }
            const query = util.promisify(conn.query).bind(conn);
            const categoryFound=await query("select * from category where categoryID = ?", req.body.categoryID);
            if(!categoryFound[0])
            {
                res.status(404).json({ msg: "category not found" })
                return
            }
            await query("insert into medicines set ?", medicine);
            res.status(200).json({
                msg: "medicine created successfully",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    })
router.put("/update/:id", admin,
    upload.single('image'),
    body("medicineName")
        .isString()
        .withMessage("please enter a valid medicine name")
        .isLength({ min: 3 })
        .withMessage("medicine name should be at least 5 characters"),
    body("medicineDesc")
        .isString()
        .withMessage("please enter a valid medicine description")
        .isLength({ min: 20 })
        .withMessage("description should be at least 20 characters"),
    body("price")
        .isFloat()
        .withMessage("please enter a valid medicine price"),
    body("expirationDate")
        .isString()
        .withMessage("please enter a valid medicine date"),
    body("categoryID")
        .isDecimal()
        .withMessage("please enter a valid categoryID"),
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const medicine = await query("select * from medicines where medicineID = ?", [req.params.id])
            if (!medicine[0]) {
                res.status(404).json({ msg: "medicine not found" })
                return
            }
            const medicineObj = {
                medicineName: req.body.medicineName,
                medicineDesc: req.body.medicineDesc,
                price: req.body.price,
                expirationDate: req.body.expirationDate,
                categoryID: req.body.categoryID,
            }
            if (req.file) {
                medicineObj.image_url = req.file.filename;
                fs.unlinkSync("./upload/" + medicine[0].image_url)
            }
            await query("update medicines set ? where medicineID = ?", [medicineObj, medicine[0].medicineID]);
            res.status(200).json({
                msg: "medicine updated successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.delete("/delete/:id", admin,
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const medicine = await query("select * from medicines where medicineID = ?", [req.params.id])
            if (!medicine[0]) {
                res.status(404).json({ msg: "medicine not found" })
                return
            }
            fs.unlinkSync("./upload/" + medicine[0].image_url)
            await query("delete from medicines where medicineID = ?", [medicine[0].medicineID]);
            await query("delete from requestedmedicines where medicineID = ?", [medicine[0].medicineID]);
            res.status(200).json({
                msg: "medicine deleted successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.get("/listOfMedicines'sCategory/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let searchTerm = "";
    if (req.query.searchTerm) {
        searchTerm = `and medicineName LIKE '%${req.query.searchTerm}%' or medicineDesc LIKE '%${req.query.searchTerm}%'`;
    }
    const medicines = await query(`select * from medicines where categoryID = ? ${searchTerm}`, req.params.id);
    medicines.map((medicine) => {
        medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
    })
    res.status(200).json(medicines);
})
router.get("/listOfAllMedicines", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const medicines = await query("select * from medicines");
    medicines.map((medicine) => {
        medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
    })
    res.status(200).json(medicines);
})
router.get("/show/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const medicine = await query("select * from medicines where medicineID = ?", req.params.id);
    if (!medicine[0]) {
        res.status(404).json({ msg: "medicine not found" })
        return
    }
    medicine[0].image_url = "http://" + req.hostname + ":4000/" + medicine[0].image_url;
    res.status(200).json(medicine);
})
router.get("/showRequest", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const requestedmedicines = await query(`select * from requestedmedicines`);
    requestedmedicines.map((medicine) => {
        medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
    })
    res.status(200).json(requestedmedicines);
})
router.put("/accept/:id",
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            var acceptedObj = {}
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const accepted = await query("select * from requestedmedicines where id = ?", req.params.id)
            if (!accepted[0]) {
                res.status(404).json({ msg: "request not found" })
                return
            }
            if (accepted[0]) {
                acceptedObj = {
                    requestState: "accepted",
                }
            }
            await query("update requestedmedicines set ? where id = ?", [acceptedObj, req.params.id]);
            res.status(200).json({
                msg: "request accepted successfully",
            });
             await query("delete from medicines where medicineID = ?", accepted[0].medicineID);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    })
router.put("/decline/:id",
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            var declinededObj = {}
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const declined = await query("select * from requestedmedicines where id = ?", req.params.id)
            if (!declined[0]) {
                res.status(404).json({ msg: "request not found" })
                return
            }
            if (declined[0]) {
                 declinededObj = {
                    requestState: "declined"
                }
            }
            const data={
                medicineID:declined[0].medicineID,
                medicineName:declined[0].medicineName,
                medicineDesc:declined[0].medicineDesc,
                price:declined[0].price,
                expirationDate:declined[0].expirationDate,
                categoryID:declined[0].categoryID,
                image_url:declined[0].image_url,
            }
            await query("update requestedmedicines set ? where id = ?", [declinededObj,req.params.id]);
            await query("insert into medicines set ?", data);
            res.status(200).json({
                msg: "request declined successfully",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    })
router.get("/showMyRequest/:id",
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const requestedmedicines = await query("select * from requestedmedicines where userID = ?", req.params.id);
            requestedmedicines.map((medicine) => {
                medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
            })
            res.status(200).json(requestedmedicines);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    })
router.post("/sendrequest/:id",
    body("userID")
        .isNumeric()
        .withMessage("please enter a valid userID"),
    async (req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        try {
            const [namemedicien] = await query(
                "SELECT * FROM medicines WHERE medicineID = ?",
                [req.params.id]
            );
            if (!namemedicien) {
                return res.status(404).json({ error: "Medicine not found" })
                return;
            }
            const image = await query("SELECT `image_url` FROM `medicines` WHERE medicineID =?", req.params.id)
            const [user_info] = await query("SELECT `email` FROM `users` WHERE id  =?", req.body.userID)
            if (!user_info) {
                return res.status(404).json({ error: "user not found" });
                return
            }
            const reqmediciene = {
                medicineID: req.params.id,
                userID: req.body.userID,
                emailOfUser: user_info.email,
                medicineName: namemedicien.medicineName,
                medicineDesc:namemedicien.medicineDesc,
                price:namemedicien.price,
                expirationDate:namemedicien.expirationDate,
                categoryID:namemedicien.categoryID,
                image_url: image[0].image_url,
            };
            console.log(reqmediciene);
            await query("INSERT INTO `requestedmedicines` SET ?", reqmediciene);
            res.status(200).json({
                msg: "Request sent successfully",
            });
            await query("delete from medicines where medicineID = ?", req.params.id);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
module.exports = router;