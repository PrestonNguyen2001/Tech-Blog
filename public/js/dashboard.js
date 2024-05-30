// Import Firebase functions using ES modules
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyC9WkpxzUMj-pWFKNm2mNyk9Mh410IbyiY",
  authDomain: "tech-blog-58f75.firebaseapp.com",
  projectId: "tech-blog-58f75",
  storageBucket: "tech-blog-58f75.appspot.com",
  messagingSenderId: "948862803890",
  appId: "1:948862803890:web:c4dffcdde39cbf368d8eab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Image upload functionality for blogs
const handleUploadImage = () => {
  const fileInput = document.getElementById("blog-image");
  const file = fileInput.files[0];
  const uploadProgress = document.getElementById("upload-progress");
  const uploadError = document.getElementById("upload-error");
  const progressBar = document.getElementById("progress-bar");

  console.log("handleUploadImage triggered");
  if (!file) {
    uploadError.textContent = "Please select an image";
    console.log("No file selected");
    return;
  }

  // Show the upload progress spinner
  uploadProgress.classList.remove("hidden");

  const fileName = new Date().getTime() + "-" + file.name;
  console.log(`File name: ${fileName}`);
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
      progressBar.innerHTML = `<div style="width: ${progress.toFixed(
        0
      )}%">${progress.toFixed(0)}%</div>`;
    },
    (error) => {
      uploadError.textContent = "Image upload failed";
      console.error("Upload error:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        document.getElementById("blog-image-url").value = downloadURL;
        uploadError.textContent = "";
        progressBar.innerHTML = "";
        console.log("Image uploaded successfully. Download URL:", downloadURL);
        uploadProgress.classList.add("hidden");
      });
    }
  );
};

// Image upload functionality for articles
const handleUploadImageArticle = () => {
  const fileInput = document.getElementById("article-image");
  const file = fileInput.files[0];
  const uploadProgress = document.getElementById("upload-progress-article");
  const uploadError = document.getElementById("upload-error-article");
  const progressBar = document.getElementById("progress-bar-article");

  console.log("handleUploadImageArticle triggered");
  if (!file) {
    uploadError.textContent = "Please select an image";
    console.log("No file selected");
    return;
  }

  // Show the upload progress spinner
  uploadProgress.classList.remove("hidden");

  const fileName = new Date().getTime() + "-" + file.name;
  console.log(`File name: ${fileName}`);
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
      progressBar.innerHTML = `<div style="width: ${progress.toFixed(
        0
      )}%">${progress.toFixed(0)}%</div>`;
    },
    (error) => {
      uploadError.textContent = "Image upload failed";
      console.error("Upload error:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        document.getElementById("article-image-url").value = downloadURL;
        uploadError.textContent = "";
        progressBar.innerHTML = "";
        console.log("Image uploaded successfully. Download URL:", downloadURL);
        uploadProgress.classList.add("hidden");
      });
    }
  );
};

