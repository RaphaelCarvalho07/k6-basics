import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
    const RES = http.get('http://localhost:3333')

    check(RES, {
        'status code should be 200': (r) => r.status === 200
    })

    sleep(1)
}