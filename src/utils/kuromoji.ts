import kuromoji, { IpadicFeatures, Tokenizer } from "kuromoji";

const builder = kuromoji.builder({
	dicPath: "node_modules/kuromoji/dict",
});

export const tokenizer = () =>
	new Promise<Tokenizer<IpadicFeatures>>((done) => {
		builder.build((_err, kTokenizer) => {
			done(kTokenizer);
		});
	});
