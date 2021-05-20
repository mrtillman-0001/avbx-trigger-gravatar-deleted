const {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand
} = require("@aws-sdk/client-s3");

class S3ServiceBase {
  constructor() {
    this._bucketName = "icons.avatarbox.io";
    this._client = new S3Client({
      region: "us-east-1",
    });
  }
  async delete(command) {
    return await this._client.send(command);
  }
  async put(command) {
    return await this._client.send(command);
  }
}

module.exports = class S3Service extends S3ServiceBase {
  constructor() {
    super();
  }

  async deleteIcon(key) {
    if (!key) return null;
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    return await this._client.send(command);
  }
  
  async deleteIcons(...userIds) {
    if (userIds.length == 1) {
      await this.deleteIcon(`u/${userIds[0]}`);
      return;
    }
    const keys = userIds.map((userId) => `u/${userId}`);
    const command = new DeleteObjectsCommand({
      Bucket: this._bucketName,
      Delete: {
        Objects: keys.map(
          (key) =>
            ({
              Key: key,
            })
        ),
      },
    });
    this._client.send(command);
  }
}
