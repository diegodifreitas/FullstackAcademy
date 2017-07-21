/**
* Exercício 4
    Construa uma função async que utiliza a função 
    readdirPromise com await e escreva no console a 
    lista de arquivos/diretórios retornados.
 */
const fs = require('fs')
const { promisify } = require('util')

const PATH = './'

const readdirPromise = promisify(fs.readdir)
/* const readdirPromise = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, content) => {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
} */

const readContentDir = async (path) => {
    try {
        const content = await readdirPromise(path)
        console.log(content)
    } catch (error) {
        console.log('Ocorreu um erro.')
    }
}

readContentDir(PATH)





