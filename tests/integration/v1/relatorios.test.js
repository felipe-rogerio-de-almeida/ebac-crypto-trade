const request = require('supertest')

const faker = require('faker-br')
const app = require('../../../app')

const { checaAutenticacao, geraJwt} = require('./shared/autenticacao')
const { Usuario, Relatorio } = require('../../../models')


jest.mock('../../../services/envia-email', () => ({
    enviaEmailDeParabenizacao: jest.fn().mockResolvedValue(true),
}));

describe('/v1/relatorios/pnl', () => {
    checaAutenticacao('/v1/relatorios/pnl')

    describe('se o usuário existe', ()=>{
        let usuario, jwt;

        beforeEach(async() =>{
            usuario = await Usuario.create({
                senha: 'qualquer-uma',
                email: 'usuario@teste.com.br',
                confirmado : true,
                nome: 'Usuario Teste',
                cpf: faker.br.cpf(),
            })

            jwt = geraJwt(usuario._id)
        })

        describe('O usuário não tem relatórios', ()=>{
            test('ele retorna um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200);
            })
    
            test('ele retorna um pnl zerado', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(0)
                        expect(resposta.body.sucesso).toBe(true)
                    });
            })
    
        })
    
        describe('se o usuário possui um dia de relatório', () => {
            beforeEach(async() => {
                const dataDoRelatorio = new Date();
    
                await Relatorio.create({
                    saldo: 4200,
                    usuarioId: usuario._id,
                    data: dataDoRelatorio,
                })
    
            })
    
            test('ele retorna um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200);
            })
    
            test('ele retorna um pnl do valor desse dia', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(4200)
                        expect(resposta.body.sucesso).toBe(true)
                    });
            })
        })
        
        describe('se o usuário possui mais de um dia de relatório', () => {
            beforeEach(async() => {
                const dataDoRelatorio = new Date();
    
                await Relatorio.create({
                    saldo: 4200,
                    usuarioId: usuario._id,
                    data: dataDoRelatorio,
                });
    
                dataDoRelatorio.setDate(dataDoRelatorio.getDate()-1)
    
                await Relatorio.create({
                    saldo: 4000,
                    usuarioId: usuario._id,
                    data: dataDoRelatorio,
                });
    
            })
    
            test('ele retorna um 200', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(200);
            })
    
            test('ele retorna um pnl zerado', () => {
                return request(app)
                    .get('/v1/relatorios/pnl')
                    .set('Authorization', `Bearer ${jwt}`)
                    .then(resposta => {
                        expect(resposta.body.pnl).toBe(200)
                        expect(resposta.body.sucesso).toBe(true)
                    });        
            })
        })
    })
})