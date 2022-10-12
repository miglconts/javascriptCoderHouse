// Simulador de retención de impuestos de México de regimen RESICO

// TODO Recopilar Datos de ingresos

//let ingreso = parseInt(prompt("Ingresos netos mensuales en MNX"));

let tope0 = 25000;
let tope1 = 50000;
let tope2 = 83333;
let tope3 = 208333;

// TODO COndicional de ingresos, mayor ingreso mayor porcentaje de impuestos
function limite(ingreso, tope0, tope1, tope2, tope3) {
  switch (true) {
    case ingreso <= tope0:
      return `Con un ingreso de ${ingreso} MNX el ISR es de ${
        ingreso * 0.01
      } MNX, el saldo libre de impuestos es de ${ingreso - ingreso * 0.01} MNX`;
      break;
    case ingreso <= tope1:
      return `Con un ingreso de ${ingreso} MNX el ISR es de ${
        ingreso * 0.011
      } MNX, el saldo libre de impuestos es de ${
        ingreso - ingreso * 0.011
      } MNX`;
      break;
    case ingreso <= tope2:
      return `Con un ingreso de ${ingreso} MNX el ISR es de ${
        ingreso * 0.015
      } MNX, el saldo libre de impuestos es de ${
        ingreso - ingreso * 0.015
      } MNX`;
      break;
    case ingreso <= tope3:
      return `Con un ingreso de ${ingreso} MNX el ISR es de ${
        ingreso * 0.02
      } MNX, el saldo libre de impuestos es de ${ingreso - ingreso * 0.02} MNX`;
      break;

    default:
      return "Ingresa una cantidad mayor a 208,333 MNX, de lo contrario tu régimen es incorrecto o ingresaste un carácter que no es un número ";
      break;
  }
}

//! Arrays
class User {
  constructor(user) {
    this.name = user.name;
    this.lastName = user.lastName;
    this.age = user.age;
    this.income = user.income;
  }
}
let usersJson = [];
const getResponse = async () => {
  try {
    const response = await fetch(
      "https://miglconts.github.io/javascriptCoderHouse/db.json"
      // "https://mocki.io/v1/f576cf2c-4f11-4f5e-a38d-9fdb64d1141d"
    );
    const data = await response.json();
    console.log(data.users);
    data.users.forEach((item) => {
      usersJson.push({
        name: item.name,
        lastName: item.lastName,
        income: item.income,
      });
    });
  } catch (error) {}
};

getResponse();
//!Form
const myForm = document.forms["myForm"];
myForm.onsubmit = function (e) {
  let users = [...usersJson];
  e.preventDefault();
  //!Botones
  const resetButton = document.getElementById("resetButton");

  let nme = document.getElementById("nme").value;
  let lsNme = document.getElementById("lastName").value;
  let incm = document.getElementById("income").value;
  users.push(
    new User({
      name: nme,
      lastName: lsNme,
      income: incm,
    })
  );

  // Ordenar de mayor a menor ungreso
  let topIncome = users.sort((a, b) => b.income - a.income);
  for (const userSorted of topIncome) {
    let temp = JSON.stringify(userSorted);
    let tempName = JSON.stringify(userSorted.name);
    localStorage.setItem(tempName, temp);
  }

  let userList = document.getElementById("userList");

  //!Obtener los elementos del local Storage
  let localStorageLArray = [];
  for (let index = 0; index < localStorage.length; index++) {
    const localTemp = JSON.parse(localStorage.getItem(localStorage.key(index)));
    localStorageLArray.push(localTemp);
  }

  const persons = document.querySelectorAll(".user");

  for (const usuario of localStorageLArray) {
    persons.forEach((person) => {
      person.remove();
    });
    let userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerHTML = `
  <H2> ${usuario.name} ${usuario.lastName} </H2>
  <h3> Con un ingreso de  $${
    parseInt(usuario.income) > 208333
      ? usuario.income +
        ".00 MXN" +
        "  <b class = 'text-danger' s>Necesitas cambiar de régimen fiscal</b>"
      : usuario.income + ".00 MXN"
  }</h3>
  <p> ${limite(usuario.income, tope0, tope1, tope2, tope3)} </p>
  `;
    userList.append(userDiv);
  }
  //!Librerias
  Swal.fire({
    title: "Éxito",
    text: "Datos enviados con éxito",
    icon: "success",
    confirmButtonText: "Genial",
  });

  const removeClass = (sel) =>
    document.querySelectorAll(sel).forEach((item) => {
      localStorage.clear(), item.remove();
    });

  resetButton.addEventListener("click", () => {
    removeClass(".user");
  });
};
