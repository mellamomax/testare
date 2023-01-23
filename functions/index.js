const handler = async (event) => {
  const axios = require('axios');

const postToIFTTTWebhook = async (body) => {
  try {
    const response = await axios.post('https://maker.ifttt.com/trigger/send_notification/with/key/d_S45YgOUQspXBsB7VymKs', body);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

const data = {
  value1: "example_data"
}

postToIFTTTWebhook(data);
}

exports.handler = handler;
