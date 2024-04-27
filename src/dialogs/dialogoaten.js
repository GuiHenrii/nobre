async function dialogoaten(client, message) {
  const telefoneCliente = message.from;
  const texto = `Atendimento`;
  const assunto = `Atendimento solicitado no Whatsapp principal`;
  const Adm = '556434553581@c.us';

  
  try {
    const result = await client.sendContactVcard(Adm, telefoneCliente, texto);
    await client.sendText(Adm, assunto);
    console.log("Chat marcado como não visto:", result);
    await client.markUnseenMessage(Adm); // Marca a mensagem como não vista
  } catch (error) {
    console.error("Erro ao enviar mensagem: ", error); // Retorna objeto de erro
  }
}

module.exports = dialogoaten;
