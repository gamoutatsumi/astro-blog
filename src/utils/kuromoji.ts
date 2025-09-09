import {
	type IpadicFeatures,
	builder as kuromojiBuilder,
	type Tokenizer,
} from "kuromoji";

const builder = kuromojiBuilder({
	dicPath: "node_modules/kuromoji/dict",
});

export const tokenizer = () =>
	new Promise<Tokenizer<IpadicFeatures>>((done) => {
		builder.build((_err, kTokenizer) => {
			done(kTokenizer);
		});
	});
