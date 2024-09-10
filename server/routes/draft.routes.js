import express from "express";
import Draft from "../models/draft.model.js";

const router = express.Router();

// Save a new draft
router.post("/", async (req, res) => {
  try {
    const draft = new Draft(req.body);
    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all drafts
router.get("/", async (req, res) => {
  try {
    const drafts = await Draft.find();
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single draft
router.get("/:id", async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a draft
router.put("/:id", async (req, res) => {
  try {
    const draft = await Draft.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    res.json(draft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a draft
router.delete("/:id", async (req, res) => {
  try {
    const draft = await Draft.findByIdAndDelete(req.params.id);
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    res.json({ message: "Draft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
