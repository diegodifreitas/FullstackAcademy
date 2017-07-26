require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient
const mongoUri = process.env.DB_MONGO_URI

app.use(express.static('public'))

const path = require('path')

// onde estão os templates
app.set('views', path.join(__dirname, 'views'))
// tipo de template
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/calculadora', (req, res) => {

  const calculoJuros = (p, i, n) => p * Math.pow(1 + i, n)
  const evolucao = (valorInicial, qtdMeses, taxa) => {
    const meses = Array.from(new Array(qtdMeses), (qtdMeses, i) => i + 1)
    return (meses.map(mes => ({
      mes: mes,
      juros: calculoJuros(valorInicial, taxa / 100, mes)
    }))
    )
  }

  const resultado = { calculado: false }

  let { valorInicial, taxa, tempo } = req.query

  if (valorInicial && taxa && tempo) {
    valorInicial = parseFloat(valorInicial)
    taxa = parseFloat(taxa)
    tempo = parseFloat(tempo)
    resultado.evolucao = evolucao(valorInicial, tempo, taxa)
    resultado.calculado = true
  }
  res.render('calculadora', { resultado })
})

const findAll = (db, collectionName) => {
  const collection = db.collection(collectionName)
  const cursor = collection.find({})
  const documents = []

  return new Promise((resolve, reject) => {
    cursor.forEach(
      (doc) => documents.push(doc),
      () => resolve(documents)
    )
  })
}

const find = (db, collectionName, conditions) => {
  const collection = db.collection(collectionName)
  const cursor = collection.find(conditions)
  const documents = []

  return new Promise((resolve, reject) => {
    cursor.forEach(
      (doc) => documents.push(doc),
      () => resolve(documents)
    )
  })
}


const insert = (db, collectionName, document) => {
  const collection = db.collection(collectionName)
  return new Promise((resolve, reject) => {
    collection.insert(document, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}


app.get('/operacoes', async (req, res) => {
  let conditions = {}
  let titulo = "Gerais"
  const { filtro } = req.query
  if (filtro) {
    switch (filtro) {
      case 'entradas':
        titulo = " de Entrada"
        conditions = {
          valor: { $gte: 0 } //greater then equal
        }
        break
      case 'saidas':
        titulo = " de Saída"
        conditions = {
          valor: { $lt: 0 } //less then
        }
        break
      default:
        break
    }
  }
  const operacoes = await find(app.db, 'operacoes', conditions)
  res.render('operacoes', { titulo: titulo, operacoes })
})

// mostrar formulario
app.get('/nova-operacao', (req, res) => res.render('nova-operacao'))
app.post('/nova-operacao', async (req, res) => {
  const operacao = {
    descricao: req.body.descricao,
    valor: parseFloat(req.body.valor)
  }
  const newOperacao = await insert(app.db, 'operacoes', operacao)
  res.redirect('/operacoes')
})

//Exercicio 4
app.get('/contas', async (req, res) => {
  const contas = await findAll(app.db, 'contas')
  res.render('contas', { contas })
})
app.get('/nova-conta', (req, res) => res.render('nova-conta'))
app.post('/nova-conta', async (req, res) => {
  const { descricao, valorEstimado, diaVencimento } = req.body
  const conta = {
    descricao: descricao,
    valorEstimado: parseFloat(valorEstimado),
    diaVencimento: parseInt(diaVencimento)
  }
  const newConta = await insert(app.db, 'contas', conta)
  res.redirect('/contas')
})

MongoClient.connect(mongoUri, (err, db) => {
  if (err) {
    return
  } else {
    app.db = db
    app.listen(port, () => console.log('Server running...'))
  }
})






