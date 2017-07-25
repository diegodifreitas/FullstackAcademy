require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient
const mongoUri = `mongodb://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@my-money-shard-00-00-l9y4l.mongodb.net:27017,my-money-shard-00-01-l9y4l.mongodb.net:27017,my-money-shard-00-02-l9y4l.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=my-money-shard-0&authSource=admin`

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

  const resultado = { calculado: false }

  let { valorInicial, taxa, tempo } = req.query

  if (valorInicial && taxa && tempo) {
    resultado.calculado = true

    valorInicial = parseFloat(valorInicial)
    taxa = parseFloat(taxa)
    tempo = parseFloat(tempo)

    const meses = Array.from(new Array(tempo), (tempo, i) => i)

    resultado.valores = meses.map(mes => ({
      mes: ++mes,
      valor: calculoJuros(valorInicial, taxa / 100, ++mes)
    }))

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
  let operacoes = await findAll(app.db, 'operacoes')
  const { filtro } = req.query
  if (filtro) {
    switch (filtro) {
      case 'entradas':
        operacoes = operacoes.filter(o => o.valor > 0)
        res.render('operacoes', { titulo: 'de Entrada', operacoes })
      case 'saidas':
        operacoes = operacoes.filter(o => o.valor < 0)
        res.render('operacoes', { titulo: 'de Saida', operacoes })
      default:
        break
    }
  } else {
    res.render('operacoes', { titulo: 'Gerais', operacoes })
  }
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

MongoClient.connect(mongoUri, (err, db) => {
  if (err) {
    return
  } else {
    app.db = db
    app.listen(port, () => console.log('Server running...'))
  }
})






