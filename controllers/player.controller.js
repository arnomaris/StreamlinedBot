const Player = require("../models/player.model.js");

// Create and Save a new Player
exports.create = (req, res) => {
    if (!req.body || !req.body.userid || !req.body.discordid || !req.body.active) {
        res.status(400).send({
            message: "Content can not be empty/missing argument!"
        });
        return
    }

    // Create a Player
    const player = new Player({
        userid: req.body.userid,
        discordid: req.body.discordid,
        active: req.body.active
    });

    // Save Player in the database
    Player.create(player, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the player."
            });
        else res.send(data);
    });
};

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
    Player.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving players."
            });
        else res.send(data);
    });
};

// Find a single Player with a playerId
exports.findOne = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Player.findById(req.params.playerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found player with id ${req.params.playerId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving player with id " + req.params.playerId
                });
            }
        } else res.send(data);
    });
};

// Update a Player identified by the playerId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Player.updateById(
        req.params.playerId,
        new Player(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found player with id ${req.params.playerId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating player with id " + req.params.playerId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Player with the specified playerId in the request
exports.delete = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Player.remove(req.params.palyerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found player with id ${req.params.palyerId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete player with id " + req.params.palyerId
                });
            }
        } else res.send({ message: `Player was deleted successfully!` });
    });
};

// Delete all Players from the database.
exports.deleteAll = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Player.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all players."
            });
        else res.send({ message: `All players were deleted successfully!` });
    });
};
