import { conn } from "./db"
import { Product } from "./product"
import { redisClient } from "./db"

export class ProductsRepository {

  // Método para popular Redis
  async loadCache() {
    const query = 'SELECT * FROM PRODUCTS';
    
    conn.promise().execute(query).then(([rows]: any) => {
        for (const product of rows) {
            const productId = product.ID; // ajuste conforme o nome correto da coluna
            if (productId != null) {
                redisClient.set(`product:${productId}`, JSON.stringify(product));
            } else {
                console.warn('Produto com ID nulo ou indefinido:', product);
            }
        }
        console.log('Cache inicializado com todos os produtos.');
    }).catch(error => {
        console.error('Erro ao carregar o cache:', error);
    });
    
  }

  // Buscar todos os produtos no cache
  async getAll(): Promise<Product[]> {
    try {
        // Verifica se existem produtos armazenados no Redis
        const cachedProducts = await redisClient.keys('product:*');
        
        if (cachedProducts.length > 0) {
            const productPromises = cachedProducts.map(async (key) => {
                const cachedProduct = await redisClient.get(key);
                return JSON.parse(cachedProduct!);
            });

            const products = await Promise.all(productPromises);
            console.log('Produtos obtidos pelo cache:', products);
            return products;
        }

        // Se não houver produtos no cache, busca do MySQL
        const query = 'SELECT * FROM products';
        const [rows]: any = await conn.promise().execute(query);

        if (rows.length > 0) {
            const pipeline = redisClient.multi();
            rows.forEach((product: Product) => {
                // Adiciona cada produto ao Redis com a chave correta
                pipeline.set(`product:${product.ID}`, JSON.stringify(product));
            });
            await pipeline.exec(); // Executa o pipeline para salvar no Redis

            console.log('Produtos obtidos do MySQL e cache atualizado:', rows);
            return rows;
        }

        return []; // Retorna uma lista vazia se nenhum produto for encontrado
    } catch (err) {
        console.error('Erro ao obter produtos:', err);
        throw err;
    }
  }

   getById(productId: number): Promise<Product | null> {
    return redisClient.get(`product:${productId}`).then((cachedProduct) => {
        if (cachedProduct) {
            console.log('Produto obtido do cache:', JSON.parse(cachedProduct));
            return JSON.parse(cachedProduct);
        }

        const query = 'SELECT * FROM products WHERE id = ?';
        return conn.promise().execute(query, [productId]).then(([rows]: any) => {
            if (rows.length > 0) {
                redisClient.set(`product:${productId}`, JSON.stringify(rows[0]));
                console.log('Produto obtido do MySQL e cache atualizado:', rows[0]);
                return rows[0];
            }
            return null;
        });
    });
}

  async create(product: Product): Promise<Product> {
    const query = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
    const values = [product.name, product.price, product.description];

    try {
        // Aguarda a execução da consulta e obtém o resultado
        const [result]: any = await conn.promise().execute(query, values);
        
        // O ID do novo produto é obtido a partir do resultado da inserção
        const newProductId = result.insertId;

        // Cria um novo objeto de produto com o ID gerado
        const createdProduct = { ID: newProductId, ...product };

        // Adiciona o produto ao Redis, usando o ID gerado
        await redisClient.set(`product:${newProductId}`, JSON.stringify(createdProduct));

        // Log para confirmar a adição ao cache
        console.log('Produto adicionado e cache atualizado:', createdProduct);

        // Retorna o produto, incluindo o ID gerado
        return createdProduct;
    } catch (err) {
        console.error('Erro ao adicionar produto:', err);
        throw err;
    }
}

// update(product: Product): Promise<Product | undefined> {
//   try {
//       const query = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
//       const values = [product.name, product.price, product.description, product.id];

//       const [result]: any = conn.promise().execute(query, values);
//       if (result.affectedRows > 0) {
//           // Atualiza o produto no Redis
//           redisClient.set(`product:${product.id}`, JSON.stringify(product));
//           console.log('Produto atualizado no MySQL e cache:', product);
//           return product;
//       } else {
//           console.warn('Nenhum produto encontrado para atualização com ID:', product.id);
//           return undefined;
//       }
//   } catch (err) {
//       console.error('Erro ao atualizar produto:', err);
//       throw err;
//   }
// }

  delete(productId: number): Promise<number | null> {
    const query = 'DELETE FROM products WHERE id = ?';

    return new Promise((resolve, reject) => {
        conn.promise().execute(query, [productId])
            .then(([result]: any) => {
                console.log('Produto removido do MySQL');

                if (result.affectedRows > 0) {
                    // Remove the product from Redis
                    redisClient.del(`product:${productId}`).then(() => {
                        resolve(productId);
                    }).catch((err) => {
                        console.error('Erro ao remover produto do Redis:', err);
                        reject(err);
                    });
                } else {
                    console.warn('Nenhum produto encontrado para exclusão com ID:', productId);
                    resolve(null);
                }
            })
            .catch((err) => {
                console.error('Erro ao deletar produto:', err);
                reject(err);
            });
    });
  }
}