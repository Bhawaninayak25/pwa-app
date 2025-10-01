const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/user")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Schema & Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  mobile: String,
  image: Buffer,      
  imageType: String,
     
      // Added this field
});

const Contact = mongoose.model("Contact", contactSchema);

// POST API - Save form data
app.post("/users", upload.single("image"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file ? req.file.originalname : "No file uploaded");

  try {
    const { name, email, address, mobile,  } = req.body;
    if (!name || !email || !address || !mobile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      address,
      mobile,
      image: req.file ? req.file.buffer : undefined,
      imageType: req.file ? req.file.mimetype : undefined,
    });

    const savedContact = await newContact.save();
    res.status(201).json({ success: true, data: savedContact });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET API - Fetch all users
app.get("/users", async (req, res) => {
  try {
    const contacts = await Contact.find();

    const formatted = contacts.map(c => ({
      _id: c._id,
      name: c.name,
      email: c.email,
      address: c.address,
      mobile: c.mobile,
      image: c.image ? `data:${c.imageType};base64,${c.image.toString("base64")}` : null,
      latlon: c.latlon || null,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
