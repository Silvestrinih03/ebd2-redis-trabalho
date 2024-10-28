# Trabalho Datastore REDIS com BD Relacional.

### Regras
- Equipes de três ou quatro integrantes (deverão formar as equipes no canvas)
- Ler atentamente a definição do trabalho.
- Data exata para entrega do projeto: 01/11 das 08:00 as 23:59h (pelo Canvas).

### Definição

O trabalho consiste em colocar o REDIS para funcionar em conjunto com o banco de dados relacional MySQL. Há diversas estratégias que você e sua equipe podem adotar. 

É importante destacar um cenário real: imagine que este backend seja de uma loja virtual e constantemente os produtos são buscados por milhares de usuários quase que em mesmo instante.

Então, você terá que adaptar o código fornecido para que: 

- Sempre que um produto for cadastrado, deverá ser gravado no banco e ter a garantia que ele foi também para o cache no REDIS.

- Sempre que um produto for excluído, deve ser imediatamente retirado do cache e também do banco. 

- As consultas aos produtos deverão ser sempre realizadas no cache. No entanto, quando seu servidor iniciar pela primeira vez, deverá carregar o cache para uma primeira vez. 

### Aspectos importantes da solução:

Não pode perder a sincronia entre MySQL e Redis. Qualquer perda de sincronia afetará completamente a solução (via backend)

Se o banco de dados for manipulado manualmente, no caso deste trabalho, é possível compreender que todo o sistema ficará comprometido. Mas, se houvesse a necessidade de sincronizar o REDIS novamente, como você faria? Caso houvesse edição manual dos dados diretamente no MySQL? 

### Entrega: 

01/11 via CANVAS das 08:00 até as 23:59

Entregar um arquivo ZIP contendo:
- Um relatório explicando a solução implementada, problemas que ela não resolve e resultados observados (sua equipe terá que testar para garantir que o que está sendo entregue funcione)
- Código completo comentado

**Importante:** Os membros do grupo devem estar inscritos na equipe pelo canvas durante a aula teórica de 28/11 - não serão aceitas inclusões de nomes após a entrega dos trabalhos. 

