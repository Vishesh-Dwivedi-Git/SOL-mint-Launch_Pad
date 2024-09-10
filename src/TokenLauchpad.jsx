import { Keypair,SystemProgram,Transaction } from "@solana/web3.js"
import { useConnection,useWallet } from "@solana/wallet-adapter-react"
import {MINT_SIZE, TOKEN_2022_PROGRAM_ID , getMintLen,createInitializeMetadataPointerInstruction,TYPE_SIZE,LENGTH_SIZE,ExtensionType, createInitializeMintInstruction, createMint , getMinimumBalanceForRentExemptMint, getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, createMintToInstruction} from "@solana/spl-token"
import {pack,createInitializeInstruction} from '@solana/spl-token-metadata';

const TokenLauchpad = () => {
    const Symbol=document.getElementById("Symbol");
    const Name=document.getElementById("Name");
    const url=document.getElementById("Image");
    const supply=document.getElementById("InSupply");
    const {connection} =useConnection();
    const wallet=useWallet();
    async function createToken(){
        const mintKeypair=Keypair.generate();
        const metadata={
            mint:mintKeypair.publicKey,
            name:Name,
            symbol:Symbol,
            uri:url,
            additionalMetadata:[],
        };

        const mintLen=getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen=TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports=await getMinimumBalanceForRentExemptMint(connect);

        const transaction= new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId:TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey,wallet,publicKey,mintKeypair.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey,9,wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId:TOKEN_2022_PROGRAM_ID,
                mint:mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name:metadata.name,
                symbol:metadata.symbol,
                uri:metadata.uri,
                mintAuthority:wallet.publicKey,
                updateAuthority:wallet.publicKey,

            }),
        );

        transaction.feePayer=wallet.publicKey;
        transaction.recentBlockhash=(await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);


        await wallet.sendTransaction(transaction,connection);
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

        const associatedToken=getAssociatedTokenAddressSync(
          mintKeypair.publicKey,
          wallet.publicKey,
          false,
          TOKEN_2022_PROGRAM_ID,

        );

        console.log(associatedToken.toBase58());

        const transaction2=new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            wallet.publicKey,
            mintKeypair.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID,
          ),
        );
        await wallet.sendTransaction(transaction2,connection);

        const transaction3=new Transaction().add(
          createMintToInstruction(mintKeypair.publicKey,associatedToken,wallet.publicKey,supply,[],TOKEN_2022_PROGRAM_ID)
        );

        await wallet.sendTransaction(transaction3,connection);
        console.log("Minted!!");
    }
  return (
    <div>
    <h1>Solana Mint Token Launch Pad</h1>
      <input type="text" id="Name" className="inputText" placeholder='Name' /><br />
      <input type="text" id="Symbol" className="inputText" placeholder='Symbol'/><br />
      <input type="text" id="Image" className="inputText" placeholder='Image Url'/><br />
      <input type="text" id="InSupply" className="inputText" placeholder='Initial Supply'/><br />
      <button onClick={createToken}>Create a Token</button>
    </div>
  )
}

export default TokenLauchpad
