import Footer from "../../components/Footer";
import Header from "../../components/Header";

function userLayout({children}){
    return(
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}
export default userLayout;