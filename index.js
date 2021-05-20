const S3Service = require('./services/s3.service');
const MySqlServiceBase = require('./services/mysql.service');
const getMySqlOptions = require('./get-mysql-options');

const handler = async (event) => {

  if(!event || !event.Records || !event.Records.length) return;

  const mySqlOptions = await getMySqlOptions();  
  const mysql = new MySqlServiceBase(mySqlOptions);
  const s3 = new S3Service();
  const ids = [];

  for (const record of event.Records) {
      if(/remove/i.test(record.eventName)) {
          ids.push(record.dynamodb.OldImage.id.N);
      }
  }

  if(ids.length){
      await mysql.execute(`DELETE FROM gravatar.users WHERE id IN (${ids.join(",")})`);
      await s3.deleteIcons(...ids);
      console.log(`deleted ${ids.length} gravatar icons`);
  }

  mysql.end();

};

module.exports = { handler };
