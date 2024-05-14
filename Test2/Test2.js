import http from 'k6/http';
import { check, sleep } from 'k6';
// Ditambahkan guna mendapatkan output report berupa HTML
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "hasiltest2.html": htmlReport(data), // Ditambahkan guna mendapatkan output report berupa HTML
  };
}

export const options = {
    vus: 1000, // Total virtual users
    iterations: 3500, // Total iterations
    thresholds: {
      http_req_duration: ['p(95)<2000'], // 95% request harus berhasil dalam waktu kurang dari 2 detik
    },
};

export default function () {
    // Pembuatan Pengguna
    const createUserPayload = {
        name: 'Morpheus',
        job: 'Leader'
    };
    const createUserResponse = http.post('https://reqres.in/api/users', createUserPayload);
    check(createUserResponse, {
      'Create User Status is 201': (res) => res.status === 201,
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
