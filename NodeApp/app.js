var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express();
var timecards = require('./Timecards/TimecardsList');
const crypto = require('crypto');

//timecards.foo(211);

//var databaseUrl = "sampledb"; 
//var collections = ["things"]
//var db = require("mongojs").connect(databaseUrl, collections);



// Config
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/timecardlist', function (req, res) {

    var Connection = require('tedious').Connection;
    var results = [];
      var config = {
        userName: 'sa',
        password: '******',
        server: '127.0.0.1',
        
        // If you're on Windows Azure, you will need this:
        options: {encrypt: true,
          database: '******'}
      };

      var connection = new Connection(config);

      connection.on('connect', function(err) {
        // If no error, then good to go...
          //executeStatement();

          executeStatement();
        }
      );

      var Request = require('tedious').Request;

      function executeStatement() {
        var sql = "select Timecards.TimecardPK "
                  +", CONVERT(VARCHAR(10), TimecardDate, 101) as TimecardDate "
                  +", Timecards.ManagerFK "
                  +", ManagerName "
                  +", Approvers "
                  +", m.EmployeePK "
                  +", JobPK "
                  +", JobNo "
                  +", [Status] "
                  +", EmployeeTypeName "
                  +", case when TimecardEmployeeCount = 1 then 'Single' else TimecardTypeName end as TimecardTypeName "
                  +", Timecards.TimecardTypeFK "
                  +", a.ComPK "
                  +"FROM PCS_Timecards Timecards "
                  +"left JOIN "
                  +"(SELECT EmployeePK, isnull(FirstName,'') + ' ' + isnull(LastName,'') as ManagerName, EmployeeTypeFK, Approvers "
                  +"FROM PCS_Employees) m on m.EmployeePK = Timecards.ManagerFK "
                  +"left join PCS_EmployeeTypes on EmployeeTypePK = EmployeeTypeFK "
                  +"left join PCS_TimecardTypes t on t.TimecardTypePK = Timecards.TimecardTypeFK "
                  +"left join PCS_COM_DailyReport a on a.TimecardFK = Timecards.TimecardPK "
                  +"left join PCS_Jobs j on j.JobPK = a.JobFK "
                  +"left join (SELECT COUNT(DISTINCT EmployeeFK) as TimecardEmployeeCount, ComDailyReportFK "
                  +"FROM PCS_COM_DailyReport_Crew"
                  +" GROUP BY ComDailyReportFK ) timecardemps on a.ComPK = timecardemps.ComDailyReportFK "
                  +"WHERE TimecardDate >= '2017-02-01' "
                  +"AND TimecardDate <= '2017-02-28' "
                  +"and Timecards.ProjectFK = 211 "
                  +"AND TimecardTypeFK in (12) "
                  +"Order by TimecardDate DESC, ManagerName";


        request = new Request(sql, function(err, rowCount, rows) {
          if (err) {
            console.log(err);
          } else {
            //console.log(rows);
            res.send(JSON.stringify(results));
          }
        });

        request.on('row', function(columns) {
          var row = {};
          columns.forEach(function(column) {
              row[column.metadata.colName] = column.value;
          });
          results.push(row); 
        });

          connection.execSql(request);
      }

});



app.get('/verifyUser', function (req, res) {


      var userid = req.query.userid;
      var password = req.query.password;


      var Connection = require('tedious').Connection;
      var results = [];
      var config = {
        userName: 'sa',
        password: '******',
        server: '127.0.0.1',
        
        // If you're on Windows Azure, you will need this:
        options: {encrypt: true,
          database: '******'}
      };

      var connection = new Connection(config);

      connection.on('connect', function(err) {
        // If no error, then good to go...
          //executeStatement();

          executeStatement();
        }
      );
      var Request = require('tedious').Request;

      function executeStatement() {
        var sql = "select Password from tblUser join tblPerson on PersonFK=PersonPK where UserName = '"+userid + "'";

        request = new Request(sql, function(err, rowCount, rows) {
          if (err) {
            console.log(err);
          } else {
                
                var HashedPass = '0';
                if(results[0] != undefined)
                  HashedPass = results[0].Password; 
                
                var sha512 = function(password){
                    var hash = crypto.createHash('MD5'); /** Hashing algorithm sha512 */
                    hash.update(password);
                    var value = hash.digest('hex');
                    return {
                        passwordHash:value
                    };
                };
                function saltHashPassword(userpassword) {
                    
                    var passwordData = sha512(userpassword);
                    return passwordData.passwordHash;
                }
                var salt = "AHFJKLAHF7234796HAFS92Y3RAKSJDHF982H";
                var userPass = saltHashPassword(password+salt);

                if(userPass.toUpperCase() === HashedPass.toUpperCase())
                  res.send('yes');
                
                else
                  res.send('no');
                
                
              }
            });

        request.on('row', function(columns) {
          var row = {};
          columns.forEach(function(column) {
              row[column.metadata.colName] = column.value;
          });
          results.push(row); 
        });

          connection.execSql(request);

      }

});



app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

//Bluebird
//*restify. Vs Express
//*Tedious for MSSQL driver
//Tensorflow