const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const {INITIAL_BALANCE}= require('../config');
describe('wallet',()=> {
	let wallet,tp,bc;
	beforeEach(()=>{
		wallet = new Wallet();
		tp=new TransactionPool();
		bc= new Blockchain();
	});
	describe('creating a transaction',()=>{

		let transaction,sendAmount , recipient;
		beforeEach(()=>{
			sendAmount = 50;
			recipient = 'upen123@213';
			transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
		});
		describe('creating the same transaction',()=>{
		beforeEach(()=>{
			wallet.createTransaction(recipient,sendAmount,bc,tp);
		});
		it('doubles the `sendAmount` subtracted from the wallet balance',()=>{
			expect(transaction.outputs.find(output => output.address===wallet.publicKey).amount).toEqual(wallet.balance- sendAmount*2);
		});
		it('clones the `sendAmount` output for the recipient',()=>{
			expect(transaction.outputs.filter(output=>output.address===recipient).map(output=>output.amount)).toEqual([sendAmount,sendAmount]);
		});
	});

	});
	describe('calculate balance',()=>{
		let addBalance,repeatAdd,senderWallet;
		beforeEach(() =>{
			senderWallet = new Wallet();
			addBalance = 100;
			repeatAdd = 3;
			for(let i=0;i<repeatAdd;i++)
			{
				senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);

			}
			bc.addBlock(tp.transactions);

		});
		it('calculate the bal for transaction matcinng the recipent',()=>{
			expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
		});
		it('calculate mathcing sender',()=>{
			expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance* repeatAdd));

		});
		describe('recipient conduct transactions',()=>{
		let subtractBalance,recipientBalance;
		beforeEach(()=>{
			tp.clear();
			subtractBalance = 60;
			recipientBalance = wallet.calculateBalance(bc);
			wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
			bc.addBlock(tp.transactions);

		});
		describe('sender sends another transaction',()=>{
			beforeEach(()=>{
				tp.clear();
				senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
				bc.addBlock(tp.transactions);
			});
			it('calculate recipient balance',()=>{
				expect(wallet.calculateBalance(bc)).toEqual(recipientBalance- subtractBalance+addBalance);
			})
		});
	});
	});
	

});