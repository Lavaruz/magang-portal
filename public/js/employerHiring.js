$(document).ready(function() {
    $.get("/api/users/token", function(users){
        users = users.datas;
        $("#email").val(users.email)
        $("#fullname").val(`${users.firstname} ${users.lastname}`)
    })

    $("#hiring-form").submit(function(e){
        e.preventDefault()
        const formData = new FormData(document.getElementById('hiring-form'));
        const urlencoded = new URLSearchParams(formData).toString()
        $.ajax({
            url: '/api/hiring',
            type: 'POST',
            data: urlencoded,
            contentType: 'application/x-www-form-urlencoded',
            processData: false,
            success: function(response) {
              if (response.status_code == 200){
                window.location = "/employer/jobs"
              }
            },
            error: function(error) {
              // Tindakan yang diambil ketika permintaan gagal
            }
        });
    })
});