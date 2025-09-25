function Footer(){
    return(
        <div className="bg-purple-100 p-3 flex justify-around">
            <p>&#169; Luz Pacello</p>
            <a href="https://github.com/luzpacello/repo-so-tpi1" 
            target="_blank"
            className="flex items-center space-x-1 hover:text-blue-800"
            >
            <span className="material-icons">code</span>
            Repositorio
            </a>
        </div>
    )
}
export default Footer