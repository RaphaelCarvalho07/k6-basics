import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './libs/uuid.js'

export default function () {
    const URL = 'http://localhost:3333/signup'

    const PAYLOAD = JSON.stringify(
        {
            email: `${uuid.v4().substring(24)}@qa.raphilskecompany.com`,
            password: 'pwd123'
        })

    const HEADERS = {
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    const RES = http.post(URL, PAYLOAD, HEADERS)

    check(RES, {
        'status code should be 201': (r) => r.status === 201
    })

    sleep(1)
}