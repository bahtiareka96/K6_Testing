import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  // Pembuatan Pengguna (Create User)
  const createUserPayload = {
    name: 'Morpheus',
    job: 'Leader'
  };
  const createUserResponse = http.post('https://reqres.in/api/users', createUserPayload);
  check(createUserResponse, {
    'Create User Success (201)': (res) => res.status === 201,
    'User is Created': (res) => JSON.parse(res.body).name === 'Morpheus'
  });

  // Variabel userId untuk menampung id untuk update user
  const userId = JSON.parse(createUserResponse.body).id;

  // Pembaruan Pengguna (Update User)
  const updateUserPayload = {
    name: 'Morpheus',
    job: 'Zion Resident'
  };
  const updateUserResponse = http.put(`https://reqres.in/api/users/${userId}`, updateUserPayload);
  check(updateUserResponse, {
    'Update User Status is 200': (res) => res.status === 200,
    'User is Updated': (res) => JSON.parse(res.body).job === 'Zion Resident'
  });

  sleep(1);
}
