async function dialogoinicio(client, message) {
  const texto1 = "*Prezado cliente, Neste momento estamos adptando o nosso atendimento para oferecer uma melhor experiência no nosso atendimento virtual.*\n\n\n*Informamos que não haverá atendimento dia 01/05/2024.*\n*Equipe Nobre* ❤️";
  
  const texto2 = "Olá Tudo bem? Aqui é a Bia, Atendente virtual Espetinhos Nobre.\n------------------------------------------------------\nDigite o *número* correspondente ao que você deseja:\n\n1 - Tabela de Valores\n2 - Fazer Pedido\n3 - Falar com nossas atendentes\n4 - Endereço\n5 - Encerrar a Conversa.\n\n\nDigite *0* a qualquer momento para reiniciar o seu atendimento!";

  await client
    .sendText(message.from, texto1)
    .then(async () => {
      console.log("Texto de aviso enviado com sucesso");
      await client.sendText(message.from, texto2); // Envio do texto2 após o texto1
      await client.markUnseenMessage(message.from); // Marcar mensagem como não vista
      console.log("Texto inicial enviado com sucesso");
    })
    .catch((erro) => {
      console.error("Erro ao enviar mensagem:", erro);
    });
}

module.exports = dialogoinicio;
