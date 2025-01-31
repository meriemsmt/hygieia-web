require('dotenv').config();
const mysql = require('mysql'); 

  var db_config = {
    host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.MYSQL_DB,
  };
  
  var db;
  
  function handleDisconnect() {
    db = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    db.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 0); // We introduce a delay before attempting to reconnect,
      }else {
        console.log('connected');
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();
  module.exports = {db};