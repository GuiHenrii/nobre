async function dialogoaten(client, messagem) {
   
    const telefoneCliente = messagem.from
    const texto = `Atendimento`
    const assunto = `Atendimento solicitado no Whatsapp principal`
    const Adm = '556434553581@c.us'
    
  
    await client
    .sendContactVcard(Adm, telefoneCliente, texto)
    .then(async (result) => {
      await client.markUnseenMessage
      .sendText(Adm, assunto 
        )
      .then(async () => {
        await client
        .sendText(messagem.from, "Atendimento confirmado" 
          )
        .then(async () => {
        
            console.log('Chat marcado como não visto:', result);
          })
        .catch((erro) => {
          console.error('Erro ao enviar mensagem ', erro); //return object error
        });    
          console.log('Chat marcado como não visto:', result);
        })
      .catch((erro) => {
        console.error('Erro ao enviar mensagem ', erro); //return object error
      });
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro); //return object error
    });
  
  }
  
  module.exports = dialogoaten