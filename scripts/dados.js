function dados(regiao = "global", tipo = "daily") {
    return new Promise(function (resolve, reject) {
        var requisicao = new XMLHttpRequest();
        requisicao.open("GET", "https://cors-anywhere.herokuapp.com/https://spotifycharts.com/regional/" + regiao + "/" + tipo + "/latest/download", true);
        requisicao.send(null);
        requisicao.onreadystatechange = function () {
            if (requisicao.readyState === 4 && requisicao.status === 200) {
                var tipoConteudo = requisicao.getResponseHeader('Content-Type');
                if (tipoConteudo.indexOf("text") !== 1) {
                    var dados = Papa.parse(requisicao.responseText, { header: true });
                    dadosConvertidos = converte(dados);
                    resolve(dadosConvertidos);
                } else {
                    reject(requisicao.status);
                }
            }
        }
    });
}

function converte(dadosy) {
    var linhas = dadosy['data'];

    var saidaCsv = "";
    saidaCsv += "size,path,position,url";
    saidaCsv += "\n,Spotify,,";

    var artistas = new Set();

    linhas.forEach(function (linha) {
        if (linha.Artist !== undefined)
            artistas.add(linha.Artist.replace("/", "-"));
    });

    for (let artista of artistas) {
        saidaCsv += "\n,\"Spotify/" + artista + "\",,";
    }

    linhas.forEach(function (linha) {
        if (linha.Artist !== undefined)
            saidaCsv += "\n" + linha.Streams + ",\"Spotify/" + linha.Artist.replace("/", "-") + "/" + linha["Track Name"].replace("/", "-") + "\"," + linha.Position + "," + linha.URL;
    });

    return saidaCsv;
}

// Baseado em https://html-online.com/articles/get-url-parameters-javascript/
function obtemParamUrl() {
    var param = {};
    var partes = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, chave, valor) {
        param[chave] = valor;
    });
    return param;
}