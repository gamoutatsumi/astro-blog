type Props = {
	title: string;
};
export const Header = ({ title }: Props) => (
	<header>
		<nav className="navbar navbar-extend-md navbar-light container-fluid bg-primary">
			<div className="container-md">
				<a className="navbar-brand text-white fw-bold" href="/">
					{title}
				</a>
			</div>
		</nav>
	</header>
);
