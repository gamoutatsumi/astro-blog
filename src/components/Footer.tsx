type Props = {
  title: string
}
export const Footer = ({ title }: Props) => (
  <div className="bg-dark mt-5">
    <p className="text-center text-white fw-bold">{title}</p>
  </div>
)
