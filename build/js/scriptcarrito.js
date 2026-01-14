Promise.all([
    fetch('https://api.mockfly.dev/mocks/eb5c1152-9d57-4453-a662-bc16294e4829/get_products').then(response => response.json())
])
.then(([productosCargados]) => {
    productos = productosCargados;
})
.catch(error => {
    console.error('Error al cargar los productos o marcas:', error);
});

function cerrar(){
    document.getElementById("carrito").style.display = "none";
    document.querySelector(".carrito-filtro").style.display = "none";
    document.body.style.overflow = 'auto'; 
}

function abrir(){
    document.getElementById("carrito").style.display = "block";
    document.querySelector(".carrito-filtro").style.display = "block";
    document.body.style.overflow = 'hidden'; 
    mostrarCarrito();
}

function agregarProducto (id) {
    let talle = parseInt (document.getElementById("talle").value);
    let cantidad = parseInt (document.getElementById("cantidad").value);
    if (!talle || !cantidad) {
        mostrarMensajeError('mensajeError');

        setTimeout(() => {
            ocultarMensajeError('MensajeError');
        }, 3000);
        return
    }
    
    let producto = productos.find(prod => prod.id === id);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoSimplificado = {
        id: producto.id,
        imagen: producto.imagen,
        nombre: producto.nombre,
        precio: producto.precio,
        talle: talle,
        cantidad: cantidad
    };

    const productoExistente = carrito.find(
        item => item.id === productoSimplificado.id && item.talle === productoSimplificado.talle
    );

    if (productoExistente) {
        productoExistente.cantidad += productoSimplificado.cantidad;
    } else {
        carrito.push(productoSimplificado);
    }

    let punto = document.getElementById('punto-rojo');
    punto.style.display= 'block';
    punto.innerHTML = `<p>${carrito.length}</p>`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(idProducto, talleProducto) {
    let carrito = obtenerCarrito();
    
    carrito = carrito.filter(item => !(item.id === idProducto && item.talle == talleProducto));

    localStorage.setItem("carrito", JSON.stringify(carrito));

    
    mostrarCarrito();

    let punto = document.getElementById('punto-rojo');
    if (carrito.length === 0){
        punto.style.display= 'none';
    }else{
        punto.innerHTML = `<p>${carrito.length}</p>`;
    }
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById("productos-carrito");
    const contenedorTotal = document.getElementById("total-carrito");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        contenedorTotal.innerHTML =  `<h2 id="total">TOTAL: $0.00</h2>`;
        return;
    }

    const carritoHTML = carrito.map(item => `
        <div class="producto-carrito">
            <img class="imagen-carrito" src= ${item.imagen} alt="imagen producto">
            <div class="detalle-carrito">
                <p>${item.nombre} Talle ${item.talle}</p>
                <p class="precio">$${Number((item.precio * item.cantidad).toFixed(2)).toLocaleString('es-ES')}</p>
                <p>x ${item.cantidad}</p>
            </div>
            <svg class="delete" onclick="eliminarProducto(${item.id}, ${item.talle})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                <path d="M4 7l16 0"></path>
                <path d="M10 11l0 6"></path>
                <path d="M14 11l0 6"></path>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
            </svg>
        </div>
    `).join("");

    contenedor.innerHTML = carritoHTML;
    total = 0
    carrito.forEach(p => {
        total += p.precio * p.cantidad;
    });
    contenedorTotal.innerHTML = `<h2 id="total">TOTAL: $${Number(total.toFixed(2)).toLocaleString('es-ES')}</h2>`;
}

function mostrarMensajeError(id) {
    const mensajeError = document.getElementById(id);
    mensajeError.style.display = 'block';
}

function ocultarMensajeError(id) {
    const mensajeError = document.getElementById(id);
    mensajeError.style.display = 'none';
}

function comprar(){ 
    carrito = obtenerCarrito();

    if (carrito.length > 0 ){
        cerrar();
        localStorage.clear();
        const mensaje = document.getElementById('compra');
        mensaje.style.display = 'block';

        let punto = document.getElementById('punto-rojo');
        punto.style.display= 'none';
        
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 3000);
    }else{
        mostrarMensajeError('mensajeErrorCompra');

        setTimeout(() => {
            ocultarMensajeError('mensajeErrorCompra');
        }, 3000);
    }
}