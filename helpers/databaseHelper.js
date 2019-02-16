var sql = require('mssql');

module.exports = function (config) { 
    
    let self = this;

    self.config = config;
    self.connection = {};
    self.connected = false;

    this.connectToDB = async () => {

        self.connection = new sql.Connection(config.databaseConfig, (err) => {
            console.info("Connection to database created");
            if (err != undefined) {
                console.info("Error " + JSON.stringify(err));
                return err;
            };

            self.connection.on('error', function (err) {
                console.error("There was a database connection error " + JSON.stringify(err));
                process.exit(2);
            });

            return;
        });
        
    }


    this.GetParam = function (name, type, value) {
        return { name: name, type: type, value: value };         
    };

    this.CallSP = async (params, procedure) => {
       
        let request = new sql.Request(self.connection);

        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            let name = param.name;
            let value = param.value;
            let type = param.type;
            let length;

            let beginParentheses = type.indexOf("(");
            let endParentheses = type.indexOf(")");

            if (beginParentheses > -1 && endParentheses > -1) {
                length = type.substring(beginParentheses + 1, endParentheses);
                type = type.substring(0, beginParentheses);
            }

            switch (type) {
                case "varchar":
                    request.input(name, sql.VarChar(length), value);
                    break;
                case "bit":
                    request.input(name, sql.Bit, value);
                    break;
                case "bigint":
                    request.input(name, sql.BigInt, value);
                    break;
                case "decimal":
                    request.input(name, sql.Decimal(length), value);
                    break;
                case "float":
                    request.input(name, sql.Float, value);
                    break;
                case "int":
                    request.input(name, sql.Int, value);
                    break;
                case "money":
                    request.input(name, sql.Money, value);
                    break;
                case "numeric":
                    request.input(name, sql.Numeric(length), value);
                    break;
                case "smallint":
                    request.input(name, sql.SmallInt, value);
                    break;
                case "smallmoney":
                    request.input(name, sql.SmallMoney, value);
                    break;
                case "real":
                    request.input(name, sql.Real, value);
                    break;
                case "tinyint":
                    request.input(name, sql.TinyInt, value);
                    break;
                case "char":
                    request.input(name, sql.Char(length), value);
                    break;
                case "nchar":
                    request.input(name, sql.NChar(length), value);
                    break;
                case "text":
                    request.input(name, sql.Text, value);
                    break;
                case "ntext":
                    request.input(name, sql.NText, value);
                    break;
                case "letchar":
                    request.input(name, sql.letChar(length), value);
                    break;
                case "nletchar":
                    request.input(name, sql.NletChar(length), value);
                    break;
                case "xml":
                    request.input(name, sql.Xml, value);
                    break;
                case "time":
                    request.input(name, sql.Time(length), value);
                    break;
                case "date":
                    request.input(name, sql.Date, value);
                    break;
                case "datetime":
                    request.input(name, sql.DateTime, value);
                    break;
                case "datetime2":
                    request.input(name, sql.DateTime2(length), value);
                    break;
                case "datetimeoffset":
                    request.input(name, sql.DateTimeOffset(length), value);
                    break;
                case "smalldatetime":
                    request.input(name, sql.SmallDateTime, value);
                    break;
                case "uniqueidentifier":
                    request.input(name, sql.UniqueIdentifier, value);
                    break;
                case "binary":
                    request.input(name, sql.Binary, value);
                    break;
                case "letbinary":
                    request.input(name, sql.letBinary(length), value);
                    break;
                case "image":
                    request.input(name, sql.Image, value);
                    break;
                case "udt":
                    request.input(name, sql.UDT, value);
                    break;
                case "geography":
                    request.input(name, sql.Geography, value);
                    break;
                case "geometry":
                    request.input(name, sql.Geometry, value);
                    break;
                case "TVP":
                    request.input(name, sql.TVP, value);
                    break;
            }
        }
        try {
            return await request.execute(procedure)
                .then(function (data) {
                    return data;
                })
                .catch(function (err) {
                    console.error(err.message);
                    return err;
                });
        }
        catch (err) {
            console.error("Sproc call failed [" + procedure + "], error " + err);
            deferred.reject(err);
        }        
    }

    this.connectToDB().then((d) => {
        console.trace("Connected to database");
        self.connected = true;
    });

    return self;
}