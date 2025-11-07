import { expect, describe, it } from 'vitest';
import request from 'supertest';
import { server } from '../index';

describe('server tests', () => {
  const user = {
    username: 'alex_koval',
    age: 30,
    hobbies: ['cycling', 'photography', 'reading'],
  };

  it('should get all users if method - GET,  edpoint - /api/users', async () => {
    const res = await request(server).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
  });

  it('should craete new user if method - POST edpoint = api/users', async () => {
    const res = await request(server).post('/api/users').send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.age).toBe(user.age);
    expect(res.body.username).toBe(user.username);
    expect(res.body.hobbies[0]).toBe(user.hobbies[0]);
  });

  it('should return user by id', async () => {
    const res = await request(server).post('/api/users').send(user);

    const getUser = await request(server).get(`/api/users/${res.body.id}`);

    expect(getUser.statusCode).toBe(200);
    expect(getUser.body.age).toBe(user.age);
    expect(getUser.body.username).toBe(user.username);
    expect(getUser.body.hobbies[0]).toBe(user.hobbies[0]);
  });

  it('should update user', async () => {
    const res = await request(server).post('/api/users').send(user);

    const newInfo = {
      username: 'Arseniy',
      age: 1,
      hobbies: [],
    };

    const updateUser = await request(server)
      .put(`/api/users/${res.body.id}`)
      .send(newInfo);

    expect(res.body.id).toBe(updateUser.body.id);
    expect(updateUser.statusCode).toBe(200);
    expect(updateUser.body.age).toBe(newInfo.age);
    expect(updateUser.body.username).toBe(newInfo.username);
    expect(updateUser.body.hobbies[0]).toBe(newInfo.hobbies[0]);
  });

  it('should remove user by id and ', async () => {
    const res = await request(server).post('/api/users').send(user);

    const removeUser = await request(server).delete(
      `/api/users/${res.body.id}`,
    );

    expect(removeUser.statusCode).toBe(204);
  });

  it('should return "User not Found" if user no', async () => {
    const res = await request(server).post('/api/users').send(user);

    await request(server).delete(`/api/users/${res.body.id}`);

    const getUser = await request(server).get(`/api/users/${res.body.id}`);

    expect(getUser.body.message).toBe('User not Found');
  });
});
