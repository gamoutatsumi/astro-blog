export const SideBar = () => (
	<div className="flex-shrink-0 col-md-3 mt-md-0 mt-5 card shadow-sm">
		<div className="card-body d-flex flex-column align-items-center gap-5">
			<a
				className="twitter-timeline d-inline-block"
				data-height="400"
				data-width="400"
				href="https://twitter.com/gamoutatsumi?ref_src=twsrc%5Etfw"
			>
				Tweets by gamoutatsumi
			</a>{" "}
			<script async src="https://platform.twitter.com/widgets.js" />
		</div>
	</div>
);
