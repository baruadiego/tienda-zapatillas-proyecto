let contenedorProductos = document.getElementById("productos");
let contenedorResultados = document.getElementById("resultados");
let productosOriginales = [];
let marcasOriginales = [];

Promise.all([
    fetch('build/js/productos.json').then(response => response.json()),
    fetch('build/js/marcas.json').then(response => response.json())
])
.then(([productos, marcas]) => {
    productosOriginales = productos; 
    marcasOriginales = marcas;      
    renderizarProductos(productos, marcas);
})
.catch(error => {
    console.error('Error al cargar los productos o marcas:', error);
});



function renderizarProductos(productos, marcas) {
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const contenedorIndividual = document.createElement("div");
        contenedorIndividual.classList.add("producto");

        let logoMarca = marcas[producto.marca] || marcas.Nike;
        let contenido = `
            <a href="producto.html?id=${producto.id}" class="link-producto">
                <img src="${producto.imagen}" alt="imagen del producto">
                <div class="detalle">
                    <img src="${logoMarca}" alt="logo de la marca" class="marca">
                    <p class="nombre">${producto.nombre}</p>
                    <p class="precio">$${Number(producto.precio.toFixed(2)).toLocaleString('es-ES')}</p>
                    <p class="cuotas">${producto.cuotas} <span>cuotas de</span> $${Number((producto.precio / producto.cuotas).toFixed(2)).toLocaleString('es-ES')}</p>
        `;

        if (producto.envioGratis) {
            contenido += `<p class="envio">ENVÍO GRATIS</p>`;
        } else {
            contenido += `<p class="oculto">.</p>`;
        }

        contenido += `
                </div>
                <button>AGREGAR AL CARRITO</button>
            </a>
        `;

        contenedorIndividual.innerHTML = contenido;
        contenedorProductos.append(contenedorIndividual);
        
    });
    contenedorResultados.innerHTML = `<p>${productos.length} productos</p>`;
    if (productos.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-resultados">No se encontraron productos.</p>`;
    }
}



const desplegable = document.getElementById('desplegable');
const checkboxTodos = document.getElementById('todos');
const checkboxMarcas = document.querySelectorAll('.marca');
const checkboxTodo = document.getElementById('todo');
const checkboxGenero = document.querySelectorAll('.genero');
const buscador = document.getElementById('buscador');


desplegable.addEventListener('click', () => {
    aplicarFiltros();
});

checkboxTodos.addEventListener('change', () => {
    if (checkboxTodos.checked) {
        checkboxMarcas.forEach(checkbox => (checkbox.checked = false));
    }
    aplicarFiltros();
});


checkboxMarcas.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkboxTodos.checked = false;
        }
        aplicarFiltros();
    });
});

checkboxTodo.addEventListener('change', () => {
    if (checkboxTodo.checked) {
        checkboxGenero.forEach(checkbox => (checkbox.checked = false));
    }
    aplicarFiltros();
});

checkboxGenero.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkboxTodo.checked = false;
        }
        aplicarFiltros();
    });
});

function aplicarFiltros() {
    const marcasSeleccionadas = Array.from(checkboxMarcas)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const generosSeleccionados = Array.from(checkboxGenero)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const productosFiltrados = productosOriginales.filter(producto => {
        const cumpleMarca = 
            checkboxTodos.checked || 
            marcasSeleccionadas.includes(producto.marca);

        const cumpleGenero = 
            checkboxTodo.checked || 
            generosSeleccionados.includes(producto.genero);

        const cumpleBusqueda =  
            buscador.value === '' || 
            producto.nombre.toLowerCase().includes(buscador.value.toLowerCase());
        
        return cumpleMarca && cumpleGenero && cumpleBusqueda;
    });

    if (desplegable.value == 'descendente') {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }else if (desplegable.value == 'ascendente') {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    }

    renderizarProductos(productosFiltrados, marcasOriginales);
}

function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

function ocultarMensajeError() {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.style.display = 'none';
}