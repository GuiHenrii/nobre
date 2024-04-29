const Connect = require('@wppconnect-team/wppconnect');
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const schedule = require("node-schedule");
const conn = require("./db/conn");
const Sequelize = require("sequelize");

const dialogoinicio = require("./dialogs/dialogoinicio.js");
const dialogoPdf = require("./dialogs/dialogopdf.js");
const dialogovenda = require("./dialogs/dialogovenda");
const dialogoloc = require("./dialogs/dialogoloc.js");
const dialogoatendente = require('./dialogs/dialogoatendente.js');
const dialogoConsumo = require('./dialogs/dialogoconsumo.js');
const dialogoencerra = require('./dialogs/dialogoencerra.js');
const dialogopedido = require('./dialogs/dialogopedido.js');
const dialogonotif = require('./dialogs/dialogonotif.js');
const dialogoaten = require('./dialogs/dialogoaten.js');

const atualizaStage = require("./functions/stage.js");
const Cliente = require("./models/chat.js");

const date = new Date();

async function restartDatabase() {
  try {
    await conn.sync({ force: true });
    console.log("Banco de dados reiniciado com sucesso!");
  } catch (error) {
    console.error("Erro ao reiniciar o banco de dados:", error);
    throw error; // Lança o erro para que possa ser tratado externamente, se necessário
  }
}

// Agendamento para reiniciar o banco de dados a cada 3 horas e meia
schedule.scheduleJob('*/30 */3 * * *', async () => {
  console.log("Reiniciando o banco de dados...");
  await restartDatabase();
});

async function checkConnection(client) {
  try {
    // Verifica se o cliente está conectado
    const isConnected = await client.isConnected();

    if (isConnected) {
      console.log("Bot está conectado ao WhatsApp.");
    } else {
      console.log("Bot está desconectado do WhatsApp.");
    }

    return isConnected; // Retorna o status da conexão
  } catch (error) {
    console.error("Erro ao verificar a conexão com o WhatsApp:", error);
    return false; // Retorna falso em caso de erro
  }
}

const processedMessages = new Set();

async function start(client) {
  console.log("Cliente iniciado e conectado!");
  let isConnected = true; // Movido para fora do loop de mensagens
  
  const atendimento = {};

  client.onMessage(async (message) => {

    if (!isConnected) {
      console.log("Bot está desconectado. Não é possível processar mensagens.");
      return;
    }

    if (processedMessages.has(message.id.toString())) {
      console.log("Mensagem repetida. Ignorando...");
      return;
    }
    
    // Adicionar o ID da mensagem ao conjunto de mensagens processadas
    processedMessages.add(message.id.toString()); 

    const now = moment();
    const startHour = moment().set("hour", 8).set("minute", 10).set("second", 0); // Horário de início permitido (8:00)
    const endHour = moment().set("hour", 18).set("minute", 0).set("second", 0); // Horário de término permitido (18:00)
    
    if (!now.isBetween(startHour, endHour)) {
      console.log("Mensagem recebida fora do horário permitido.");
      return;
    }

    if (message.from === "status@broadcast") {
      console.log("Contato lista de transmissão");
      return;
    }

    const messageDate = new Date(message.timestamp * 1000);
    const data = new Date();
    const dataFormat = moment(data).format("YYYY-MM-DD");
    const datamessageFormat = moment(messageDate).format("YYYY-MM-DD");

    if (dataFormat === datamessageFormat && !message.isGroupMsg) {
      const tel = message.from.replace(/@c\.us/g, "");
      let cliente = await Cliente.findOne({
        raw: true,
        where: { telefone: tel },
      });

      if (!cliente) {
        const dados = {
          nome: message.notifyName,
          telefone: tel,
          assunto: "Pedido",
          atendido: 1,
          stage: 1,
          date: message.timestamp,
        };
        cliente = await Cliente.create(dados);
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
      
      //------------- Pergunta se é revenda ou consumo
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
      else if (message.body === "REVENDER" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoPdf(client, message);
        const dialogo = "dialogoPdf";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "REVENDA" && cliente.stage === 80) {
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
      else if (message.body === "CONSUMO" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoConsumo(client, message);
        const dialogo = "dialogoConsumo";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "CONSUMIR" && cliente.stage === 80) {
        atendimento.cliente = message.body;
        dialogoConsumo(client, message);
        const dialogo = "dialogoConsumo";
        const stage = 1;
        const id = cliente.id;
        atualizaStage(id, stage);
      }
      else if (message.body === "consumir" && cliente.stage === 80) {
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

Connect.create({
  session: "Espetinhos Nobre", // Nome da sessão
})
.then(async (client) => {
  // Verifica a conexão periodicamente
  setInterval(async () => {
    isConnected = await checkConnection(client);
  }, 60000); // Verifica a cada 1 minuto

  start(client);
})
.catch((erro) => {
  console.log(erro);
});
