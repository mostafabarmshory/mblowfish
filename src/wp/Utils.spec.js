import {
	generateNewMessageId,
	resolveOrigin,
	matchWildcard,
} from './Utils';
window.debug = false;


describe('Utils class', () => {

	it('should generate message id', () => expect(!isNaN(generateNewMessageId())).toBe(true))

	it('should generate unique message id', () => {
		const id1 = generateNewMessageId();
		const id2 = generateNewMessageId();
		expect(id1).not.toBe(id2);
	})


	it('should resolveOrigin', () => {
		expect(typeof resolveOrigin !== 'undefined')
		const result = 'https://sometest.com'
		const a = resolveOrigin(result)
		expect(a).toEqual(result)
	})


	let wildcarDataset1 = [{
		input: 'bird123',
		output: 'bird*',
		result: true
	}, {
		input: '123bird',
		output: '*bird',
		result: true
	}, {
		input: '123bird123',
		output: '*bird*',
		result: true
	}, {
		input: 'bird123bird',
		output: 'bird*bird',
		result: true
	}, {
		input: '123bird123bird123',
		output: '*bird*bird*',
		result: true
	}, {
		input: 's[pe]c 3 re$ex 6 cha^rs',
		output: 's[pe]c*re$ex*cha^rs',
		result: true
	}, {
		input: 'should not match',
		output: 'should noo*oot match',
		result: false
	}]
	wildcarDataset1.forEach(item => {
		it(`sould support wildcard comparison the input ${item.input} pattern ${item.output} and the result ${item.result}`, () => {
			expect(matchWildcard(item.input, item.output)).toBe(item.result);
		});
	})
})