
    // Import Firebase modules
    import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import {getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, orderBy, query} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

    // Firebase configuration
    // IMPORTANT: Replace these with your actual Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyAktxAvwU_0uNci7aHNO4gICaP59WUThho",
    authDomain: "kidpreneur-23a4f.firebaseapp.com",
    databaseURL: "https://kidpreneur-23a4f-default-rtdb.firebaseio.com",
    projectId: "kidpreneur-23a4f",
    storageBucket: "kidpreneur-23a4f.firebasestorage.app",
    messagingSenderId: "44758658100",
    appId: "1:44758658100:web:444d73b154849a71282e61",
    measurementId: "G-9SJ621H4SF"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Form elements
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    const refreshBtn = document.getElementById('refreshBtn');
    const contactsTableBody = document.getElementById('contactsTableBody');
    const loadingTable = document.getElementById('loadingTable');
    const noDataMessage = document.getElementById('noDataMessage');

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span>Sending...';
    //  statusMessage.style.display = 'none';

    try {
        // Get form data
        const formData = new FormData(form);
    const url = formData.get('URL');
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");

    const data = {
        name: formData.get('name'),
    age: formData.get('age'),
    email: formData.get('email'),
    contact: formData.get('contact') || '',
    title: formData.get('title'),
    video: videoId,
    funds:0,
    description: formData.get('description'),
    timestamp: serverTimestamp(),
    status: 'new'
        };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'contacts'), data);

    // Show success message
    showMessage('success', 'Thank you! Your message has been sent successfully.');

    // Reset form
    form.reset();

    // Refresh the table to show new data
    loadContacts();

        //console.log('Document written with ID: ', docRef.id);

      } catch (error) {
        console.error('Error adding document: ', error);
    showMessage('error', 'Sorry, there was an error sending your message. Please try again.');
      } finally {
        // Reset button state
        submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message';
      }
    });

    // Load contacts from Firestore
    async function loadContacts() {
      try {
        loadingTable.style.display = 'block';
    noDataMessage.style.display = 'none';
    contactsTableBody.innerHTML = '';

    // Query contacts ordered by timestamp (newest first)
    const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        document.getElementById('vid').style.display = 'none';
    noDataMessage.style.display = 'block';
        } else {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addRowToTable(doc.id, data);
        });
        }
      } catch (error) {
        console.error('Error loading contacts: ', error);
    showMessage('error', 'Error loading contacts. Please try again.');
      } finally {
        loadingTable.style.display = 'none';
      }
    }

    // Add row to table
    function addRowToTable(docId, data) {
      const row = document.createElement('tr');

    // Format timestamp
    let formattedDate = 'N/A';
    if (data.timestamp && data.timestamp.toDate) {
        formattedDate = data.timestamp.toDate().toLocaleDateString() + ' ' +
        data.timestamp.toDate().toLocaleTimeString();
      }
    row.innerHTML = `
    <td>${data.name} </td>
    <td>${data.email}</td>
    <td> <span class="phone-display" id="phone-display-${docId}">${data.funds + ' ₹'|| 'No funds'}</span>
        <input type="tel" class="phone-edit" id="phone-edit-${docId}" value="${data.funds || ''}" style="display: none;"></td>

    <td>${data.title}</td>
    <td class="message-cell">${data.description}</td>
    <td> <button class="edit-btn" onclick="showVideo('${data.video}', '${data.name}', '${data.description}', '${data.title}')" id="video-btn-${data.video}" style='background:green; font-size:16px'>
        video 📀
    </button></td>
    <td>${data.age}</td>
    <td>
        <button class="edit-btn" onclick="editPhone('${docId}')" id="edit-btn-${docId}">
            Edit
        </button>
        <button class="update-btn" onclick="updatePhone('${docId}')" id="update-btn-${docId}" style="display: none;">
            Update
        </button>
        <button class="cancel-btn" onclick="cancelEdit('${docId}')" id="cancel-btn-${docId}" style="display: none;">
            Cancel
        </button>
        <button onclick="deleteContact('${docId}')">
            ❌
        </button>
    </td>

    `;

    contactsTableBody.appendChild(row);
    }

    // Delete contact
    window.deleteContact = async function (docId) {
      if (!confirm('Are you sure you want to delete this contact?')) {
        return;
      }

    try {
        // Find the delete button and show loading state
        const deleteBtn = event.target;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<span class="loading"></span>';

    await deleteDoc(doc(db, 'contacts', docId));
        document.getElementById('vid').style.display = 'none';
    // Reload the table
    loadContacts();

    showMessage('success', 'Contact deleted successfully.');

      } catch (error) {
        console.error('Error deleting contact: ', error);
    showMessage('error', 'Error deleting contact. Please try again.');

    // Reset button state on error
    const deleteBtn = event.target;
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = 'Delete';
      }
    };
    // Edit phone number
    window.showVideo = function (videoID,name, description,title ) {
  const vid = document.getElementById('vid');
    vid.style.display='block';
    vid.innerHTML =`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoID}" title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
    </iframe>
    <div style='float:right; width:45%; padding:10px'>
        <h3>Name:<span style="color:green"> ${name}</span></h3>
        <h4>Title: <span style="color:green">${title}</span></h4>
        <h4> Description:<span style="color:green"> ${description}</span></h4>

    </div>

    `
      }

    window.editPhone = function (docId) {
        const phoneDisplay = document.getElementById(`phone-display-${docId}`);
    const phoneEdit = document.getElementById(`phone-edit-${docId}`);
    const editBtn = document.getElementById(`edit-btn-${docId}`);
    const updateBtn = document.getElementById(`update-btn-${docId}`);
    const cancelBtn = document.getElementById(`cancel-btn-${docId}`);

    // Hide display, show edit input
    phoneDisplay.style.display = 'none';
    phoneEdit.style.display = 'block';
    phoneEdit.focus();

    // Hide edit button, show update/cancel buttons
    editBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
      };

    // Update phone number in Firestore
    window.updatePhone = async function (docId) {
        const phoneEdit = document.getElementById(`phone-edit-${docId}`);
    const newPhone = phoneEdit.value.trim();

    try {
          // Show loading state
          const updateBtn = document.getElementById(`update-btn-${docId}`);
    updateBtn.disabled = true;
    updateBtn.innerHTML = '<span class="loading"></span>';

    // Update document in Firestore
    await updateDoc(doc(db, 'contacts', docId), {
        funds: newPhone
          });

    // Update the display
    const phoneDisplay = document.getElementById(`phone-display-${docId}`);
    phoneDisplay.textContent = newPhone || 'N/A';

    // Reset UI
    cancelEdit(docId);

    showMessage('success', ' updated successfully.');

        } catch (error) {
        console.error('Error updating phone number: ', error);
    showMessage('error', 'Error updating phone number. Please try again.');

    // Reset button state on error
    const updateBtn = document.getElementById(`update-btn-${docId}`);
    updateBtn.disabled = false;
    updateBtn.innerHTML = 'Update';
        }
      };

    // Cancel edit mode
    window.cancelEdit = function (docId) {
        const phoneDisplay = document.getElementById(`phone-display-${docId}`);
    const phoneEdit = document.getElementById(`phone-edit-${docId}`);
    const editBtn = document.getElementById(`edit-btn-${docId}`);
    const updateBtn = document.getElementById(`update-btn-${docId}`);
    const cancelBtn = document.getElementById(`cancel-btn-${docId}`);

    // Show display, hide edit input
    phoneDisplay.style.display = 'block';
    phoneEdit.style.display = 'none';

    // Show edit button, hide update/cancel buttons
    editBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';

    // Reset button state
    updateBtn.disabled = false;
    updateBtn.innerHTML = 'Update';
      };
    // Refresh button handler
    refreshBtn.addEventListener('click', loadContacts);

    // Show status message
    function showMessage(type, message) {
        //   statusMessage.className = `status-message ${type}`;
        //   statusMessage.textContent = message;
        //   statusMessage.style.display = 'block';

        // Hide message after 5 seconds

    }

    // Form validation enhancements
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
    input.addEventListener('input', clearErrors);
    });

    function validateField(e) {
      const field = e.target;
    const value = field.value.trim();

    // Remove existing error styling
    field.style.borderColor = '';

    // Validate required fields
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = '#dc3545';
    return false;
      }

    // Validate email format
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        field.style.borderColor = '#dc3545';
    return false;
        }
      }

    // Validate phone format (optional)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0, 15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        field.style.borderColor = '#dc3545';
    return false;
        }
      }

    return true;
    }

    function clearErrors(e) {
        e.target.style.borderColor = '';
    }

    // Load contacts when page loads
    document.addEventListener('DOMContentLoaded', loadContacts);

