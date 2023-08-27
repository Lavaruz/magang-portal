$(document).ready(function() {

    $('#flexCheckDefault').change(function(){
        if($('#flexCheckDefault').is(":checked")){
            $("button[type=submit]").prop("disabled", false)
        }else{
            $("button[type=submit]").prop("disabled", true)
        }
    })

    $("#signup-form").submit(function(e){
        e.preventDefault()
        const formData = new FormData(document.getElementById('signup-form'));
        const urlencoded = new URLSearchParams(formData).toString()
        $.ajax({
            url: '/api/users/register',
            type: 'POST',
            data: urlencoded,
            contentType: 'application/x-www-form-urlencoded',
            processData: false,
            success: function(response) {
              if (response.status_code == 201){
                window.location = "/employer/jobs"
              }
            },
            error: function(error) {
              alert("error")
            }
        });
    })
});