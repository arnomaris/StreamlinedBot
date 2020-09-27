module.exports = app => {
    const players = require("../controllers/player.controller.js");
  
    // Create a new player
    app.post("/players", players.create);
  
    // Retrieve all player
    app.get("/players", players.findAll);
  
    // Retrieve a single player with customerId
    app.get("/players/:playerId", players.findOne);
  
    // Update a player with customerId
    app.put("/players/:playerId", players.update);
  
    // Delete a player with customerId
    app.delete("/players/:playerId", players.delete);
  
    // Create a new player
    //app.delete("/players", players.deleteAll);
  };