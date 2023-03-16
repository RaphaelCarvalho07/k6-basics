import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './libs/uuid.js'

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}

export const options = {
    stages: [
        { duration: "2m", target: 100 }, // below normal load
        { duration: "5m", target: 100 },
        { duration: "2m", target: 200 }, // normal load
        { duration: "5m", target: 200 },
        { duration: "2m", target: 300 }, // around the breaking point
        { duration: "5m", target: 300 },
        { duration: "2m", target: 400 }, // beyond the breaking point
        { duration: "5m", target: 400 },
        { duration: "10m", target: 0 }, // scale down. Recovery stage.
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requisições devem responder em até 2s
        http_req_failed: ['rate<0.01'] // Apenas 1% das requisições podem apresentar algum tipo de erro  
    }
}

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