const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');
describe('TransactionPool',()=>{
let tp,wallet,transaction,bc;
beforeEach(()=>{
	tp=new TransactionPool;
	wallet=new Wallet;
	bc= new Blockchain();
	transaction =wallet.createTransaction('adf2423432',43,bc,tp);
});
it('it adds a transaction to the pool',()=>{
	expect(tp.transactions.find(t=>t.id===transaction.id)).toEqual(transaction);
});
it('it updates a transaction in th pool',()=>{
	const oldTransaction=JSON.stringify(transaction);
	const newTransaction=transaction.update(wallet,'dsfssdfsd',322);
	tp.updateOrAddTransaction(newTransaction);
	expect(JSON.stringify(tp.transactions.find(t=>t.id===newTransaction.id))).not.toEqual(oldTransaction);
});
it('clear',()=>{
tp.clear();
expect(tp.transactions).toEqual([]);
});

describe('mix ',()=>{
	let validTransactions;
	beforeEach(()=>{
		validTransactions = [...tp.transactions];
		for(let i=0;i<6;i++)
		{
			wallet = new Wallet();
			transaction = wallet.createTransaction('adf2423432',43,bc,tp);
			if(i%2==0)
			{
				transaction.input.amount =9999;
			}	
			else
			{
				validTransactions.push(transaction);
			}
		}
	});
	it('show a diff',()=>{
		expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
	});
	it('grab',()=>{
		expect(tp.validTransactions()).toEqual(validTransactions);
	});
});
});