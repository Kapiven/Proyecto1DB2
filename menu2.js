const readline = require("readline")

const API = "http://localhost:5000/api"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function menu() {

    console.log("\n====== SISTEMA RESTAURANTES ======")

    console.log("\n--- CREAR DOCUMENTOS ---")
    console.log("1 Crear restaurante")
    console.log("2 Crear usuario")
    console.log("3 Crear menu item")
    console.log("4 Crear orden")
    console.log("5 Crear reseña")

    console.log("\n--- CONSULTAS ---")
    console.log("6 Ver restaurantes")
    console.log("7 Buscar restaurantes por cocina")
    console.log("8 Ver usuarios")
    console.log("9 Ver ordenes de usuario")

    console.log("\n--- AGREGACIONES ---")
    console.log("10 Estadisticas restaurante")
    console.log("11 Top restaurantes")

    console.log("\n--- ACTUALIZACIONES ---")
    console.log("12 Actualizar estado orden")
    console.log("13 Actualizar precios por categoria")

    console.log("\n--- ELIMINACION ---")
    console.log("14 Eliminar reseña")
    console.log("15 Eliminar ordenes canceladas")

    console.log("\n--- CONSULTAS EXTRA ---")
    console.log("16 Contar restaurantes")
    console.log("17 Cocinas distintas")

    console.log("\n0 Salir\n")

    rl.question("Seleccione una opcion: ", ejecutar)

}

