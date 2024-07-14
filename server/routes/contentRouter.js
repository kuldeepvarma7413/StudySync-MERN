require("dotenv").config();
const express = require("express");
const router = express.Router();
const PDFFile = require("../models/pdfFile.model");
const CAFile = require("../models/caFile.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const streamifier = require("streamifier");
const requireAuth = require("../middleware/auth");

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

// get pdf by id
router.get("/ppt/:id", requireAuth, async (req, res) => {
  try {
    const pdfFile = await PDFFile.findById(req.params.id);
    res.json({ status: "OK", data: pdfFile });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// get ca file by id
router.get("/ca/:id", requireAuth, async (req, res) => {
  try {
    const caFile = await CAFile.findById(req.params.id);
    res.json({ status: "OK", data: caFile });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

router.get("/pdffiles", requireAuth, async (req, res) => {
  try {
    const pdfFiles = await PDFFile.find().sort({ createdAt: -1 }).lean();

    const updatedFiles = await Promise.all(
      pdfFiles.map(async (file) => {
        const course = await Course.findOne({ _id: file.course }).select(
          "courseCode"
        );
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
router.post(
  "/add-pdffile",
  requireAuth,
  upload.array("files"),
  async (req, res) => {
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
          // console.log(`Added image file: ${file.originalname}`);
        } else if (file.mimetype === "application/pdf") {
          const donorPdfDoc = await PDFDocument.load(file.buffer);
          const copiedPages = await pdfDoc.copyPages(
            donorPdfDoc,
            donorPdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => pdfDoc.addPage(page));
          // console.log(`Added PDF file: ${file.originalname}`);
        }
      }

      const pdfBytes = await pdfDoc.save();
      // console.log(`Merged PDF size: ${pdfBytes.length} bytes`);

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
      // console.log(`Uploaded to Cloudinary: ${result.secure_url}`);

      const user = await User.findById(req.user._id);

      const pdfFile = new PDFFile({
        title: req.body.title,
        course: req.body.course,
        unit: req.body.unit,
        fileUrl: result.secure_url,
        createdAt: Date.now(),
        views: 0,
        likes: 0,
        uploadedBy: user.role === "admin" ? "studysync" : user.username,
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
  }
);

// update pdf file view
router.put("/pdfview/:id", requireAuth, async (req, res) => {
  try {
    const pdfFile = await PDFFile.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } }
    );
    res.json({ status: "OK", message: "PDF file view updated" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// delete pdf file
router.delete("/delete-ppt/:id", requireAuth, async (req, res) => {
  try {
    //check admin
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.json({ status: "ERROR", message: "Access denied" });
    }
    const pdfFile = await PDFFile.findById(req.params.id);
    const publicId =
      "pdffiles/" + pdfFile.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await PDFFile.findByIdAndDelete(req.params.id);
    res.json({ status: "OK", message: "PDF file deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// edit name and unit of pdf
router.put("/edit-pptfile/:id", requireAuth, async (req, res) => {
  try {
    //check admin
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.json({ status: "ERROR", message: "Access denied" });
    }
    const pdfFile = await PDFFile.findById(req.params.id);
    pdfFile.title = req.body.title;
    pdfFile.unit = req.body.unit;
    await pdfFile.save();
    res.json({ status: "OK", message: "PDF file updated successfully" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// CA Files

// get ca file by id
router.get("/cafile/:id", requireAuth, async (req, res) => {
  try {
    const caFile = await CAFile.findById(req.params.id);
    res.json({ status: "OK", data: caFile });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// get

router.get("/cafiles", requireAuth, async (req, res) => {
  try {
    const caFiles = await CAFile.find().sort({ createdAt: -1 }).lean();

    const updatedFiles = await Promise.all(
      caFiles.map(async (file) => {
        const course = await Course.findOne({ _id: file.course }).select(
          "courseCode"
        );
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
router.post(
  "/add-cafile",
  requireAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const files = req.files;
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        if (file.mimetype.startsWith("image/")) {
          let img = await pdfDoc.embedJpg(file.buffer);
          const imgDims = img.scale(1);
          const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: imgDims.width,
            height: imgDims.height,
          });
          // console.log(`Added image file: ${file.originalname}`);
        } else if (file.mimetype === "application/pdf") {
          const donorPdfDoc = await PDFDocument.load(file.buffer);
          const copiedPages = await pdfDoc.copyPages(
            donorPdfDoc,
            donorPdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => pdfDoc.addPage(page));
          // console.log(`Added PDF file: ${file.originalname}`);
        }
      }

      const pdfBytes = await pdfDoc.save();
      // console.log(`Merged PDF size: ${pdfBytes.length} bytes`);

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
      // console.log(`Uploaded to Cloudinary: ${result.secure_url}`);

      const user = await User.findById(req.user._id);

      const caFile = new CAFile({
        title: req.body.title,
        course: req.body.course,
        fileUrl: result.secure_url,
        uploadedBy: user.role === "admin" ? "studysync" : req.user.name,
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
  }
);

// update ca file view
router.put("/caview/:id", requireAuth, async (req, res) => {
  try {
    const caFile = await CAFile.findById(req.params.id);
    caFile.views += 1;
    await caFile.save();
    res.json({ status: "OK", message: "CA file view updated" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// delete pdf file
router.delete("/delete-ca/:id", requireAuth, async (req, res) => {
  try {
    //check admin
    const user = await User.findById(req.user._id);
    if (user.role !== "admin") {
      return res.json({ status: "ERROR", message: "Access denied" });
    }
    const caFile = await CAFile.findById(req.params.id);
    const publicId = "cafiles/" + caFile.fileUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await CAFile.findByIdAndDelete(req.params.id);
    res.json({ status: "OK", message: "CA file deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

module.exports = router;
