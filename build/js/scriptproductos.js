let contenedorProducto = document.getElementById("producto");
const urlParams = new URLSearchParams(window.location.search);
const productoId = parseInt(urlParams.get('id'));

Promise.all([
    fetch('https://api.mockfly.dev/mocks/eb5c1152-9d57-4453-a662-bc16294e4829/get_products').then(response => response.json()),
    fetch('build/js/marcas.json').then(response => response.json())
])
.then(([productos, marcas]) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
            let logoMarca = marcas[producto.marca]
            let contenido = `
                <div class = "detalle-producto">
                    <img class="imagen-producto" src="${producto.imagen}" alt="imagen del producto">
                    <div class="informacion">
                        <img src="${logoMarca}" alt="marca" class="marca-producto">
                        <p class="nombre-producto">${producto.nombre}</p>
                        <p class="precio-producto">$${Number(producto.precio.toFixed(2)).toLocaleString('es-ES')}</p>
                        <p class="cuotas-producto">${producto.cuotas} cuotas de <span>$${Number((producto.precio / 6).toFixed(2)).toLocaleString('es-ES')}</span></p>
                        <p id="mensajeError">* Seleccione talle y cantidad para agregar el producto</p>
                        <div class="seleccionable">
                            <select id="talle" name="desplegable">
                                <option value="" disabled selected>Seleccionar talle</option>
                                <option value="36">36</option>
                                <option value="37">37</option>
                                <option value="38">38</option>
                                <option value="39">39</option>
                                <option value="40">40</option>
                                <option value="41">41</option>
                                <option value="42">42</option>
                                <option value="43">43</option>
                                <option value="44">44</option>
                            </select>
                            <input id="cantidad" type="number" placeholder="Cantidad" min="1" max="10">
                        </div>
                        <button onclick="agregarProducto(${producto.id})">AGREGAR AL CARRITO</button>
                    </div>
            
                </div>
            `;
            
            contenedorProducto.innerHTML = contenido;
        };
})
.catch(error => {
    console.error('Error al cargar los productos o marcas:', error);
});