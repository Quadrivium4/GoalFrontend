import { IoStatsChartOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import BottomNavLink from './BottomNavLink';
import { Link } from "react-router-dom";
import styles from "./Header.module.css"
const Header = () =>{
    return (
      
    <div id="header" className={styles.header}>
        <h1 className="logo">G<span>o</span>al</h1>
        <div className={styles.navLinks}>
        <Link to={"/"}>goals</Link>
        <Link to={"/stats"}>stats</Link>
        <Link to={"/settings"}>settings</Link>
        <Link to={"/friends"}>friends</Link>
        </div>
      </div>
    )
}
export default Header