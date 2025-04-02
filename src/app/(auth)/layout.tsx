interface LayoutProps{
children:React.ReactNode;
}


const Layout = ({children}:LayoutProps) => {
    return ( 
        <div className="min-h-screen justify-center items-center flex ">{children}</div>
        
     );
}
 
export default Layout;