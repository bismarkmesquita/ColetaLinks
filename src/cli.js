import chalk from "chalk";
import fs from 'fs';
import pegaArquivo from "./index.js";
import listaValidada from "./http-validacao.js";

const caminho = process.argv;

async function imprimiResultado(valida, resultado, identificador = '') {
    if (valida) {
        console.log(
            chalk.yellow('lista validada'), 
            chalk.black.bgGreen(identificador),
            await listaValidada(resultado)
        );
    } else {
        console.log(
            chalk.yellow('lista de links'), 
            chalk.black.bgGreen(identificador),
            resultado
        );
    }

}

async function processaArquivo(argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === '--valida';
    console.log(valida);

    try {
        fs.lstatSync(caminho);
    } catch (erro) {
        if (erro.code == 'ENOENT') {
            console.log(chalk.red('Arquivo ou diretório não encontrado.'));
            return;
        } 
    }

    if (fs.lstatSync(caminho).isFile()) {
        const resultado = await pegaArquivo(argumentos[2]);
        imprimiResultado(valida, resultado);

    } else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDoArquivo) => {
            const lista = await pegaArquivo(`${caminho}/${nomeDoArquivo}`);
            imprimiResultado(valida, lista, nomeDoArquivo);
        });
    }

}

processaArquivo(caminho);

//pegaArquivo(caminho[2]);
// pegaArquivo('./arquivos/');