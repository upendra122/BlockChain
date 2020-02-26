const Block = require('./block');
describe('Block',() => {
	let data,lastBlock,block;
	beforeEach(() => {
		data = 'bar';
		lastBlock = Block.genesis();
		block = Block.mineBlock(lastBlock,data);
	});

	it('matches the data' , () => {
		expect(block.data).toEqual(data);
	});
	it('matches the lastHash', () => {
		expect(block.lastHash).toEqual(lastBlock.hash);
	});
	it('generates the hash that mapps the difficulty',()=>{
		expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
		console.log(block.toString());
  	});
	it('lower difficulty',()=>{
expect(Block.adjustDifficulty(block,block.timestamp+36000)).toEqual(block.difficulty-1);
	});
	it('raises the difficulty',()=>{
		expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);

	});
});