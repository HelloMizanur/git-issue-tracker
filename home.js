const allIssuesCounter = document.getElementById("allIssuesCounter");
const cardSection = document.getElementById("cardSection");
const myModalData = document.getElementById("myModalData");
// Load all Issues
const loadAllIssueData = async () => {
  try {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues`;
    const res = await fetch(url);
    const data = await res.json();
    displayAllIssues(data);
  } catch (error) {
    console.error("Could not fetch issues", error);
  }
};

// Display all issues
const displayAllIssues = (data) => {
  allIssuesCounter.innerText = data.data.length;

  cardSection.innerHTML = "";

  data.data.forEach((data) => {
    cardSection.innerHTML += `
        <div onClick='loadModalData(${data.id})' class=" pt-1 rounded shadow-xl ${data.status === "open" ? "bg-green-700" : "bg-[#A855F7]"}">
          <div class="flex h-full flex-col gap-4 p-3 bg-white rounded">
            <div class="flex justify-between items-center">
              <img src="${data.status === "open" ? "assets/Open-Status.png" : "assets/closed.png"}" alt="open" />
              <span
                class="font-bold py-1 px-4 rounded-full ${
                  data.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : data.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                } } "
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
            <p class="text-gray-400"># ${data.author}</p>
            <p class="text-gray-400">${data.createdAt}</p>
          </div>
        </div>
    `;
    return;
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
          <span class="font-bold text-xl"> Bug</span>
        </p>`;
      } else if (l === "help wanted") {
        return `
        <p class="bg-amber-100 text-amber-400 py-1 px-4 rounded-full inline-block">
          <span class="font-bold text-xl"> Help wanted</span>
        </p>`;
      } else {
        return `
        <p class="bg-green-100 text-green-700 py-1 px-4 rounded-full inline-block">
          <span class="font-bold text-xl"> ${label}</span>
        </p>`;
      }
    })
    .join("");
};

// Load modal data
const loadModalData = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id};`;
  const res = await fetch(url);
  const data = await res.json();
  displayModal(data);
};

// Display modal data

const displayModal = (data) => {
  console.log(data);
  myModalData.showModal();
};

loadAllIssueData();
