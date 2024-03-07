const express = require('express');
const router = express.Router();
const model = require('../models/model');

module.exports = router;


router.post('/tasks', async (req, res) => {
    const data = new model({
        name: req.body.name,
        state: req.body.state
    });

    try {
        const dataToSave = await data.save();
        res.status(201).json(dataToSave); // Ressource créée
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/tasks', async (req, res) => {
    try {
        const datas = await model.find();
        res.json(datas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/tasks/:id', getData, (req, res) => {
    res.json(res.data);
});


router.get('/tasks/:state', getData, async (req, res) => {
    try {
        const tasks = await model.find({ state: 'in-progress' });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.patch('/tasks/:id/complete', getData, async (req, res) => {
    if (req.body.name != null) {
        res.data.name = req.body.name;
    }
    res.data.state = "complete";
    try {
        const updatedData = await res.data.save();
        res.json("Tache complétée");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/tasks/:id', getData, async (req, res) => {
    try {
        await res.data.remove();
        res.json({ message: "Tache supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


function getData(req, res, next) {
    const taskId = req.params.id;
    model.findById(taskId, (err, data) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!data) {
            return res.status(404).json({ message: "Aucune tache trouvee" });
        }
        res.data = data;
        next();
    });
}
