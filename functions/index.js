const handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body)
      const subject = data.name || 'World'
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${subject} from post request` }),
      }
    } else if (event.httpMethod === 'GET') {
      const subject = event.queryStringParameters.name || 'World'
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${subject} from get request` }),
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request method' }),
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

exports.handler = handler
