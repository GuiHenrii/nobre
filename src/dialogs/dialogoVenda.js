async function dialogoVenda(client, message) {
  const texto =
      "Para selecionar a tabela diga se seria *REVENDA* ou *CONSUMO*";

  await client
    .sendText(message.from, texto)
    .then(() => {
      console.log("Result: ", "result"); //return object success
    })
    .catch((erro) => {
      console.error("Erro ao enviar mensagem ", erro); //return object error
    });
}

module.exports = dialogoVenda
