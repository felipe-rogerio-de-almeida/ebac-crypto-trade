const request = require('supertest');

const app = require('../../../app');

describe('/v1/status', () => {
    test('retornar se a api está ok', () => {
        return request(app)
            .get('/v1/status')
            .then(resposta =>{
                expect(resposta.body.status).toBe('ok');
                expect(resposta.body.sucesso).toBe(true);
            })
    })

    test('retorna o status 200', () => {
        return request(app)
            .get('/v1/status')
            .expect(200)
    })
})