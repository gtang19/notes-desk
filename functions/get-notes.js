const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});
exports.handler = async (event, context) => {
  try {
    let response = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("notes"))),
        q.Lambda((x) => q.Get(x))
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
