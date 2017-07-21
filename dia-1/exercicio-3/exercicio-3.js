/*
* Exercício 3
    Dado que a assinatura da função readdir do módulo fs é:
        const fs = require('fs')
        const path = './'
        fs.readdir(path, (err, files) => {
        if(err){
            console.log('ocorreu um erro.')
        }else{
            console.log(files)
        }
        })
    Construa uma versão desta função promisified, ou seja, que retorne uma promise. 
    (Será possível chamá-la da seguinte forma: 
        readdirPromise(path).then((files)=> console.log(files)) )
*/

const fs = require('fs')
const path = './'

const readdirPromise = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, content) => {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}

readdirPromise(path)
    .then(files => console.log(files))
    .catch(error => console.log('ocorreu um erro.'))