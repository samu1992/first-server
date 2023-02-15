const socket = io();
//document.getElementById('productos-template').innerHTML


socket.on('productos', (data) => {
    console.log(data);
    data.forEach(element => {
        // Crea el elemento de lista para el producto
        const productElement = document.createElement('ul');
        productElement.id = `producto-${element.id}`;
        productElement.innerHTML = `
          <li>Nombre: ${element.title}</li>
          <li>Precio: ${element.price}</li>
          <li>Stock: ${element.stock}</li>
          <li>Descripción: ${element.description}</li>
          <li>Id: ${element.id}</li>
          <li>Código: ${element.code}</li>
          <li>Código: ${element.category}</li>
        `;

        // Crea el botón de eliminación y lo agrega al elemento de lista del producto
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            eliminarProducto(element.id);
        });
        productElement.appendChild(deleteButton);

        // Agrega el elemento de lista del producto al contenedor de productos en el HTML
        document.getElementById('productos-container').appendChild(productElement);
    });

    function eliminarProducto(id) {
        socket.emit('eliminar-producto', id);
    }
});
const form = document.getElementById('nuevo-producto');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('titulo').value;
    const price = document.getElementById('precio').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const description = document.getElementById('description').value;
    const stock = document.getElementById('stock').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value;
    const producto = {
        title,
        price,
        thumbnail,
        description,
        stock,
        code,
        category
    }
    socket.emit('nuevo-producto', producto);
});
