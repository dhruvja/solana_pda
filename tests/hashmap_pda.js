const anchor = require('@project-serum/anchor')
const {SystemProgram} = anchor.web3;


const PublicKey = require('@solana/web3.js').PublicKey

const assert = require('assert')

const account1 = anchor.web3.Keypair.generate() // initialization
const account2 = anchor.web3.Keypair.generate()

describe("hashmap_pda", () => {
  // Configure the client to use the local cluster.
  var provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HashmapPda;

  it("Is initialized!", async () => {
    // Add your test here.

    console.log(provider.wallet.publicKey)
    console.log(account1.publicKey)

    const [userStatsPDA, _] = await PublicKey
    .findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        account1.publicKey.toBuffer()
      ],
      program.programId
    );


    const [secondPDA, x] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("user_stats"),
        account2.publicKey.toBuffer()
      ],
      program.programId
    )


    // const tx = await program.methods
    // .initialize("brian")
    // .accounts({
    //   user: provider.wallet.publicKey,
    //   userStats: userStatsPDA,
    // })
    // .rpc();

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        account1.publicKey,
        10000000000
      ),
      "confirmed"
    );

    const userBalance = await provider.connection.getBalance(account1.publicKey);
    console.log(userBalance)

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        account2.publicKey,
        10000000000
      ),
      "confirmed"
    );

    const secondUserBalance = await provider.connection.getBalance(account2.publicKey);
    console.log(secondUserBalance)

    const tx = await program.rpc.initialize({
      accounts: {
        user: account1.publicKey,
        userStats: userStatsPDA,
        systemProgram: SystemProgram.programId
      },
      signers: [account1]
    });

    console.log("Your transaction signature", tx);

    await program.rpc.addName("brian", {
      accounts: {
        user: account1.publicKey,
        userStats: userStatsPDA
      },
      signers: [account1]
    })

    let vals = await program.account.game.fetch(userStatsPDA);
    console.log(vals.name)

    const second_tx = await program.rpc.changeName("dhruv", {
      accounts: {
        user: account1.publicKey,
        userStats: userStatsPDA
      },
      signers: [account1]
    })

    vals = await program.account.game.fetch(userStatsPDA);
    console.log(vals.name)

    await program.rpc.addName("yo", {
      accounts: {
        user: account2.publicKey,
        userStats: secondPDA
      },
      signers: [account2]
    })

    vals = await program.account.game.fetch(secondPDA);
    console.log(vals.name)

    await program.rpc.changeName("bro", {
      accounts: {
        user: account2.publicKey,
        userStats: secondPDA
      },
      signers: [account2]
    })

    vals = await program.account.game.fetch(secondPDA);
    console.log(vals.name)



  });
});
