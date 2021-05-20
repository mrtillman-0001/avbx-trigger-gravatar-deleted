const mysql = require("mysql");

module.exports = class MySqlServiceBase {
  constructor(options) {
    this.connection = mysql.createConnection(options);
  }
  async execute(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        sql,
        function (error, results) {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }
  end() {
    this.connection.end();
  }
}