const Blockchain = require('./index');
const Block = require('./block');
describe('Blockchain',()=>
{
	let bc,bc2;
	beforeEach(()=>{
		bc = new Blockchain();
		bc2=new Blockchain();
	});
	it('start should with genesis block',()=> {
		expect(bc.chain[0]).toEqual(Block.genesis());
	});
	it('new block should be added',()=>{
		const data = 'foo';
		bc.addBlock(data);
		expect(bc.chain[bc.chain.length-1].data).toEqual(data);
	});
	it('validate a valid chain',()=>{
		bc2.addBlock('foo');
		expect(bc.isValidChain(bc2.chain)).toBe(true);
	});
	it('invalidate the chain with corrupt genesis block',()=>{
		bc2.chain[0].data='Bad data';
		expect(bc.isValidChain(bc2.chain)).toBe(false);
	});
	it('invalidate a corrupt chain',()=>{
		bc2.addBlock('foo');
		bc2.chain[1].data='Not foo';
		expect(bc.isValidChain(bc2.chain)).toBe(false);
	});
	it('replacing chain with valid',()=>{
		bc2.addBlock('goo');
		bc.replaceChain(bc2.chain);
		expect(bc.chain).toEqual(bc2.chain);	
	});

	it('not replacing chain with invalid',()=>{
		bc.addBlock('foo');
		bc.replaceChain(bc2.chain);
		expect(bc.chain).not.toEqual(bc2.chain);	
	});
});