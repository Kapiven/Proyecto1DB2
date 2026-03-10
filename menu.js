const readline = require("readline");
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API = "http://localhost:5000/api";

function mostrarMenu() {
  console.log("\n===== RESTAURANT MANAGEMENT SYSTEM =====");
  console.log("1. Ver restaurantes");
  console.log("2. Crear restaurante");
  console.log("3. Ver menú de restaurante");
  console.log("4. Crear usuario");
  console.log("5. Crear orden");
  console.log("6. Ver reseñas");
  console.log("7. Crear reseña");
  console.log("0. Salir");

  rl.question("\nSeleccione una opción: ", manejarOpcion);
}

async function manejarOpcion(opcion) {

  switch(opcion){

    case "1":
      const restaurantes = await fetch(`${API}/restaurantes`);
      console.log(await restaurantes.json());
      break;

    case "2":
        rl.question("Nombre del restaurante: ", (name) => {
            rl.question("Restaurant ID: ", (restaurant_id) => {
            rl.question("Tipo de cocina: ", (cuisine) => {
                rl.question("Building: ", (building) => {
                rl.question("Street: ", (street) => {
                    rl.question("Zipcode: ", (zipcode) => {
                    rl.question("Borough: ", (borough) => {
                        rl.question("Coord X (longitude): ", (coordX) => {
                        rl.question("Coord Y (latitude): ", async (coordY) => {
                            const res = await fetch(`${API}/restaurantes`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name,
                                restaurant_id,
                                cuisine,
                                address: {
                                building,
                                street,
                                zipcode,
                                borough,
                                coord: [Number(coordX), Number(coordY)]
                                }
                            })
                            });

                            const data = await res.json();
                            console.log(data);

                            mostrarMenu();
                        });
                        });
                    });
                    });
                });
                });
            });
            });
        });
        return;

    case "3":
      rl.question("ID restaurante: ", async (id) => {

        const res = await fetch(`${API}/menu-items/restaurante/${id}`);
        console.log(await res.json());

        mostrarMenu();
      });
      return;

    case "4":

      rl.question("Nombre: ", (nombre) => {
        rl.question("Email: ", (email) => {
          rl.question("Telefono: ", (telefono) => {
            rl.question("Password: ", async (password) => {

              const res = await fetch(`${API}/usuarios/registro`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  nombre,
                  email,
                  telefono,
                  passwordHash: password
                })
              });

              const data = await res.json();
              console.log(data);
              mostrarMenu();
            });
          });
        });
      });
    return;

    case "5":
      console.log("Crear orden (requiere usuario y restaurante)");
      break;

    case "6":
      const resenas = await fetch(`${API}/resenas`);
      console.log(await resenas.json());
      break;

    case "7":
        rl.question("Usuario ID: ", (usuarioId) => {
            rl.question("Restaurante ID: ", (restauranteId) => {
            rl.question("Orden ID: ", (ordenId) => {
                rl.question("Rating (1-5): ", (rating) => {
                rl.question("Comentario: ", async (comentario) => {
                    const res = await fetch(`${API}/resenas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        usuarioId,
                        restauranteId,
                        ordenId,
                        rating,
                        comentario
                    })
                    });
                    const data = await res.json();
                    console.log(data);
                    mostrarMenu();
                });
                });
            });
            });
        });
        return;

    case "0":
      rl.close();
      return;

    default:
      console.log("Opción inválida");
  }

  mostrarMenu();
}

mostrarMenu();