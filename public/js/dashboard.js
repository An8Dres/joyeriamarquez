const createForm = document.querySelector("#create-product-form");
const editForm = document.querySelector("#edit-product-form");
const deleteForm = document.querySelector("#delete-product-form");

const createMessage = document.querySelector("#create-message");
const editMessage = document.querySelector("#edit-message");
const deleteMessage = document.querySelector("#delete-message");


const no = ['.', ',', 'e', 'E', '+', '-']

document.onkeydown = e => {
    if (e.target.type === "number" && no.includes(e.key)) {
        e.preventDefault()
    }
}

//UTILIDADES
function showMessage(element, message, type = "") {
    element.textContent = message
    element.className = "message"
    if (type) element.classList.add(type)
}

async function getResponseData(response) {
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
        return await response.json()
    }

    return await response.text()
}

//CREAR PRODUCTO
createForm.addEventListener("submit", async e => {
    e.preventDefault()

    showMessage(createMessage, "Creando producto...");

    const formData = new FormData(createForm)

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const data = await getResponseData(response)

        if (!response.ok) {
            throw new Error(
                typeof data === "object"
                    ? data.message || "No se pudo crear el producto."
                    : data
            )
        }

        showMessage(
            createMessage,
            data.message || "Producto creado correctamente.",
            "success"
        );

        createForm.reset()
    } catch (error) {
        console.error(error)

        showMessage(
            createMessage,
            error.message || "Ocurrió un error.",
            "error"
        )
    }
})

//EDITAR PRODUCTO
editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showMessage(editMessage, "Guardando cambios...");


    const id = document.querySelector("#edit-id").value;


    if (!id) {

        showMessage(
            editMessage,
            "Debes introducir un ID.",
            "error"
        );

        return;
    }


    /*
        Solo enviamos los campos que realmente
        fueron rellenados.
    */

    const formData = new FormData(editForm);


    const body = {
        titulo: formData.get("titulo"),
        info: formData.get("info"),
        precio: formData.get("precio"),
        stock: formData.get("stock")
    };


    /*
        Eliminamos campos vacíos para que el backend
        pueda interpretar que no deben modificarse.
    */

    for (const key of Object.keys(body)) {

        if (body[key] === "" || body[key] === null) {
            delete body[key];
        }

    }


    try {
        const response = await fetch(`/api/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const data = await getResponseData(response);

        if (!response.ok) {

            throw new Error(
                typeof data === "object"
                    ? data.message || "No se pudo editar el producto."
                    : data
            );

        }

        showMessage(
            editMessage,
            data.message || "Producto actualizado correctamente.",
            "success"
        );


    } catch (error) {
        console.error(error);

        showMessage(
            editMessage,
            error.message || "Ocurrió un error.",
            "error"
        );
    }
})

//ELIMINAR PRODUCTO
deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const id = document.querySelector("#delete-id").value

    if (!id) {
        showMessage(
            deleteMessage,
            "Debes introducir un ID.",
            "error"
        );

        return;
    }

    const confirmed = confirm(
        `¿Seguro que deseas eliminar el producto con ID ${id}?`
    );

    if (!confirmed) {
        return;
    }

    showMessage(
        deleteMessage,
        "Eliminando producto..."
    );

    try {
        const response = await fetch(`/api/${id}`, { method: "DELETE" }
        );

        const data = await getResponseData(response);

        if (!response.ok) {

            throw new Error(
                typeof data === "object"
                    ? data.message || "No se pudo eliminar el producto."
                    : data
            );

        }


        showMessage(
            deleteMessage,
            data.message || "Producto eliminado correctamente.",
            "success"
        );


        deleteForm.reset();


    } catch (error) {

        console.error(error);


        showMessage(
            deleteMessage,
            error.message || "Ocurrió un error.",
            "error"
        );

    }

})