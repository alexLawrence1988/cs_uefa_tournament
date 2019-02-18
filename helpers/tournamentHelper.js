module.exports = function(dbHelper, config){

    let self = this;

    ////////////////////////////////////////////////////////////////////////////
    ///// Get all teams for tournament /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    this.getTeams = async (tournament) => {
        let params = [];
        // push parameters for stored procedure
        params.push(dbHelper.GetParam('tournamentId', 'varchar(50)', tournament));
        // return the database response obj
        return await dbHelper.CallSP(params, config.SPROCS.getTournamentTeams);
    }

    ////////////////////////////////////////////////////////////////////////////
    ///// Validate a team obj //////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    this.validateTeam = async (team) => {
        // mandatory props
        let teamProps = ['name', 'country', 'eliminated'];
        // default valid
        let valid = true;

        // loop over the mandatory props
        await teamProps.forEach(prop => {
            // check all mandatory props exist
            if (!team[prop]){
                return false
            }

            // check that the type of each prop is correct
            switch(prop){
                case 'name':
                case 'country':
                valid = typeof(team[prop]) == 'string' ? valid : false;
                break;
                case 'eliminated':
                case 'teamId':
                valid = typeof(team[prop]) == 'boolean' ? valid : false;
                break;
            }
        });

        return valid;

    }

    ////////////////////////////////////////////////////////////////////////////
    ///// Upsert a team ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    this.updateTeam = async (tournamentId, team) => {
        let params = [];
        // push parameters for procedure
        params.push(dbHelper.GetParam('teamId', 'int', team.teamId));
        params.push(dbHelper.GetParam('teamName', 'varchar(200)', team.name));
        params.push(dbHelper.GetParam('teamCountry', 'varchar(200)', team.country));
        params.push(dbHelper.GetParam('eliminated', 'bit', team.eliminated));
        params.push(dbHelper.GetParam('tournamentId', 'int', tournamentId));

        // return the database response obj
        return await dbHelper.CallSP(params, config.SPROCS.updateTeam);
    }

    this.getAllTournaments = async() => {
        return await dbHelper.CallSP([], config.SPROCS.getTournaments);
    }

    return self;
}