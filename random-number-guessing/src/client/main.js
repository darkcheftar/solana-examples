const {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const PROGRAM_KEYPAIR_PATH = path.join(
    path.resolve(__dirname,"../../dist/program"),
'program-keypair.json'
);

async function main(){
    console.log("Launching Client...");
    let connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    let secretKeyString =   fs.readFileSync(PROGRAM_KEYPAIR_PATH, {encoding:'utf8'}).toString().trim();
    console.log(secretKeyString)

    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const programKeypair = Keypair.fromSecretKey(secretKey);
    console.log(programKeypair)
    let programId = programKeypair.publicKey;

    const triggerKeypair = Keypair.generate();
    const airdropRequest = await connection.requestAirdrop(
        triggerKeypair.publicKey,
        LAMPORTS_PER_SOL*2,
    );
    await connection.confirmTransaction(airdropRequest);

    console.log('--Pinging: ', programId.toBase58());
    const instruction = new TransactionInstruction({
        keys:[{pubkey:triggerKeypair.publicKey, isSigner:false, isWritable:true}],
        programId,
        data: Buffer.alloc(0),
    })
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [triggerKeypair],
    );
}

main().then(
    ()=>{
        process.exit()
    },
    (err)=>{
        console.error(err);
        process.exit(-1);
    },
);