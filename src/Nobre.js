
// Funcionais
// const Venom = require("venom-bot");
const Connect = require('@wppconnect-team/wppconnect');
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const schedule = require("node-schedule");
const conn = require("./db/conn");
const Sequelize = require("sequelize");

// Dialogos
const dialogoinicio = require("./dialogs/dialogoinicio.js")
const dialogoPdf = require("./dialogs/dialogopdf.js")
const dialogovenda = require("./dialogs/dialogovenda")
const dialogoloc = require("./dialogs/dialogoloc.js")
const dialogoatendente = require('./dialogs/dialogoatendente.js');
const dialogoConsumo = require('./dialogs/dialogoconsumo.js');
const dialogoencerra = require('./dialogs/dialogoencerra.js');
const dialogopedido = require('./dialogs/dialogopedido.js')
const dialogonotif = require('./dialogs/dialogonotif.js')
const dialogoaten = require('./dialogs/dialogoaten.js')
//functions
const atualizaStage = require("./functions/stage.js");

// Models
const Cliente = require("./models/chat.js");



const date = new Date();

async function restartDatabase() {
  try {
    // Lógica para reiniciar o banco de dados
    await conn.sync({ force: true }); // Isso irá recriar todas as tabelas do banco de dados

    console.log("Banco de dados reiniciado com sucesso!");
  } catch (error) {
    console.error("Erro ao reiniciar o banco de dados:", error);
  }
}

// Agendar o reinício do banco de dados a cada 1 minuto
setInterval(async () => {
  await restartDatabase(); // Chama a função para reiniciar o banco de dados
}, 3 * 60 * 60 * 1000); // O banco reinicia a cada 3 horas


function start(client) {
  console.log("Cliente iniciado e conectado!");
  // Inicio atendimento
  const atendimento = {};


  client.onMessage(async (message) => {
    if (message.from === "status@broadcast") {
      console.log("contato lista de transmissão");
      return;
    }
    const messageDate = new Date(message.timestamp * 1000);
    const data = new Date();
    const dataFormat = moment(data).format("YYYY-MM-DD");
    const datamessageFormat = moment(messageDate).format("YYYY-MM-DD");
    if (dataFormat === datamessageFormat && message.isGroupMsg === false) {
      // Se não é de grupo(false) executa o codigo e compara a data
      // Pesquisa e deixa o cliente pronto para os update
      const tel = message.from.replace(/@c\.us/g, "");
      const cliente = await Cliente.findOne({
        raw: true,
        where: { telefone: tel },
      });
      console.dir(cliente);

      // Entra nesse if caso o cliente não exista no banco de dados
      if (!cliente) {
        const dados = {
          nome: message.notifyName,
          telefone: tel,
          assunto: "Pedido",
          atendido: 1,
          stage: 1,
          date: message.timestamp, //Verificar se ele trás a hora
        };
        const cliente = await Cliente.create(dados);
        dialogoinicio(client, message);
        const id = cliente.id;
        const dialogo = "dialogoinicio";
        const stage = 2;
        const date = message.timestamp;
        atualizaStage(id, stage, date);
      }
      //  ---------- Inicio da conversa
      else if (message.body && cliente.stage === 1) {
        dialogoinicio(client, message);
        const id = cliente.id;
        const dialogo = "dialogoinicio";
        const stage = 2;
        const date = message.timestamp;
        atualizaStage(id, stage, date);
      }
    
      //------------- Pergunta se e revenda ou consumo
      else if (message.body === "1" && cliente.stage === 2) {
        atendimento.cliente = message.body;
        dialogovenda(client, message);
        const id = cliente.id;
        const dialogo = "dialogoVenda";
        const stage = 80;
        const date = message.timestamp;
        atualizaStage(id, stage, date);}

      //  -------------------- Envia a tabela de revenda
      else if (message.body === "Revenda" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoPdf(client, message);
        const dialogo = "dialogoPdf";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "revenda" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoPdf(client, message);
        const dialogo = "dialogoPdf";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "revender" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoPdf(client, message);
        const dialogo = "dialogoPdf";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "Revender" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoPdf(client, message);
        const dialogo = "dialogoPdf";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      //-----------------------------------------------------

      //---------------------- Envia a tabela de consumo
      else if (message.body === "Consumo" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoConsumo(client, message);
        const dialogo = "dialogoConsumo";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "consumo" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoConsumo(client, message);
        const dialogo = "dialogoConsumo";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      //--------------------------------------
      
      //  -------------------- Faz o pedido
      else if (message.body === "2" && cliente.stage === 2) {
          atendimento.cliente = message.body;
          dialogopedido(client, message);
          const id = cliente.id;
          const dialogo = "dialogopedido";
          const stage = 60000;
          const date = message.timestamp;
          atualizaStage(id, stage, date);
      }
      else if (message.body  && cliente.stage === 60000) {
        atendimento.cliente = message.body;
        dialogonotif(client, message);
        const id = cliente.id;
        const dialogo = "dialogonotif";
        const stage = 6000000;
        const date = message.timestamp;
        atualizaStage(id, stage, date);
    }
      //  -------------------- Fala com atendente
      else if (message.body === "3" && cliente.stage === 2) {
        atendimento.cliente = message.body;
        dialogoatendente(client, message);
        const id = cliente.id;
        const dialogo = "dialogoatendente";
        const stage = 600000
        const date = message.timestamp;
        atualizaStage(id, stage, date);
    }
    else if (message.body  && cliente.stage === 600000) {
      atendimento.cliente = message.body;
      dialogoaten(client, message);
      const id = cliente.id;
      const dialogo = "dialogonotif";
      const stage = 6000000
      const date = message.timestamp;
      atualizaStage(id, stage, date);
 }
    else if (message.body === "4" && cliente.stage === 2) {
      atendimento.cliente = message.body;
      dialogoloc(client, message);
      const id = cliente.id;
      const dialogo = "dialogoloc";
      const stage = 1;
      const date = message.timestamp;
      atualizaStage(id, stage, date);
  }
    else if (message.body === "5" && cliente.stage === 2) {
    atendimento.cliente = message.body;
    dialogoencerra(client, message);
    const id = cliente.id;
    const dialogo = "dialogoencerra";
    const stage = 1;
    const date = message.timestamp;
    atualizaStage(id, stage, date);
}
      }
  });
}

Connect
  .create({
    session: "Espetinhos Nobre", //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });


conn
  .sync()
  .then(() => {})
  .catch((err) => console.log(err));



  // 20/04/2024 Gui