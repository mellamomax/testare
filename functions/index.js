const handler = async (event) => {
  const axios = require('axios');
  try {
    const postToIFTTTWebhook = async (body) => {
       await axios.post('https://maker.ifttt.com/trigger/send_notification/with/key/d_S45YgOUQspXBsB7VymKs', body);
    }
    const data = {
      value1: "example_data"
    }
    await postToIFTTTWebhook(data);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully sent data to IFTTT webhook" })
    }
  } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: error.toString() })
    }
  }
}
exports.handler = handler;
