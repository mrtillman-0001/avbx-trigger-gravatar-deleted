const S3Service = require('./services/s3.service');

const handler = async (event) => {

  if(!event || !event.Records || !event.Records.length) return;

  const s3 = new S3Service();
  const ids = [];

  for (const record of event.Records) {
      if(/remove/i.test(record.eventName)) {
          ids.push(record.dynamodb.OldImage.id.N);
      }
  }

  if(ids.length){
      await s3.deleteIcons(...ids);
      console.log(`deleted ${ids.length} gravatar icons`);
  }

};

module.exports = { handler };
