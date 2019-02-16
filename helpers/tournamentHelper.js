module.exports = function(dbHelper, config){

    ////////////////////////////////////////////////////////////////////////////
    ///// Get all teams for tournament /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    this.getAllTeams = async (tournament) => {
        let params = [];

        params.push(dbHelper.GetParam('tournament', 'varchar(50)', tournament));
        return await dbHelper.CallSP(params, config.SPROCS.getAllTeams)
    }


    ////////////////////////////////////////////////////////////////////////////
    ///// Upsert a team ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    this.upsertTeam = async (team) => {
        let params = [];

        params.push(dbHelper.getParam('teamName', 'varchar(50)', team.name));
        params.push(dbHelper.getParam('teamCountry', 'varchar(50)', team.country));
        params.push(dbHelper.getParam('teamEliminated', 'bit', team.eliminated));

        return await dbHelper.CallSP(params, config.SPROCS.upsertTeam);
    }
}