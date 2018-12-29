const express = require('express');
const router = express.Router();
const GlucoseEntry = require('../Models/glucoseEntry.js');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (req, res, next) => {

    GlucoseEntry.find()
        .select("_id value timestamp")
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res, next) => {

    console.log(req.body);
    const entry = new GlucoseEntry({
        _id: mongoose.Types.ObjectId(),
        value: req.body.value,
        timestamp: req.body.timestamp
    });

    entry.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                entry: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    GlucoseEntry.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    error: 'Invalid id.'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    GlucoseEntry.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.patch('/', (req, res, next) => {
    const entry = req.body;
    GlucoseEntry.update({ _id: entry._id }, { $set: entry })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;