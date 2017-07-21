/**
* Exercício 5 - extra
    Dado a lista de arquivos/diretórios retornada
    no exercício anterior, mostre quais são arquivos. 
    (utilize fs.stat(caminho, (err, stat) => stat.isFile()) para isso.)
 */

const fs = require('fs')
const { promisify } = require('util')

const PATH = './'

const readdirPromise = promisify(fs.readdir)

const stat = (file) => {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stat) => {
            if (err) {
                reject(err)
            } else {
                resolve({
                    file,
                    stat
                })
            }
        })
    })
}

const readFiles = async (file) => {
    try {
        const all = await readdirPromise(file)
        const promises = all.map(async (file) => await stat(file))
        const returnPromise = await Promise.all(promises)
        const files = returnPromise.filter(file => file.stat.isFile())
        files.map(file => console.log(file.file))
    } catch (error) {
        console.log(error)
    }
}
readFiles(PATH)