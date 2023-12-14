const criaUsuario = require('../../../services/cria-usuario')
const { enviaEmailDeConfirmacao } = require('../../../services/envia-email')
const { Usuario } =require('../../../models')

jest.mock('../../../services/envia-email', () => {
    return{
        enviaEmailDeConfirmacao: jest.fn() //Chama essa função e não da nenhum erro
    }
});

const usuarioMock = {
    email: 'teste@ebac.com.br',
    senha: 'teste@1234',
    cpf: '301.372.350-54',
    nome: 'Usuário de teste'
};

//Gera um contexto de analise de teste
describe('se uma senha não é informada', () => {
    test('ele da um erro informando a ausência da senha', async () => {
        const usuarioTest = { ...usuarioMock, senha: undefined };

        await expect(() => criaUsuario(usuarioTest, 'https://www.google.com.br')).rejects.toThrow('O campo senha é obrigatório')
    });
});


describe('se senha informada é fraca', () => {
    test('ele da um erro de senha', async () => {
        const usuarioTest = { ...usuarioMock, senha: '123' };

        await expect(() => criaUsuario(usuarioTest, 'https://www.google.com.br')).rejects.toThrow('O campo senha deve ter no mínimo 5 caracteres')
    });
});

//Pode se adicionar um .only no describe e no test para que rode apenas esse test especifico *Atenção* cuidado para não deixar o only no codigo
describe('se a url de redirecionamento não for passada', () => {
    test('ele da um erro de url', async() => {
        const usuarioTest = { ...usuarioMock, senha: '123' };

        await expect(() => criaUsuario(usuarioMock, null)).rejects.toThrow('A URL de redirecionamento é obrigatória')
    });
});

describe('Quando as informações passadas são válidas', () => {
    let resposta;

    beforeEach(async() =>{
        resposta = await criaUsuario(usuarioMock, 'https://www.google.com.br');
    });

    test('ele retorna o usuario salvo', async() => {
       await expect(resposta.email).toBe(usuarioMock.email);
    });

    test('ele não retorna a senha', async() => {
        await expect(resposta.senha).toBeUndefined();
    });

    test('cria um usuário não confirmado', async() => {
        await expect(resposta.confirmado).toBe(false)
    })

    test('ele insere apenas um usuário no banco', async () => {
        expect((await Usuario.find()).length).toBe(1)
    })

    test('ele chama corretamento o envio do email de confirmação', async () => {
        await expect(enviaEmailDeConfirmacao.mock.calls.length).toBe(1);
        await expect(enviaEmailDeConfirmacao.mock.calls[0][1]).toBe('https://www.google.com.br');
        await expect(enviaEmailDeConfirmacao.mock.calls[0][0].email).toBe(usuarioMock.email);
        
    })

});