// Form submission functionality for blogs
const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#blog-title").value.trim();
  const description = document.querySelector("#blog-content").value.trim();
  const image_url = document.querySelector("#blog-image-url").value.trim();

  console.log("Form submission triggered");
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Image URL:", image_url);

  if (title && description && image_url) {
    const response = await fetch(`/api/blogs`, {
      method: "POST",
      body: JSON.stringify({ title, description, image_url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Blog created successfully");
      document.location.replace("/dashboard");
    } else {
      console.error("Failed to create blog");
      alert("Failed to create blog");
    }
  } else {
    console.error("Please fill out all fields");
    alert("Please fill out all fields");
  }
};

// Form submission functionality for articles
const newArticleFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#article-title").value.trim();
  const description = document.querySelector("#article-content").value.trim();
  const image_url = document.querySelector("#article-image-url").value.trim();

  console.log("Article form submission triggered");
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Image URL:", image_url);

  if (title && description && image_url) {
    const response = await fetch(`/api/articles`, {
      method: "POST",
      body: JSON.stringify({ title, description, image_url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Article created successfully");
      document.location.replace("/dashboard");
    } else {
      console.error("Failed to create article");
      alert("Failed to create article");
    }
  } else {
    console.error("Please fill out all fields");
    alert("Please fill out all fields");
  }
};

// Scrim functionality
const showScrim = () => {
  document.getElementById("scrim").classList.add("active");
};

const hideScrim = () => {
  document.getElementById("scrim").classList.remove("active");
};

// Delete button functionality
let deleteItemId = null;
let deleteItemType = null;

const openDeleteModal = (id, title, type) => {
  deleteItemId = id;
  deleteItemType = type;
  document.getElementById("delete-blog-title").textContent = title;
  document.getElementById("delete-modal").style.display = "block";
  showScrim();
};

const closeDeleteModal = () => {
  deleteItemId = null;
  deleteItemType = null;
  document.getElementById("delete-modal").style.display = "none";
  hideScrim();
};

const confirmDelete = async () => {
  if (deleteItemId && deleteItemType) {
    try {
      const response = await fetch(`/api/${deleteItemType}s/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(
          `${
            deleteItemType.charAt(0).toUpperCase() + deleteItemType.slice(1)
          } with ID ${deleteItemId} deleted successfully`
        );
        document.location.replace("/dashboard");
      } else {
        console.error(
          `Failed to delete ${deleteItemType} with ID ${deleteItemId}`
        );
        alert(`Failed to delete ${deleteItemType}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the item");
    } finally {
      closeDeleteModal();
    }
  }
};

// Edit button functionality
let editItemId = null;
let editItemType = null;

const openEditModal = (id, title, description, type) => {
  editItemId = id;
  editItemType = type;
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-content").value = description;
  document.getElementById("edit-modal").style.display = "block";
  showScrim();
};

const closeEditModal = () => {
  editItemId = null;
  editItemType = null;
  document.getElementById("edit-modal").style.display = "none";
  hideScrim();
};

const saveEdit = async () => {
  const title = document.getElementById("edit-title").value.trim();
  const description = document.getElementById("edit-content").value.trim();

  if (editItemId && title && description) {
    try {
      const response = await fetch(`/api/${editItemType}s/${editItemId}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(
          `${
            editItemType.charAt(0).toUpperCase() + editItemType.slice(1)
          } with ID ${editItemId} updated successfully`
        );
        document.location.replace("/dashboard");
      } else {
        console.error(`Failed to update ${editItemType} with ID ${editItemId}`);
        alert(`Failed to update ${editItemType}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the item");
    } finally {
      closeEditModal();
    }
  } else {
    alert("Please fill out all fields");
  }
};

// Event listeners for blog form
const newBlogForm = document.querySelector("#new-blog-form");
if (newBlogForm) {
  newBlogForm.addEventListener("submit", newFormHandler);
}

const uploadButton = document.querySelector("#upload-button");
if (uploadButton) {
  uploadButton.addEventListener("click", handleUploadImage);
}

// Event listeners for article form
const newArticleForm = document.querySelector("#new-article-form");
if (newArticleForm) {
  newArticleForm.addEventListener("submit", newArticleFormHandler);
}

const uploadButtonArticle = document.querySelector("#upload-button-article");
if (uploadButtonArticle) {
  uploadButtonArticle.addEventListener("click", handleUploadImageArticle);
}

// Event listeners for delete and edit buttons
document.querySelectorAll(".btn-danger").forEach((button) => {
  button.addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-id");
    const type = event.target.getAttribute("data-type");
    const titleElement = event.target.closest(".row")?.querySelector("h4 a");
    if (titleElement) {
      const title = titleElement.textContent;
      openDeleteModal(id, title, type);
    } else {
      console.error("Title element not found");
    }
  });
});

document.querySelectorAll(".btn-primary").forEach((button) => {
  button.addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-id");
    const type = event.target.getAttribute("data-type");
    const rowElement = event.target.closest(".row");
    const titleElement = rowElement?.querySelector("h4 a");
    const descriptionElement = rowElement?.querySelector(`.${type}-content`);

    if (titleElement && descriptionElement) {
      const title = titleElement.textContent;
      const description = descriptionElement.textContent;
      openEditModal(id, title, description, type);
    } else {
      console.error("Title or description element not found");
    }
  });
});

const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", confirmDelete);
}

const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
}

const closeEditModalBtn = document.getElementById("close-edit-modal-btn");
if (closeEditModalBtn) {
  closeEditModalBtn.addEventListener("click", closeEditModal);
}

const saveItemBtn = document.getElementById("save-item-btn");
if (saveItemBtn) {
  saveItemBtn.addEventListener("click", saveEdit);
}

// Close the modals when clicking outside of them
window.addEventListener("click", (event) => {
  if (event.target.matches(".modal")) {
    closeDeleteModal();
    closeEditModal();
  }
});
