buscador.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        console.log("enter");
        buscar();
    }
});
function buscar () {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'index.html') {
        window.location.href = 'index.html';
    }
    
    aplicarFiltros();
}

function cargarInicio(){
    window.location.href = 'index.html';
}