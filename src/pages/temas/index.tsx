import { Link } from "waku";

export default function () {

  return (
    <section id="temas" className="m-[0_auto] p-8 w-[90%] text-center">
      <p className="mb-10 text-xl">
        En cada tema encontrará la explicación correspondiente, con ejemplos de
        este mismo sitio web, y más.
      </p>
      <ul>
        <li><Link to='/temas/Introduccion'>0-Introducción</Link></li>
        <li><Link to='/temas/PrimerosPasos'>1-Primeros Pasos</Link></li>
        {/* <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li>
        <li><Link to=''></Link></li> */}
      </ul>
    </section>
  );
}
