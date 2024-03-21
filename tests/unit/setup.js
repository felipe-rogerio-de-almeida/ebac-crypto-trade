const path = require('path')
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

require('dotenv').config({
    path: path.resolve(process.cwd(),'.env.test')
});

let mongo = undefined;

// Executa tudo que está dentro antes dos comandos de teste
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
  
    await mongoose.connect(uri);
  }, 30000); 

afterAll(async () => {
    if (mongo){
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
});

afterEach( async () => {
    if (mongo){
        const collections = mongoose.connection.collections;
        
        for (const modelo in collections) {
            const collection = collections[modelo];
            await collection.deleteMany();
        }
    }
});