import { parse, fromat } from './mbFileSizeParser';




describe('File Size Parse', function() {
	var testdata = [{
		input: "1",
		output: 1,
	}, {
		input: "1Byte",
		output: 1,
	}, {
		input: "1 Byte",
		output: 1,
	}, {
		input: "1 bYtE",
		output: 1,
	}, {
		input: "1 KB",
		output: 1 * 1024,
	}, {
		input: "1.5KB",
		output: 1536,
	}, {
		input: "1.26MB", // Flor result in bytes
		output: 1321205,
	}, {
		input: "1.26xB",
		output: undefined,
	}, {
		input: undefined,
		output: undefined,
	}, {
		input: null,
		output: undefined,
	}, {
		input: false,
		output: undefined,
	}, {
		input: 123,
		output: 123,
	}];

	testdata.forEach(item =>
		it("should be able to pars string " + item.input + " to value " + item.output, function() {
			expect(parse(item.input)).toBe(item.output);
		})
	)
});




describe('File Size formater', function() {
	var testdata = [{
		input: 1,
		output: '1 Byte',
	}, {
		input: 1024,
		output: '1 KB',
	}, {
		input: 2048,
		output: "2 KB",
	}, {
		input: "1.26xB",
		output: undefined,
	}, {
		input: undefined,
		output: undefined,
	}, {
		input: null,
		output: undefined,
	}, {
		input: -1,
		output: undefined,
	}];

	testdata.forEach(item =>
		it("should be able to pars string " + item.input + " to value " + item.output, function() {
			expect(parse(item.input)).toBe(item.output);
		})
	)
});