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
  