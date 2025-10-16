import notcartimg from "@/images/shopping cart.png";
import Link from "next/link";
const Nocart = () => {
    return (
        <div className="notlogin">
            <img src={notcartimg.src}></img>
            <div className="notlogintitle">Your Cart is empty</div>
            <div className="notloginsubtitle">There nothing in the cart. Let’s add some items.</div>
            <Link href="/" className="notloginbtn textdecoration-none" >Keep exploring</Link>

        </div>
    )
}
export default Nocart;