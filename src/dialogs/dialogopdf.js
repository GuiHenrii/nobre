async function dialogoPdf(client, message) { // Corrigindo o nome do parâmetro
  try {
    await client.sendFile(
      message.from,
      "./assets/Tabela.pdf",
      "Tabela de valores",
      "Digite *0* para voltar ao menu inicial"
    );
    console.log('Arquivo enviado com sucesso!'); // Mudando a mensagem de sucesso para adequar ao contexto
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error); // Alterando a mensagem de erro para refletir o contexto
  }
}

module.exports = dialogoPdf;
