// Espera a que se cargue el DOM antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    fetchData() // Llama a la función fetchData al cargar el DOM
})

// Función para obtener datos de un archivo JSON (simulado)
const fetchData = async () => {
    try {
        const res = await fetch('api.json') // Realiza una petición para obtener datos simulados
        const data = await res.json() // Convierte la respuesta a JSON
        pintarProductos(data) // Llama a la función para mostrar los productos en la página
        detectarBotones(data) // Agrega detección de clics a los botones de compra
    } catch (error) {
        console.log(error) // Maneja errores en la obtención de datos
    }
}

// Obtiene el contenedor de productos del DOM
const contendorProductos = document.querySelector('#contenedor-productos')

// Función para mostrar productos en el contenedor
const pintarProductos = (data) => {
    // Obtiene el template de producto del DOM
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()

    // Itera sobre los datos para mostrar cada producto
    data.forEach(producto => {
        // Configura la información del producto en el template
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone) // Agrega el producto al fragmento
    })
    contendorProductos.appendChild(fragment) // Agrega todos los productos al contenedor
}

// Objeto que representa el carrito de compras
let carrito = {}

// Función para detectar clics en botones de compra
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // Obtiene el producto seleccionado y lo agrega al carrito
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1 // Configura la cantidad inicial del producto
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }
            pintarCarrito() // Actualiza la visualización del carrito
        })
    })
}

// Función para mostrar los elementos del carrito
const items = document.querySelector('#items')
const pintarCarrito = () => {
    items.innerHTML = '' // Limpia los elementos del carrito antes de actualizar

    // Obtiene el template de elemento del carrito del DOM
    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    // Itera sobre los elementos del carrito y los muestra en la página
    Object.values(carrito).forEach(producto => {
        // Configura la información del producto en el template del carrito
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        // Configura los botones para cada producto en el carrito
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone) // Agrega el producto al fragmento
    })

    items.appendChild(fragment) // Agrega todos los productos al carrito

    pintarFooter() // Actualiza la visualización del footer del carrito
    accionBotones() // Agrega acciones a los botones del carrito
}

// Obtiene el footer del carrito del DOM
const footer = document.querySelector('#footer-carrito')

// Función para mostrar el footer del carrito
const pintarFooter = () => {
    footer.innerHTML = '' // Limpia el footer antes de actualizar

    // Verifica si el carrito está vacío y muestra un mensaje correspondiente
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío con innerHTML</th>`
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // Calcula la cantidad total de productos y su precio total en el carrito
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    // Configura la cantidad y el precio total en el footer del carrito
    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment) // Agrega el footer actualizado al DOM

    // Agrega la funcionalidad de vaciar el carrito al botón correspondiente
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {} // Vacía el carrito
        pintarCarrito() // Actualiza la visualización del carrito
    })
}

// Función para agregar acciones a los botones de incrementar y decrementar productos en el carrito
const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito() // Actualiza la visualización del carrito
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito() // Actualiza la visualización del carrito
        })
    })
}
