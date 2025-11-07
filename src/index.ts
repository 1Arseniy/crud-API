import http from 'http';
import { v4 } from 'uuid';
import { TypeUser, TypeUsers } from './types/types';
import { checkUUID } from './utils/checkUUID';
import { getClientData } from './utils/getClientData';

let users: TypeUsers = [];

const server = http.createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/api/users') {
    response.statusCode = 200;
    response.write(JSON.stringify(users));
    response.end();
  } else if (
    request.method === 'GET' &&
    request.url?.startsWith('/api/users/')
  ) {
    const userId = request.url.split('/')[3];

    if (!checkUUID(userId)) {
      response.statusCode = 400;
      response.write(JSON.stringify({ message: 'Invalid UUID' }));
      response.end();
      return;
    }

    const user = users.find((user) => user.id === userId);

    if (!user) {
      response.statusCode = 404;
      response.write(JSON.stringify({ message: 'User not Found' }));
      response.end();
    } else {
      response.statusCode = 200;
      response.write(JSON.stringify(user));
      response.end();
    }
  } else if (request.method === 'POST' && request.url === '/api/users') {
    try {
      const data: TypeUser = await getClientData(request);

      if (!data.username || !data.age || !data.hobbies) {
        response.statusCode = 400;
        response.write(
          JSON.stringify({
            message: 'Error missing required fields: username, age, hobbies',
          }),
        );
        response.end();
      } else {
        const user: TypeUser = {
          id: v4(),
          username: data.username,
          age: data.age,
          hobbies: data.hobbies,
        };

        users.push(user);
        response.statusCode = 201;
        response.write(JSON.stringify(user));
        response.end();
      }
    } catch (err) {
      if (err instanceof Error) {
        response.statusCode = 500;
        response.write(JSON.stringify({ message: err.message }));
        response.end();
      }
    }
  } else if (
    request.method === 'PUT' &&
    request.url?.startsWith('/api/users/')
  ) {
    try {
      const data: TypeUser = await getClientData(request);
      const userId = request.url.split('/')[3];

      if (!checkUUID(userId)) {
        response.statusCode = 400;
        response.write(JSON.stringify({ message: 'Invalid UUID' }));
        response.end();
        return;
      }

      const user = users.find((user) => user.id === userId);

      if (!user) {
        response.statusCode = 404;
        response.write(JSON.stringify({ message: 'User not Found' }));
        response.end();
      } else {
        user.age = data.age;
        user.hobbies = data.hobbies;
        user.username = data.username;
        response.statusCode = 200;

        response.write(JSON.stringify(user));
        response.end();
      }
    } catch (err) {
      if (err instanceof Error) {
        response.statusCode = 500;
        response.write(JSON.stringify({ message: err.message }));
        response.end();
      }
    }
  } else if (
    request.method === 'DELETE' &&
    request.url?.startsWith('/api/users/')
  ) {
    const userId = request.url.split('/')[3];

    if (!checkUUID(userId)) {
      response.statusCode = 400;
      response.write(JSON.stringify({ message: 'Invalid UUID' }));
      response.end();
      return;
    }
    const userForDelete = users.find((user) => user.id === userId);
    if (!userForDelete) {
      response.statusCode = 404;
      response.write(JSON.stringify({ message: 'User not Found' }));
      response.end();
    } else {
      users = users.filter((user) => user.id !== userForDelete.id);
      response.statusCode = 204;
      response.end();
    }
  } else {
    response.statusCode = 404;
    response.write(
      JSON.stringify({
        message: 'Такой конечной точки нет',
      }),
    );
    response.end();
  }
});

server.listen(3000);
