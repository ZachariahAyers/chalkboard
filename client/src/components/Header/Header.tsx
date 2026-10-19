import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <img src={`${import.meta.env.BASE_URL}logo192.png`} alt="" />
      <h1>Chalkboard</h1>
    </header>
  );
}
