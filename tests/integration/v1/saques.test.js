const request = require('supertest')

const faker = require('faker-br')
const app = require('../../../app')

const { checaAutenticacao, geraJwt} = require('./shared/autenticacao')
const { Usuario } = require('../../../models')

const { authenticator } = require('otplib')
const { checaOtp } = require('../../../routes/v1/auth/otp')
const { checaSaldo } = require('../../../services')

describe('/v1/saques', () => {
    checaAutenticacao('/v1/saques')

    describe('se o usuário existe', ()=>{
        let usuario, jwt;

    

        beforeEach(async() =>{
            usuario = await Usuario.create({
                senha: 'qualquer-uma',
                email: 'usuario@teste.com.br',
                confirmado : true,
                nome: 'Usuario Teste',
                cpf: faker.br.cpf(),
                segredoOtp: 'segredo',
                saques: [],
                moedas: [
                    {
                      "quantidade": 10,
                      "codigo": "BRL",
                      "_id": "65791a91e376af65eb4327c5"
                    },
                    {
                        "quantidade": 9,
                        "codigo": "BTC",
                        "_id": "65791a91e376af65eb4327c5"
                    }],
                saldo: 10,
                
            })

            jwt = geraJwt(usuario._id)

        })

        test('ele retorna um 200', () => {
            return request(app)
                .get('/v1/saques')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200);
        })

        test('Usuario não possui nenhum saque', () => {
            return request(app)
                .get('/v1/saques')
                .set('Authorization', `Bearer ${jwt}`)
                .then(resposta => {
                    expect(resposta.body.saques.length).toBe(0)
                })
        })

        describe('realizando saques em BRL',() => {

            let otp;
            
            beforeEach(async() =>{
                otp = await authenticator.generate(usuario.segredoOtp)

            })


            test('usuario não possui saldo para o saque', () => {
                return request(app)
                    .post('/v1/saques')
                    .set('Authorization', `Bearer ${jwt}`)
                    .set('totp', `${otp}`)
                    .send({valor:15})
                    .then(resposta => {
                        expect(resposta.status).toBe(422)
                    })
            })

            test('código otp inválido', () => {
                return request(app)
                    .post('/v1/saques')
                    .set('Authorization', `Bearer ${jwt}`)
                    .set('totp', `1235`)
                    .send({valor:15})
                    .then(resposta => {
                        expect(resposta.status).toBe(401)
                    })
            })


            test('saque realizado e saldo alterado', () => {
                return request(app)
                    .post('/v1/saques')
                    .set('Authorization', `Bearer ${jwt}`)
                    .set('totp', `${otp}`)
                    .set('Content-Type', 'application/json')
                    .send(JSON.stringify({ valor: 5 }))
                    .then(resposta =>{
                        expect(resposta.status).toBe(200)
                        expect(resposta.body.saldo).toBe(5)
                        expect(resposta.body.saques[0].valor).toBe(5)
                    });
            });
        })

        describe('realizando saques de crypto',() => {

            test('usuario não possui saldo para o saque', () => {
                return request(app)
                    .post('/v1/saques/BTC')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({valor:10})
                    .then(resposta => {
                        expect(resposta.status).toBe(422)
                    })
            })

            test('usuario não possui a moeda', () => {
                return request(app)
                    .post('/v1/saques/ADA')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({valor:2})
                    .then(resposta => {
                        expect(resposta.status).toBe(422)
                    })
            })

            test('saque realizado com sucesso', () => {
                return request(app)
                    .post('/v1/saques/BTC')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send({valor:2})
                    .then(resposta => {
                        expect(resposta.status).toBe(200)
                        expect(resposta.body.moedas[1].quantidade).toBe(7)
                        expect(resposta.body.moedas[1].codigo).toBe('BTC')
                    })
            })


        })


    })






})