async function dialogoloc(client, message) {
await client
  .sendLocation(message.from, '-17.747050357651126', '-48.6300439716280054', 'Brasil')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
}
module.exports = dialogoloc;