async function ejecutar(op) {

    try {

        switch (op) {

            case "1":

                rl.question("Nombre restaurante: ", name => {
                    rl.question("Tipo cocina: ", cuisine => {
                        rl.question("Building: ", building => {
                            rl.question("Street: ", street => {
                                rl.question("Zipcode: ", zipcode => {
                                    rl.question("Borough: ", borough => {
                                        rl.question("Coord longitud: ", lon => {
                                            rl.question("Coord latitud: ", async lat => {

                                                const res = await fetch(`${API}/restaurantes`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        name,
                                                        restaurant_id: Date.now().toString(),
                                                        cuisine,
                                                        address: {
                                                            building,
                                                            street,
                                                            zipcode,
                                                            borough,
                                                            coord: [Number(lon), Number(lat)]
                                                        }
                                                    })
                                                })

                                                console.log(await res.json())
                                                menu()

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                })

                return

            case "2":

                rl.question("Nombre: ", nombre => {
                    rl.question("Email: ", email => {
                        rl.question("Telefono: ", telefono => {
                            rl.question("Building: ", building => {
                                rl.question("Street: ", street => {
                                    rl.question("Zipcode: ", zipcode => {
                                        rl.question("Borough (Manhattan/Brooklyn/Queens/Bronx/Staten Island): ", borough => {
                                            rl.question("¿Desea ingresar coordenadas? (s/n): ", wantsCoords => {
                                                if ((wantsCoords || '').toLowerCase() === 's') {
                                                    rl.question("Coord longitud: ", lon => {
                                                        rl.question("Coord latitud: ", async lat => {

                                                            const res = await fetch(`${API}/usuarios/registro`, {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({
                                                                    nombre,
                                                                    email,
                                                                    telefono,
                                                                    passwordHash: "123456",
                                                                    address: {
                                                                        building,
                                                                        street,
                                                                        zipcode,
                                                                        borough,
                                                                        coord: [Number(lon), Number(lat)]
                                                                    }
                                                                })
                                                            })

                                                            console.log(await res.json())
                                                            menu()

                                                        })
                                                    })
                                                } else {
                                                    (async () => {
                                                        const res = await fetch(`${API}/usuarios/registro`, {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                nombre,
                                                                email,
                                                                telefono,
                                                                passwordHash: "123456",
                                                                address: {
                                                                    building,
                                                                    street,
                                                                    zipcode,
                                                                    borough
                                                                }
                                                            })
                                                        })

                                                        console.log(await res.json())
                                                        menu()
                                                    })()
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                return

            case "3":

                rl.question("Nombre item: ", nombre => {
                    rl.question("Precio: ", precio => {
                        rl.question("Categoria: ", categoria => {
                            rl.question("Restaurante ID: ", async restauranteId => {
                                rl.question("Descripcion: ", async descripcion => {

                                    const res = await fetch(`${API}/menu-items`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            nombre,
                                            precio: Number(precio),
                                            categoria,
                                            restauranteId,
                                            descripcion
                                        })
                                    })

                                    console.log(await res.json())
                                    menu()

                                })

                            })
                        })
                    })
                })

                return

            case "4":

                rl.question("Usuario ID: ", usuarioId => {
                    rl.question("Restaurante ID: ", restauranteId => {
                        rl.question("Menu Item ID: ", menuItemId => {
                            rl.question("Nombre del item: ", nombre => {
                                rl.question("Precio unitario: ", precio => {
                                    rl.question("Cantidad: ", cantidad => {

                                        const subtotal = Number(precio) * Number(cantidad)
                                        const total = subtotal

                                        rl.question("Building: ", building => {
                                            rl.question("Street: ", street => {
                                                rl.question("Zipcode: ", zipcode => {
                                                    rl.question("Borough (Manhattan/Brooklyn/Queens/Bronx/Staten Island): ", async borough => {

                                                        const res = await fetch(`${API}/ordenes`, {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({

                                                                usuarioId,
                                                                restauranteId,

                                                                items: [
                                                                    {
                                                                        menuItemId,
                                                                        nombre,
                                                                        precioUnitario: Number(precio),
                                                                        cantidad: Number(cantidad),
                                                                        subtotal
                                                                    }
                                                                ],

                                                                total,

                                                                direccionEntrega: {
                                                                    building,
                                                                    street,
                                                                    zipcode,
                                                                    borough
                                                                }

                                                            })
                                                        })

                                                        console.log(await res.json())
                                                        menu()

                                                    })
                                                })
                                            })
                                        })

                                    })
                                })
                            })
                        })
                    })
                })

                return

            case "5":

                rl.question("Usuario ID: ", usuarioId => {
                    rl.question("Restaurante ID: ", restauranteId => {
                        rl.question("Orden ID: ", ordenId => {
                            rl.question("Rating (1-5): ", rating => {
                                rl.question("Comentario: ", async comentario => {

                                    const res = await fetch(`${API}/resenas`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            usuarioId,
                                            restauranteId,
                                            ordenId,
                                            rating: Number(rating),
                                            comentario
                                        })
                                    })

                                    console.log(await res.json())
                                    menu()

                                })
                            })
                        })
                    })
                })

                return

            case "6":

                const restaurantes = await fetch(`${API}/restaurantes`)
                console.log(await restaurantes.json())
                break

            case "7":

                rl.question("Cocina: ", async cocina => {

                    const res = await fetch(`${API}/restaurantes/cuisine/${cocina}`)
                    console.log(await res.json())
                    menu()

                })

                return

            case "8":

                const usuarios = await fetch(`${API}/usuarios`)
                console.log(await usuarios.json())
                break

            case "9":

                rl.question("Usuario ID: ", async id => {

                    const res = await fetch(`${API}/ordenes/usuario/${id}`)
                    console.log(await res.json())
                    menu()

                })

                return

            case "10":

                rl.question("Restaurante ID: ", async id => {

                    const res = await fetch(`${API}/resenas/restaurante/${id}/estadisticas`)
                    console.log(await res.json())
                    menu()

                })

                return

            case "11":

                const top = await fetch(`${API}/resenas/top/restaurantes`)
                console.log(await top.json())
                break

            case "12":

                rl.question("Orden ID: ", id => {
                    rl.question("Nuevo estado: ", async estado => {

                        const res = await fetch(`${API}/ordenes/${id}/estado`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ estado })
                        })

                        console.log(await res.json())
                        menu()

                    })
                })

                return

            case "13":

            rl.question("Categoria: ", categoria => {

                rl.question("Incremento %: ", async incremento => {

                    const res = await fetch(`${API}/menu-items/categoria/precio`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            categoria,
                            incremento: Number(incremento)
                        })
                    })

                    console.log(await res.json())
                    menu()

                })

            })

            return

            case "14":

                rl.question("ID reseña: ", async id => {

                    const res = await fetch(`${API}/resenas/${id}`, {
                        method: "DELETE"
                    })

                    console.log(await res.json())
                    menu()

                })

                return

            case "15":

                const del = await fetch(`${API}/ordenes/canceladas/eliminar`, {
                    method: "DELETE"
                })

                console.log(await del.json())
                break

            case "16":

                const count = await fetch(`${API}/restaurantes/count`)
                console.log(await count.json())
                break


            case "17":

                const distinct = await fetch(`${API}/restaurantes/cuisine/distinct`)
                console.log(await distinct.json())
                break

            case "0":

                rl.close()
                return

            default:

                console.log("Opcion invalida")

        }

    } catch (e) {

        console.log("Error:", e)

    }

    menu()

}

menu()