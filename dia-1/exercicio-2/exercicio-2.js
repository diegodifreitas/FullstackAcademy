/**
* Exercício 2
    Dado o seguinte vetor e utilizando somente map, reduce e filter.
        2a) Gere um novo vetor com a lista de produtos cuja a quantidade seja maior que 0
        2b) Gere um novo vetor somente com o id do produto e o sub-total (preco x qtd)
        2c) Gere o somatório dos sub-totais
 */

const produtos = [
    {
        id: 1,
        preco: 10.0,
        qtd: 2
    },
    {
        id: 2,
        preco: 10.0,
        qtd: 2
    },
    {
        id: 3,
        preco: 10.0,
        qtd: 2
    },
    {
        id: 4,
        preco: 10.0,
        qtd: 0
    }
]

VALOR_INICIAL = 0

isMaiorQueZero = (produto) => produto.qtd > 0

subTotal = (produto) => {
    return {
        id: produto.id,
        subTotal: produto.qtd * produto.preco
    }
}

const soma = (valorAnterior, produtoAtual) => valorAnterior + produtoAtual.subTotal

const novoVetor = produtos
                .filter(isMaiorQueZero)
console.log('Vetor somente com produtos com qtd acima de 0: ' + JSON.stringify(novoVetor))

const novoVetorDeProdutos = produtos
                .filter(isMaiorQueZero)
                .map(subTotal)
console.log('Vetor somente com id e sub totais: ' + JSON.stringify(novoVetorDeProdutos))

const total = produtos
                .filter(isMaiorQueZero)
                .map(subTotal)
                .reduce(soma, VALOR_INICIAL)
console.log('Somatorio dos sub totais: ' + total)