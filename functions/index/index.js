// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body)
      const subject = data.name || 'World'
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${subject} from post request` }),
      }
    }
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject} from get request` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

