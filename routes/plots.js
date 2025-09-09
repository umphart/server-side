const express = require('express');
const router = express.Router();
const Plots = require('../models/Plots');

// Create plot
router.post('/', async (req, res) => {
  try {
    const newPlot = await Plots.createPlot(req.body);
    res.json({ success: true, data: newPlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all plots
router.get('/', async (req, res) => {
  try {
    const plots = await Plots.getAllPlots();
    res.json({ success: true, data: plots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single plot
router.get('/:id', async (req, res) => {
  try {
    const plot = await Plots.getPlotById(req.params.id);
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
    res.json({ success: true, data: plot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update plot
router.put('/:id', async (req, res) => {
  try {
    const updatedPlot = await Plots.updatePlot(req.params.id, req.body);
    res.json({ success: true, data: updatedPlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete plot
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlot = await Plots.deletePlot(req.params.id);
    if (!deletedPlot) return res.status(404).json({ success: false, message: 'Plot not found' });
    res.json({ success: true, data: deletedPlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
