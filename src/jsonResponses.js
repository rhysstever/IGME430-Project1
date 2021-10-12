const characters = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getCharacters = (request, response) => {
  const responseJSON = {
    characters,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCharactersMeta = (request, response) => respondJSONMeta(request, response, 200);

const updateCharacter = (request, response, body) => {
  // Prepare a message if the user is missing parameters
  const responseJSON = {
    message: 'Name, level, race, and class are all required',
  };

  if (!body.name || !body.level || !body.race || body.race === 'no-race' || !body.class || body.class === 'no-class') {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  // Checks if the character is already created
  if (characters[body.name]) {
    responseCode = 204;
  } else {
    characters[body.name] = {};
  }

  // Updates or creates values about the character
  characters[body.name].name = body.name;
  characters[body.name].level = body.level;
  characters[body.name].race = body.race;
  characters[body.name].class = body.class;

  if (responseCode === 201) {
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseObj);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getCharacters,
  getCharactersMeta,
  updateCharacter,
  notFound,
  notFoundMeta,
};
