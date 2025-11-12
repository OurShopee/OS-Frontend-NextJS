import notcartimg from "@/images/shopping cart.png";
import Link from "next/link";
import { useContent } from "@/hooks";
const Nocart = () => {
    const emptyDescription = useContent("cart.emptyDescription");
    const emptySubDescription = useContent("cart.emptySubDescription");
    const keepExploring = useContent("cart.keepExploring");
    
    return (
        <div className="notlogin">
            <img src={notcartimg.src}></img>
            <div className="notlogintitle">{emptyDescription}</div>
            <div className="notloginsubtitle">{emptySubDescription}</div>
            <Link href="/" className="notloginbtn textdecoration-none" >{keepExploring}</Link>

        </div>
    )
}
export default Nocart;