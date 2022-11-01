const studentTable = document.querySelector(".table");
const query = document.querySelector("input");
const restartButton = document.querySelector(".restart");
const editBtn = document.querySelector(".edit");
const deleteBtn = document.querySelector(".delete");
const dropDown = document.querySelector("select");

let students;

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

async function gatherData() {
  let dataFile1 = await fetchData(
    "https://capsules7.herokuapp.com/api/group/one"
  );
  let dataFile2 = await fetchData(
    "https://capsules7.herokuapp.com/api/group/two"
  );
  console.log(dataFile1, dataFile2);
  const mergedData = dataFile1.concat(dataFile2);
  // console.log(mergedData);
  const people = [];
  for (let index = 0; index < mergedData.length; index++) {
    const person = fetchData(
      `https://capsules7.herokuapp.com/api/user/${mergedData[index].id}`
    );
    people.push(person);
  }
  const data = await Promise.all(people);
  console.log(data);
  students = data;
  updateTable(data);
}
gatherData();

const updateTable = (arr) => {
  let updatedTable = "";
  arr.forEach((student) => {
    updatedTable = updatedTable + addStudToTable(student);
  });
  studentTable.innerHTML = updatedTable;
  addEventListeners();
  // console.log(updatedTable);
};
const addStudToTable = (student) => {
  const studentLi = `
  <li data-id =${student.id}>
    <div class="col" data-col = "id">${student.id}</div>
    <div class="col" data-col = "firstName">${student.firstName}</div>
    <div class="col" data-col = "lastName">${student.lastName}</div>
    <div class="col" data-col = "age">${student.age}</div>
    <div class="col" data-col = "capsule">${student.capsule}</div>
    <div class="col" data-col = "city">${student.city}</div>
    <div class="col" data-col = "gender">${student.gender}</div>
    <div class="col" data-col = "hobby">${student.hobby}</div>
    <div class = "button-container" data-id =${student.id}>
      <button class="btn edit" >Edit</button>
      <button class="btn delete">Delete</button>
    </div>
  </li>`;
  return studentLi;
};

query.addEventListener("input", function (e) {
  // console.log(e.target.value);
  const filteredStudents = students.filter((student) => {
    // const values = Object.values(student).join("");
    // return values.includes(e.target.value);
    console.log(dropDown.value);
    return student[dropDown.value].toString().includes(e.target.value);
  });
  updateTable(filteredStudents);
});
restartButton.addEventListener("click", function (e) {});
// dropDown.addEventListener("change", function (e) {
function addEventListeners() {
  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log(e.target.parentElement.dataset.id);
      createForm(e.target.parentElement.dataset.id);
    });
  });
}

function createForm(id) {
  const form = document.createElement("form");
  const student = students.find((student) => (student.id = id));
  console.log(student);
  const formHeader = document.createElement("h2");
  formHeader.textContent = `Editting data of ${student.firstName} ${student.lastName}`;
  form.append(formHeader);
  for (const key in student) {
    if (key == "id") {
      continue;
    }
    const value = student[key];
    const label = document.createElement("label");
    label.setAttribute("for", key);
    label.textContent = key;
    const input = document.createElement("input");
    input.name = key;
    input.id = key;
    input.value = value;
    form.append(label);
    form.append(input);
  }
  const submitBtn = document.createElement("input");
  submitBtn.type = "submit";
  submitBtn.name = "submit";
  submitBtn.textContent = "Save Changes";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleEdit(student.id);
    form.remove();
  });
  form.appendChild(submitBtn);
  document.body.appendChild(form);
}

function handleEdit(id) {
  const inputValues = document.querySelectorAll("form input");
  const data = {};
  inputValues.forEach((input) => {
    if (input.name != "submit") {
      data[input.name] = input.value;
    }
  });
  const studentIndex = students.findIndex((student) => student.id == id);
  students[studentIndex] = {
    id,
    ...data,
  };
  console.log(students[studentIndex]);
  updateStudentLi(studentIndex, data);
}
function updateStudentLi(index, data) {
  const student = students[index];
  const listItem = document.querySelector(
    `li[data-id="${student.id}"`
  ).childNodes;
  console.log(listItem);
}
