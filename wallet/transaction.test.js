const Transaction = require('./transaction');
const Wallet  = require('./index');
const {MINING_REWARD}= require('../config');
describe('Transaction',()=>{
	let transaction,wallet,recipient,amount;
	beforeEach(()=>{
		wallet = new Wallet();
		amount = 50;
		recipient= '2dfs342as';
		transaction = Transaction.newTransaction(wallet,recipient,amount);
	});

	it('gives proper consisten answer',()=>{
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount);
	});
	it('outputs the `amount` added to the recipent',()=>{
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	});

	it('inputs the balance of  the wallet',()=>{
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	it('validates a valid transaction',()=>{
		
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});
	it('invalidates a corrupts transaction ',()=>{
		transaction.outputs[0].amount=50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
	});
	describe('if amount exceeds',()=>{
beforeEach(()=>{
	amount = 50000;
	transaction= Transaction.newTransaction(wallet,recipient,amount);

});
it('does not create the transaction',()=>{
		expect(transaction).toEqual(undefined);
	});
});
	describe('updating a transaction',()=>{
		let nextAmount,nextRecipient;
		beforeEach(()=>{
			nextAmount=50;
			nextRecipient='234fsfsdfdf';
			transaction=transaction.update(wallet,nextRecipient,nextAmount);

		});
		it(`substract the next amount from the sender's output`,()=>{
			expect(transaction.outputs.find(output=>output.address===wallet.publicKey).amount).toEqual(wallet.balance-amount- nextAmount);

		});
		it('output of next recipient',()=>{
			expect(transaction.outputs.find(output=>output.address===nextRecipient).amount).toEqual(nextAmount);
		});
	});
	describe('reward',()=>{
		beforeEach(()=>{
        transaction = Transaction.rewardTransaction(wallet,Wallet.blockchainWallet());
		});
		it(`reward the miner `,()=>{
			expect(transaction.outputs.find(output => output.address===wallet.publicKey).amount).toEqual(MINING_REWARD);
		})
	})
});