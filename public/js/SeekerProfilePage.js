const id = $("#user_id").text()
$.get(`/api/v1/seeker/${id}`, async (seekerData) => {
    $("#nav-username").text(`${seekerData.first_name} ${seekerData.last_name}`)
    $("#header-firstname").text(`Hi, ${seekerData.first_name}`)
    $("#basic-fullname").text(`${seekerData.first_name} ${seekerData.last_name}`)
    $("#basic-email").text(`${seekerData.email}`)
    $("#basic-mobile").text(`${seekerData.mobile}`)
    $("#basic-birthdate").text(`${formatDate(seekerData.date_of_birth)}`)
    $("#basic-domicile").text(`${seekerData.domicile}`)
    $("#popup-firstname").val(`${seekerData.first_name}`)
    $("#popup-lastname").val(`${seekerData.last_name}`)
    $("#popup-email").val(`${seekerData.email}`)
    $("#popup-mobile").val(`${seekerData.mobile}`)
    $("#popup-birthdate").val(`${seekerData.date_of_birth}`)
    $("#popup-domicile").val(`${seekerData.domicile}`)
    $("input[name=sex][value='male']").prop("checked",true);
    
    if(seekerData.profile_summary){
      let paragraph = seekerData.profile_summary.split('\n')
      $("#profile-summary").html(paragraph.join("</br>")).addClass("font-second text-sm text-white font-medium")
      $("#popup-summary-textarea").val(`${seekerData.profile_summary}`)
    }
})


// Open popup on edit button and profile completion

$("#edit-basic-info, #completion-profile-picture").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-basic").removeClass("hidden")
})
$("#edit-profile-summary, #completion-profile-summary, #button-profile-summary").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-summary").removeClass("hidden")
})
$("#edit-experiences, #completion-experiences, #button-experiences").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-experiences").removeClass("hidden")
})
$("#edit-education, #completion-education, #button-education").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-education").removeClass("hidden")
})
$("#edit-attachment, #completion-resume").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-attachments").removeClass("hidden")
})

// Close button to close popup

$(".close-x").click(function(){
    $(this).closest('.popup').addClass("hidden")
    $(this).closest('#popup').addClass("hidden")
})



function formatDate(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth} ${year}`;
  
    return formattedDate;
  }
  