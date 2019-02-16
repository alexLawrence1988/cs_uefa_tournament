'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config/config.live.js');
const authHelper = require('../helpers/authHelper.js');
const databaseHelper = require('../helpers/databaseHelper.js')(config);
const tournamentHelper = require('../helpers/tournamentHelper.js')(databaseHelper, config);

////////////////////////////////////////////////////////////////////////////
///// App access control ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
router.use(function (req, res, next) {

    // Origin allowed to connect
    res.setHeader('Access-Control-Allow-Origin', config.application.domain);
    // Methods allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    // check for token in request
    let token = req.headers['x-access-token'] || req.body.token;
    if (!token) {
        return next('router');
    }
    // authenticate the token
    authHelper.authenticateToken(token)
        .then(valid => {
            if (!valid) {
                return next('router');
            }
        });

    next();
});

////////////////////////////////////////////////////////////////////////////
///// Routes ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// get all teams
router.get('/teams', async (req, res) => {
    let tournament = req.query.tournament;
    let teams = await tournamentHelper.getAllTeams(tournament);
    res.json(teams);
});

// upsert team (used to add the teams from the spreadsheet)
router.post('/teams', async (req, res) => {

    // allow for multiple tournaments
    let tournament = req.body.tournament;
    let team = req.body.team;

    // validate that all the team props exist
    let validTeam = await tournamentHelper.validateTeam(team);

    if (validTeam) {
        let response = tournamentHelper.upsertTeam(tournament, team);
        res.json(response);
    } else {
        res.error('An error occured updating the team, please try again');
    }

})

module.exports = router;
