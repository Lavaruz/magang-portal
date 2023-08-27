$(document).ready(function() {
  $("#login-form").submit(function(e){
      e.preventDefault()
      const formData = new FormData(document.getElementById('login-form'));
      const urlencoded = new URLSearchParams(formData).toString()
      $.ajax({
          url: '/api/users/login',
          type: 'POST',
          data: urlencoded,
          contentType: 'application/x-www-form-urlencoded',
          processData: false,
          success: function(response) {
            if (response.status_code == 200){
              window.location = "/employer/jobs"
            }
            if (response.error){
              $(`
                <div class="alert alert-danger" role="alert">
                  ${response.error}
                </div>
              `).insertAfter(".head").delay(1500).fadeOut("slow");
            }
          },
          error: function(error) {
            alert("error")
          }
      });
  })
});