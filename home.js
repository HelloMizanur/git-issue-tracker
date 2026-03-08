const allIssuesCounter = document.getElementById("allIssuesCounter");
const cardSection = document.getElementById("cardSection");
const myModalData = document.getElementById("myModalData");
const modalBox = document.getElementById("modalBox");
const loder = document.getElementById("loder");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allData;
// Load all Issues
const loadAllIssueData = async () => {
  try {
    showLoader();
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues`;
    const res = await fetch(url);
    const data = await res.json();
    allData = data.data;
    removeLoader();

    displayAllIssues(data.data);
  } catch (error) {
    console.error("Could not fetch issues", error);
  }
};

// Display all issues
const displayAllIssues = (data) => {
  allIssuesCounter.innerText = data.length;

  cardSection.innerHTML = "";

  data.forEach((data) => {
    cardSection.innerHTML += `
        <div onClick='loadModalData(${data.id})' class=" pt-1 rounded shadow-xl ${data.status === "open" ? "bg-green-700" : "bg-[#A855F7]"}">
          <div class="flex h-full flex-col gap-4 p-3 bg-white rounded">
            <div class="flex justify-between items-center">
              <img src="${data.status === "open" ? "assets/Open-Status.png" : "assets/closed.png"}" alt="open" />
              <span
                class="font-bold py-1 px-4 capitalize rounded-full ${
                  data.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : data.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                }"
                >${data.priority}</span
              >
            </div>
            <h1 class="text-xl font-bold">
              ${data.title}
            </h1>
            <p class="text-gray-600 line-clamp-2">
             ${data.description}
            </p>
            <div class="flex flex-wrap gap-2">
            
              ${generateLabels(data.labels)}
             
            </div>
             <hr class="-mx-3 my-2 border-gray-300" />
            <p class="text-gray-400">#${data.id} ${data.author}</p>
            <p class="text-gray-400">${data.createdAt.split("T")[0]}</p>
          </div>
        </div>
    `;
  });
};

// label generate
const generateLabels = (labelsArray) => {
  if (!labelsArray || labelsArray.length === 0) return "";

  return labelsArray
    .map((label) => {
      const l = label.toLowerCase();
      if (l === "bug") {
        return `
        <p class="bg-red-100 text-red-700 py-1 px-4 rounded-full inline-block">
        <i class="fa-solid fa-bug"></i>
          <span class="font-bold text-xl"> Bug</span>
        </p>`;
      } else if (l === "help wanted") {
        return `
        <p class="bg-amber-100 text-amber-400 py-1 px-4 rounded-full inline-block">
        <i class="fa-solid fa-user-astronaut"></i>
          <span class="font-bold text-xl"> Help wanted</span>
        </p>`;
      } else {
        return `
        <p class="bg-green-100 text-green-700 py-1 px-4 rounded-full inline-block">
        <i class="fa-brands fa-yelp"></i>
          <span class="font-bold capitalize text-xl"> ${label}</span>
        </p>`;
      }
    })
    .join("");
};

// Load modal data
const loadModalData = async (id) => {
  try {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayModal(data.data);
  } catch (error) {
    console.log("Data not fetch", error);
  }
};

// Display modal data

const displayModal = (data) => {
  modalBox.innerHTML = `
        <h1 class="text-3xl font-bold">${data.title}</h1>
            <div class="flex gap-2 items-center">
              <p
                class="${data.status === "open" ? "bg-green-600" : "bg-[#A855F7]"} font-bold text-xl text-white py-1 px-4 rounded-full inline-block"
              >
                ${data.status}
              </p>
              <p class="font-bold text-gray-500">
                . Opened by <span class="capitalize">${data.author}</span>
              </p>
              <p class="font-bold text-gray-500">. ${data.createdAt.split("T")[0]}</p>
            </div>
            <div>${generateLabels(data.labels)}</div>
            <p class="text-xl text-gray-500">
              ${data.description}
            </p>
            <div class="grid grid-cols-2">
              <p class="text-xl font-bold text-gray-500">Assignee:</p>
              <p class="text-xl font-bold text-gray-500">Priority:</p>
              <p class="text-xl capitalize">${data.assignee.length === 0 ? "No Assigne" : data.assignee}</p>
              <p
                class="${
                  data.priority === "high"
                    ? "bg-red-600 "
                    : data.priority === "medium"
                      ? "bg-yellow-600"
                      : "bg-gray-600 "
                } font-bold text-xl text-white py-1 px-4 capitalize rounded-full w-fit"
              >
                ${data.priority}
              </p>
            </div>
    `;

  myModalData.showModal();
};

// Show Loader
const showLoader = () => {
  loder.classList.remove("hidden");
};
// Remove Loader
const removeLoader = () => {
  loder.classList.add("hidden");
};

// active menu
function handleActiveBtn(clickedElement) {
  const allButtons = document.querySelectorAll(".filter-btn");
  for (const btn of allButtons) {
    btn.classList.remove("btn-primary");
  }
  clickedElement.classList.add("btn-primary");
  if (clickedElement.innerText === "Open") {
    const openData = allData.filter(
      (data) => data.status.toLowerCase() === "open",
    );
    displayAllIssues(openData);
  } else if (clickedElement.innerText === "Close") {
    const closedata = allData.filter(
      (data) => data.status.toLowerCase() === "closed",
    );
    displayAllIssues(closedata);
  } else {
    displayAllIssues(allData);
  }
  return;
}

// Searh option
searchBtn.addEventListener("click", async () => {
  try {
    showLoader();
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchInput.value.trim()}`;
    const res = await fetch(url);
    const data = await res.json();
    removeLoader();
    allData = data.data;
    searchInput.value = "";
    const allButtons = document.querySelectorAll(".filter-btn");
    for (const btn of allButtons) {
      if (btn.innerText === "All") {
        btn.classList.add("btn-primary");
      } else {
        btn.classList.remove("btn-primary");
      }
    }
    displayAllIssues(allData);
  } catch (error) {
    console.log("Data can not fetch", error);
  }
});

loadAllIssueData();
