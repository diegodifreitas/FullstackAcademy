/**
Exercício 6
    Utilizando o ExpressJS, crie uma rota que some 2 números enviados
    como parâmetros na URL. 
    Exemplo, ao executar no navegador:
    http://localhost:3000/somar?num1=10&num2=30 deverá ser 
    retornado na tela A soma é: 40.
 */
const express = require('express')
const app = express()

const port = 3000

app.get('/', (request, response) => {
    response.send('<a href="/somar?num1=20&num2=30"> <button type="button"> Somar 20 + 30 </button> </a>')
})

app.get('/somar', (request, response) => {
    const { num1, num2 } = request.query

    const somar = (...nums) => {
        return parseFloat(nums[0]) + parseFloat(nums[1]);
    }

    (num1 && num2) ?
        response.send('<b> A soma é: </b>' + somar(num1, num2))
        : response.send('<b>Atenção!</b> Preciso de dois parâmetros para realizar a soma!')

})

app.listen(port, () => console.log('Servidor iniciado na porta: ' + port))