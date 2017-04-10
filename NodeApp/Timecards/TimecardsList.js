

  module.exports = {
  foo: function (ProjectFK) {console.log('foo'); 
  zemba(ProjectFK);
  
  },
  bar: function () {
    console.log('bar');
  }
};

var zemba = function (ProjectFK) {
  var Connection = require('tedious').Connection;
var rows = [];
  var config = {
    userName: 'sa',
    password: 'B/hlui88',
    server: '127.0.0.1',
    
    // If you're on Windows Azure, you will need this:
    options: {encrypt: true,
      database: 'IPSys'}
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
    request = new Request("select * from PCS_Departments where ProjectFK="+ProjectFK, function(err, rowCount) {
      if (err) {
        console.log(err);
      } else {
        console.log(rowCount + ' rows');
        //console.log(rows); 
        //return rows;
        //console.log('returned');
      }
    });

    /*request.on('row', function(columns) {
      columns.forEach(function(column) {
        console.log(column.value);
      });
    });*/

    request.on('row', function(columns) {
      var row = {};
      columns.forEach(function(column) {
          row[column.metadata.colName] = column.value;
      });
      rows.push(row); console.log("row:"+row);
    });

      connection.execSql(request);
      return request;
  }
  
  
}

/*

  var Request = require('tedious').Request;

  function executeStatement() {
    request = new Request("select * from PCS_Departments where ProjectFK=211", function(err, rowCount) {
      if (err) {
        console.log(err);
      } else {
        console.log(rowCount + ' rows');
      }
    });

    request.on('row', function(columns) {
      columns.forEach(function(column) {
        console.log(column.value);
      });
    });

    connection.execSql(request);
  }*/