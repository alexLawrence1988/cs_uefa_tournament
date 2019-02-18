'use strict';

const express = require('express');
const router = express.Router();
const env = process.env.NODE_ENV || 'local';
const config = require(`../config/config.${env}.js`);
const authHelper = require('../helpers/authHelper.js')(config);
const databaseHelper = require('../helpers/databaseHelper.js')(config);
const tournamentHelper = require('../helpers/tournamentHelper.js')(databaseHelper, config);

////////////////////////////////////////////////////////////////////////////
///// App access control ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
router.use(function (req, res, next) {
    
    let token = req.headers['x-access-token'] || req.body.token;
    if (!token) {
        return next('router');
    }
    // authenticate the token
    authHelper.authenticateToken(token)
        .then(valid => {
            if (!valid) {
                return next('router');
            } else {
                next();
            }
        });
});

////////////////////////////////////////////////////////////////////////////
///// Routes ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res, next) => {

    let tournaments = await tournamentHelper.getAllTournaments();

    if (!tournaments.returnValue == 0){
        next(tournaments);
    } else {
        res.json(tournaments[0]);
    }
});

// get all teams
router.get('/teams', async (req, res, next) => {
    let tournamentId = req.query.tournamentId;
    let teamIdFilter = ~~req.query.teamId;
    let teams = await tournamentHelper.getTeams(tournamentId);

    if (!teams[0]) {
        next(teams);
    } else {
        let result = {
            tournament: teams[0],
            teams: teams[1]
        }
        if (teamIdFilter){
            result.teams = result.teams.filter(t => t.teamId === teamIdFilter);
        }
        res.json(result);
    }
});

// upsert team (used to add the teams from the spreadsheet)
router.post('/teams', async (req, res, next) => {

    let tournamentId = req.body.tournamentId || -1;
    let team = req.body.team;

    // validate that all the team props exist and are valid
    let validTeam = await tournamentHelper.validateTeam(team);

    // if there is a tournamentId and the team is valid, upsert
    if (validTeam && (tournamentId != -1)) {
        let response = await tournamentHelper.updateTeam(tournamentId, team);
        if (response.returnValue == 0) {
            res.json({ success: true, message: `Successfully updated ${team.name}` });
        } else {
            throw new Error('An error occured updating the team');
        }
    } else {
        res.json({ success: false, message: 'Invalid team definition or missing tournament' })
    }
})

module.exports = router;
