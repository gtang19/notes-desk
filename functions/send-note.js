const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = async (event, context) => {
  try {
    const inputs = JSON.parse(event.body);

    let response = await client.query(
      q.Create(q.Collection("notes"), {
        data: inputs,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
