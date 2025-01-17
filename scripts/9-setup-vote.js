import sdk from "./1-initialize-sdk.js";

// Esse é o nosso contrato de governança.
const vote = sdk.getVote("0xe1a72D7532Fc447265E4E570e1C8828F2431A871");

// Esse é o nosso contrato ERC-20.
const token = sdk.getToken("0x61a54DBF9ba636245D82a6EDACCF48fe613EaF2b");

(async () => {
  try {
    // Dê para a nosso tesouro o poder de cunhar tokens adicionais se necessário.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅  Módulo de votos recebeu permissão de manipular os tokens com sucesso"
    );
  } catch (error) {
    console.error(
      "falha ao dar acesso aos tokens ao módulo de votos",
      error
    );
    process.exit(1);
  }

  try {
    //Pegue o saldo de tokens da nossa carteira, lembre-se -- nós detemos basicamente o fornecimento inteiro agora!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Pegue 90% do fornecimento que nós detemos.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent80 = Number(ownedAmount) / 100 * 80;

    // Transfira 90% do fornecimento para nosso contrato de votação.
    await token.transfer(
      vote.getAddress(),
      percent80
    ); 

    console.log("✅ Transferiu " + percent80 + " tokens para o módulo de votos com sucesso");
  } catch (err) {
    console.error("falhar ao transferir tokens ao módulo de votos", err);
  }
})();