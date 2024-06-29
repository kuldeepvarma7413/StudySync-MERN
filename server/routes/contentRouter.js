require("dotenv").config();
const express = require("express");
const router = express.Router();
const PDFFile = require("../models/pdfFile.model");
const CAFile = require("../models/caFile.model");
const Course = require("../models/course.model");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const streamifier = require("streamifier");

// cloudinary configuration
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.get("/pdffiles", async (req, res) => {
  try {
    const pdfFiles = await PDFFile.find().sort({ createdAt: -1 }).lean();

    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        const course = await Course.findOne({ _id: file.course }).select("courseCode");
        return {
          ...file,
          courseCode: course.courseCode,
        };
      })
    );

    res.json({
      status: "OK",
      message: "PDF files fetched successfully",
      data: updatedFiles,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to fetch PDF files" });
  }
});

// hold

// add pdf file (image in cloudinary)
router.post("/add-pdffile", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      if (file.mimetype.startsWith("image/")) {
        const img = await pdfDoc.embedPng(file.buffer);
        const imgDims = img.scale(1);
        const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: imgDims.width,
          height: imgDims.height,
        });
        console.log(`Added image file: ${file.originalname}`);
      } else if (file.mimetype === "application/pdf") {
        const donorPdfDoc = await PDFDocument.load(file.buffer);
        const copiedPages = await pdfDoc.copyPages(
          donorPdfDoc,
          donorPdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
        console.log(`Added PDF file: ${file.originalname}`);
      }
    }

    const pdfBytes = await pdfDoc.save();
    console.log(`Merged PDF size: ${pdfBytes.length} bytes`);

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_stream(
          { folder: "pdffiles", resource_type: "auto" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(pdfBytes).pipe(streamLoad);
      });
    };

    const result = await uploadStream();
    console.log(`Uploaded to Cloudinary: ${result.secure_url}`);

    const pdfFile = new PDFFile({
      title: req.body.title,
      course: req.body.courseCode,
      unit: req.body.unit,
      fileUrl: result.secure_url,
      createdAt: Date.now(),
      views: 0,
      likes: 0,
      uploadedBy: req.user.name,
    });

    const savedPdfFile = await pdfFile.save();
    res.json({
      status: "OK",
      message: "PDF file added successfully",
      data: savedPdfFile,
    });
  } catch (error) {
    console.error("Error merging files:", error);
    res.status(500).send("An error occurred while merging files.");
  }
});

// update pdf file view
router.put("/pdfview/:id", async (req, res) => {
  try {
    const pdfFile = await PDFFile.findOneAndUpdate({ _id: req.params.id}, { $inc: { views: 1 } });
    res.json({ status: "OK", message: "PDF file view updated" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// CA Files

// get

router.get("/cafiles", async (req, res) => {
  try {
    const caFiles = await CAFile.find().sort({ createdAt: -1 }).lean();

    const updatedFiles = await Promise.all(
      caFiles.map(async (file) => {
        const course = await Course.findOne({ _id: file.course }).select("courseCode");
        console.log(course, file.course)
        return {
          ...file,
          courseCode: course.courseCode,
        };
      })
    );

    res.json({
      status: "OK",
      message: "CA files fetched successfully",
      data: updatedFiles,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to fetch CA files" });
  }
});

// add pdf file (image in cloudinary)
router.post("/add-cafile", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      if (file.mimetype.startsWith("image/")) {
        const img = await pdfDoc.embedPng(file.buffer);
        const imgDims = img.scale(1);
        const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: imgDims.width,
          height: imgDims.height,
        });
        console.log(`Added image file: ${file.originalname}`);
      } else if (file.mimetype === "application/pdf") {
        const donorPdfDoc = await PDFDocument.load(file.buffer);
        const copiedPages = await pdfDoc.copyPages(
          donorPdfDoc,
          donorPdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
        console.log(`Added PDF file: ${file.originalname}`);
      }
    }

    const pdfBytes = await pdfDoc.save();
    console.log(`Merged PDF size: ${pdfBytes.length} bytes`);

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_stream(
          { folder: "cafiles", resource_type: "auto" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(pdfBytes).pipe(streamLoad);
      });
    };

    const result = await uploadStream();
    console.log(`Uploaded to Cloudinary: ${result.secure_url}`);

    console.log(req.body);
    const caFile = new CAFile({
      course: req.body.courseCode,
      fileUrl: result.secure_url,
      uploadedBy: req.user.name,
      caNumber: req.body.canumber,
      caDate: req.body.cadate,
      createdAt: Date.now(),
      isVerified: true,
      views: 0,
      likes: 0,
    });

    const savedPdfFile = await caFile.save();
    res.json({
      status: "OK",
      message: "PDF file added successfully",
      data: savedPdfFile,
    });
  } catch (error) {
    console.error("Error merging files:", error);
    res.status(500).send("An error occurred while merging files.");
  }
});

// update ca file view
router.put("/caview/:id", async (req, res) => {
  try {
    const caFile = await CAFile.findById(req.params.id);
    caFile.views += 1;
    await caFile.save();
    res.json({ status: "OK", message: "CA file view updated" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

module.exports = router;
