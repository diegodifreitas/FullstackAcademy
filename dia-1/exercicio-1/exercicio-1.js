/*
* Exercício 1
    Dado o seguinte vetor e utilizando somente map e reduce, 
    somar todos os valores de produtos e utilize o 
    console.log para ver o valor na tela.
*/
const produtos = [
    {
        nome: 'Bicicleta',
        preco: 1200.0
    },
    {
        nome: 'Capacete',
        preco: 450.0
    }
]

const precos = produtos.map(produto => produto.preco)
const soma = (num1, num2) => num1 + num2
const total = precos.reduce(soma, 0)
console.log('Total: ', total)