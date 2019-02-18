module.exports = {
    port: 8500,   
    domain: 'https://www.clubSpark.com', 
    databaseConfig: {
        user: 'admin',
        password: 'portsmouth1',
        server: 'thepuntersedge.ctmejohupkg5.eu-west-2.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
        database: 'ClubSparkTournament',
    },
    SPROCS:{
        getTournamentTeams: 'dbo.getTournamentDetails',
        updateTeam: 'dbo.updateTeam',
        getTournaments: 'dbo.getTournaments'
    },
    api: {
        secretKey: 'clubSparkSecretKey'
    }
}