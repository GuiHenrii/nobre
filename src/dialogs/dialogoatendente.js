// Declare uma variável de controle global
let dialogoAtendenteEnviado = false;

async function dialogoatendente(client, message) {
  // Verifica se o diálogo já foi enviado
  if (!dialogoAtendenteEnviado) {
    const texto =
      "Certo, vou encaminhar para o nosso setor de atendimento. Em alguns minutos vamos te atender!";
    await client
      .sendText(message.from, texto)
      .then(async () => {
        console.log("Mensagem enviada com sucesso."); // Retorna o objeto de sucesso
        await client.markUnseenMessage(message.from); // Marca a mensagem como não vista
        dialogoAtendenteEnviado = true; // Atualiza a variável de controle
      })
      .catch((error) => {
        console.error("Erro ao enviar mensagem: ", error); // Retorna o objeto de erro
        notificarAtendente(client, message); // Notifica o atendente em caso de erro
      });
  }
}


module.exports = dialogoatendente;
