let dialogoPedidoEnviado = false;

async function dialogopedido(client, message) {
  // Verifica se o diálogo já foi enviado
  if (!dialogoPedidoEnviado) {
    const texto =
      "Certo, vou encaminhar para o nosso setor de pedidos. Em alguns minutos vamos te atender!\n\n\n*Faça o seu pedido para adiantar o nosso atendimento.*";
    try {
      await client.sendText(message.from, texto);
      console.log("Mensagem enviada com sucesso."); // Retorna o objeto de sucesso
      await client.markUnseenMessage(message.from); // Marca a mensagem como não vista
      dialogoPedidoEnviado = true; // Atualiza a variável de controle
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error); // Retorna o objeto de erro
      notificarAtendente(client, message); // Notifica o atendente em caso de erro
    }
  }
}

module.exports = dialogopedido;
