let RECRUITER_ID
const USER_ID = $("#user_id").text()

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    $("#navbar-seeker-logo").attr("src", seekerData.profile_picture)
    $("#navbar-seeker").removeClass("hidden")
    
    $("#foryou-firstname").text(seekerData.first_name)
    $("#navbar-seeker-name").text(`${seekerData.first_name} ${seekerData.last_name}`)
    
    if(seekerData.recruiter){
        RECRUITER_ID = seekerData.recruiter.id
        $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
            $("#navbar-org-name").text(recruiterData.rec_org_name)
            if(recruiterData.rec_org_logo){
                $("#navbar-org-logo").attr("src", recruiterData.rec_org_logo);
    
            }
    
    
            $(".close-x").click(function(){
                $(this).closest('.popup').addClass("hidden")
                $(this).closest('#popup').addClass("hidden")
            })
            $(".back-x").click(function(){
                let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
                $(".body-percent").eq(body_percent_idx).addClass("hidden")
                $(".body-percent").eq(body_percent_idx-1).removeClass("hidden")
            })
            $(".button-next").click(function(){
                let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
                $(".body-percent").eq(body_percent_idx).addClass("hidden")
                $(".body-percent").eq(body_percent_idx+1).removeClass("hidden")
            })
    
        })
    }
})


$("#cards-grid").on("click",".card-love",function(){

    const POST_ID = $(this).parent().find("p").text();

    $(this).val($(this).is(":checked"))
    const formData = new FormData($(this).closest("form")[0])
    if($(this).val() == "false") formData.append("loved", false)
    formData.set("post_id", POST_ID)

    if($(this).val() == "true"){
        $(this).parent().find("img").attr("src","/img/Loved.png")
    }else{
        $(this).parent().find("img").attr("src","/img/Nolove.png")
    }

    $.ajax({
        url: `/api/v1/seeker/${USER_ID}/save-post`,
        type: "POST",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
            if(response.status_code == 200){
                location.reload()
            }
        },
        error: function (request, status, error) {
            alert("Error!")
        },
    });
})



function updateSeekerData(formId, URL, method){
    const form_update = document.getElementById(formId);
    $(`#${formId}`).submit(function(e){
        e.preventDefault();
        let formData = new FormData(form_update)
        $.ajax({
            url: URL,
            type: method,
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                if(response.status_code == 200){
                    location.reload()
                }
            },
            error: function (request, status, error) {
                alert("Error!")
            },
        });
    })
}

function formatDate(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth}`;
  
    return formattedDate;
}

function formatDateFull(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth} ${year}`;
  
    return formattedDate;
}
