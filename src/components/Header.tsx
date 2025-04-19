type Props = {
  title: string;
};
export const Header = ({ title }: Props) => (
  <header>
    <nav className="flex items-center md:flex-row w-full bg-blue-500">
      <div className="max-w-screen-md mx-auto">
        <a className="text-lg font-bold text-white" href="/">
          {title}
        </a>
      </div>
    </nav>
  </header>
);
