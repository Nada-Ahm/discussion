const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize")
const admin = require("../middleware/admin")
const upload = require("../middleware/uploadImages")
const { body, validationResult } = require('express-validator');
const { query } = require("express");
const util = require("util");
const fs = require("fs");
router.post("/createCategory", admin,
    upload.single('image'),
    body("categoryName")
        .isString()
        .withMessage("please enter a valid category name")
        .isLength({ min: 3 })
        .withMessage("category name should be at least 3 characters"),
    body("categoryDesc")
        .isString()
        .withMessage("please enter a valid category description")
        .isLength({ min: 20 })
        .withMessage("description should be at least 20 characters"),
    async (req, res) => {
        try {
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
            const category = {
                categoryName: req.body.categoryName,
                categoryDesc: req.body.categoryDesc,
                image_url: req.file.filename,
            }
            const query = util.promisify(conn.query).bind(conn);
            await query("insert into category set ?", category);
            res.status(200).json({
                msg: "category created successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.put("/updateCategory/:id", admin,
upload.single('image'),
    body("categoryName")
        .isString()
        .withMessage("please enter a valid category name")
        .isLength({ min: 3 })
        .withMessage("category name should be at least 3 characters"),
    body("categoryDesc")
        .isString()
        .withMessage("please enter a valid category description")
        .isLength({ min: 10 })
        .withMessage("description should be at least 10 characters"),
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const category = await query("select * from category where categoryID = ?", [req.params.id])
            if (!category[0]) {
                res.status(404).json({ msg: "category not found" })
                return 0;
            }
            const categoryObj = {
                categoryName: req.body.categoryName,
                categoryDesc: req.body.categoryDesc
            }
            if (req.file) {
                categoryObj.image_url = req.file.filename;
                fs.unlinkSync("./upload/" + category[0].image_url)
            }
            await query("update category set ? where categoryID = ?", [categoryObj, category[0].categoryID]);
            res.status(200).json({
                msg: "category updated successfully",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    })
router.delete("/deleteCategory/:id", admin,
    async (req, res) => {
        try {
            const query = util.promisify(conn.query).bind(conn);
            const category = await query("select * from category where categoryID = ?", [req.params.id])
            if (!category[0]) {
                res.status(404).json({ msg: "category not found" })
                return
            }
            fs.unlinkSync("./upload/" + category[0].image_url)
            await query("delete from category where categoryID = ?", [category[0].categoryID]);
            res.status(200).json({
                msg: "category deleted successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    })
router.get("/listCategories", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let searchTerm = "";
    if (req.query.searchTerm) {
        searchTerm = `where categoryName LIKE '%${req.query.searchTerm}%' or categoryDesc LIKE '%${req.query.searchTerm}%'`;
    }
    const category = await query(`select * from category ${searchTerm}`);
    category.map((category) => {
        category.image_url = "http://" + req.hostname + ":4000/" + category.image_url;
    })
    res.status(200).json(category);
})
router.get("/showCategory/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const category = await query("select * from category where categoryID = ?", req.params.id);
    if (!category[0]) {
        res.status(404).json({ msg: "category not found" })
        return 0;
    }
    category[0].image_url = "http://" + req.hostname + ":4000/" + category[0].image_url;
    res.status(200).json(category);
})
router.get("/listMedicinesOfAnyCategory/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const categoryfound=await query("select * from category where categoryID = ?", req.params.id);
    if (!categoryfound[0]) {
        res.status(404).json({ msg: "category not found" })
        return 0;
    }
    const category = await query("select * from medicines where categoryID = ?",req.params.id);
    if (!category[0]) {
        res.status(404).json({ msg: "no medicines for this category" })
        return 0;
    }
    category.map((medicine) => {
        medicine.image_url = "http://" + req.hostname + ":4000/" + medicine.image_url;
    })
    res.status(200).json(category);
})
module.exports = router;
