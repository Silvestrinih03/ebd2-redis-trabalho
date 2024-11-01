import express from "express";
import { Request, Response, Router } from "express";
import {ProductsRepository} from "./ProductsRepository";
import { Product } from "./product";

const app = express();
const port = 3000;
const routes = Router();

const productsRepo = new ProductsRepository();

// Chama o metodo para popular Redis no inicio do programa 
productsRepo.loadCache();

app.use(express.json());

routes.get('/', (req: Request, res: Response)=>{
    res.statusCode = 200;
    res.send("Funcionando...");
});

// Rota para chamar metodo getAll e obter todos os produtos.
routes.get('/getAllProducts', async(req: Request, res: Response)=>{
    const products = await productsRepo.getAll();
    res.statusCode = 200; 
    res.type('application/json')
    res.send(products);
});

// Rota para chamar metodo getById e obter produto por ID
routes.get('/getProduct/:id', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = await productsRepo.getById(productId);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send('Produto não encontrado');
    }
});

// Rota para chamar metodo create e adicionar um novo produto
routes.post('/createProduct', async (req: Request, res: Response) => {
    const newProduct: Product = req.body;
    try {
        const createdProduct = await productsRepo.create(newProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).send('Erro ao criar produto');
    }
});

// Rota para chamar metodo update e atualizar dados de um produto
routes.put('/updateProduct/:id', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const updatedProduct: Product = { id: productId, ...req.body };
    try {
        const product = await productsRepo.update(updatedProduct);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao atualizar produto');
    }
});

// rota para chamar o metodo delete e deletar um produto
routes.delete('/deleteProduct/:id', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
        const result = await productsRepo.delete(productId);
        if (result != null) {
            res.status(200).send('Produto excluído');
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao deletar produto');
    }
});

// aplicar as rotas na aplicação web backend. 
app.use(routes);

app.listen(3000, ()=>{
    console.log("Server is running on 3000");
});