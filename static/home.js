fetch('/data')
    .then(response => response.json())
    .then(data => {
        var years = Object.keys(data);
        var counts = Object.values(data);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Jumlah Penelitian Selesai',
                    data: counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });



document.addEventListener('DOMContentLoaded', function () {
    var rows = document.querySelectorAll('.clickable-row');
    var finishedProjectsContainer = document.getElementById('finishedProjects');
    var joinButton = document.getElementById('joinButton');

    rows.forEach(function (row) {
        row.addEventListener('click', function () {
            var name = this.getAttribute('data-name');
            var creator = this.getAttribute('data-creator');
            var description = this.getAttribute('data-description');
            var status = this.getAttribute('data-status');
            var email = this.getAttribute('data-email');

            document.getElementById('joinModal').setAttribute('data-email', email);
            document.getElementById('modalProjectName').innerText = name;
            document.getElementById('modalProjectCreator').innerText = creator;
            document.getElementById('modalProjectDescription').innerText = description;

            joinButton.addEventListener('click', function () {
                $('#projectDetailModal').modal('hide');
                $('#joinModal').modal('show');

                // Ensure the email and name fields are filled with the current user’s information
                document.getElementById('creatorEmail').value = email;
                document.getElementById('modalProjectNameDisplay').innerText = name;

                // No need to clear the fields as they are already populated from the server
                // document.getElementById('namaLengkap').value = '';
                // document.getElementById('alamatEmail').value = '';
                // document.getElementById('posisi').selectedIndex = 0;
                // document.getElementById('pesanKhusus').value = '';
                
                // Set hidden input for project name
                var hiddenProjectName = document.querySelector('input[name="projectName"]');
                hiddenProjectName.value = name;
            });

            // Check if the project is finished and move it to the bottom
            if (status === 'selesai') {
                finishedProjectsContainer.appendChild(this);
            }
        });
    });




    // Pagination setup
    var currentPage = 1;
    var rowsPerPage = 5;

    function displayProjects(page) {
        var start = (page - 1) * rowsPerPage;
        var end = start + rowsPerPage;
        rows.forEach(function (row, index) {
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function setupPagination() {
        var totalPages = Math.ceil(rows.length / rowsPerPage);
        var pagination = document.getElementById('pagination');
        var prevPage = document.getElementById('prevPage');
        var nextPage = document.getElementById('nextPage');

        function updatePagination() {
            // Update page number links
            var pageLinks = pagination.querySelectorAll('.page-number');
            pageLinks.forEach(function (link) {
                link.parentNode.removeChild(link);
            });

            for (var i = 1; i <= totalPages; i++) {
                var li = document.createElement('li');
                li.classList.add('page-item', 'page-number');
                if (i === currentPage) {
                    li.classList.add('active');
                }

                var a = document.createElement('a');
                a.classList.add('page-link');
                a.href = '#';
                a.innerText = i;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    currentPage = parseInt(this.innerText);
                    displayProjects(currentPage);
                    updatePagination();
                });

                li.appendChild(a);
                pagination.insertBefore(li, nextPage);
            }

            // Update "Previous" and "Next" buttons
            if (currentPage === 1) {
                prevPage.classList.add('disabled');
            } else {
                prevPage.classList.remove('disabled');
            }

            if (currentPage === totalPages) {
                nextPage.classList.add('disabled');
            } else {
                nextPage.classList.remove('disabled');
            }
        }

        prevPage.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                displayProjects(currentPage);
                updatePagination();
            }
        });

        nextPage.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                displayProjects(currentPage);
                updatePagination();
            }
        });

        displayProjects(currentPage);
        updatePagination();
    }

    setupPagination();
});

function sendJoinRequest(event) {
    event.preventDefault();
    
    const form = document.getElementById('joinForm');
    const formData = new FormData(form);
    
    fetch('/send_join_request', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            window.location.href = document.referrer;
        }
    })
    .catch(error => {
        alert('An error occurred. Please try again.');
        console.error('Error:', error);
    });
}
    



document.addEventListener('DOMContentLoaded', function () {
    var saveDataLink = document.getElementById('saveDataLink');

    saveDataLink.addEventListener('click', function (event) {
        event.preventDefault(); // Mencegah perilaku default dari link

        // Mengambil data yang diperlukan
        var namaLengkap = document.getElementById('namaLengkap').textContent;
        var alamatEmail = document.getElementById('alamatEmail').textContent;
        var posisi = document.getElementById('posisi').textContent;

        // Mengirim data ke server
        fetch('/save_to_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                namaLengkap: namaLengkap,
                alamatEmail: alamatEmail,
                posisi: posisi
            })
        })
            .then(response => response.json())
            .then(data => {
                if (response.ok) {
                    // Redirect to success page
                    window.location.href = '/success_page';
                } else {
                    // Redirect to failure page
                    window.location.href = '/failure_page';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Redirect to failure page
                window.location.href = '/failure_page';
            });
    });
});

function deleteProject(projectId) {
    // Implement your delete logic here, for example:
    if (confirm('Are you sure you want to delete this project?')) {
        fetch(`/delete_project/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // Add any necessary body parameters if needed
        }).then(response => {
            // Handle response as needed
            console.log('Project deleted successfully');
            // Optionally, refresh the project list or update UI
        }).catch(error => {
            console.error('Error deleting project:', error);
            // Handle errors if any
        });
    }
}