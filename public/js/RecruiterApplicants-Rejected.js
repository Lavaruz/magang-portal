let RECRUITER_ID
let COMPLETION_COUNT = 0
const id = $("#user_id").text()
const URL_ID = window.location.href.match(/\/applicants\/(\d+)\//)[1];+

$.get(`/api/v1/seeker/${id}`, async (seekerData) => {
    if(seekerData.role == "recruiter"){
        // $("#navbar-recruiter-recruiter").remove()
        $("#navbar-recruiter-recruiter").removeClass("hidden")
        $("#navbar-recruiter-seeker").remove()
        $("#navbar-seeker-only").remove()
    }else{
        $("#navbar-recruiter-recruiter").remove()
        $("#navbar-recruiter-seeker").remove()
    }
    
    $("#navbar-org-logo").attr("src", seekerData.recruiter.rec_org_logo)
    $("#navbar-seeker-logo").attr("src", seekerData.profile_picture)
    $("#navbar-org-name").text(seekerData.recruiter.rec_org_name)
    $("#navbar-seeker-name").text(`${seekerData.first_name} ${seekerData.last_name}`)
    // $("#navbar-seeker").removeClass("hidden")
    $("#navbar-recruiter").removeClass("hidden")

    RECRUITER_ID = seekerData.recruiter.id
    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
        $("#org-name").text(recruiterData.rec_org_name)
        if(recruiterData.rec_org_logo){
            $("#org-logo").attr("src", recruiterData.rec_org_logo);
        }

        updateSeekerData("form-add-post", `/api/v1/recruiter/${RECRUITER_ID}/post`, "POST")
    })
})

$.get(`/api/v1/posts/${URL_ID}`, async (postId) => {
    const POST = postId.datas;
    $("#org-position").text(POST.post_position)
    $("#menu-waiting").prop("href",`/recruiter/applicants/${POST.id}/waiting`)
    $("#menu-shortlisted").prop("href",`/recruiter/applicants/${POST.id}/shortlisted`)
    $("#menu-interview").prop("href",`/recruiter/applicants/${POST.id}/interview`)
    $("#menu-offering").prop("href",`/recruiter/applicants/${POST.id}/offering`)
    $("#menu-rejected").prop("href",`/recruiter/applicants/${POST.id}/rejected`)

    const APPLICANTS_REJECTED = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Rejected"
    })

    if(APPLICANTS_REJECTED.length !== 0){
        $("#applicants-list").html("")
        APPLICANTS_REJECTED.forEach(applicants => {
            $.get(`/api/v1/seekerpost/${applicants.SeekerPost.id}`, async (seekerpostData) => {
                $("#applicants-list").append(applicantsCard(applicants, seekerpostData.datas))
            })
        });
    }
})


$("#applicants-list").on("click", ".button-reject", function(){
    // updateSeekerData($(this).parent()[0], `api/v1/seekerpost`, "PUT")
    const SEEKERPOSTID = $(this).parent().find("p").text();
    $(this).parent().submit(function(e){
        e.preventDefault();
        let formData = new FormData(this)
        formData.append("applicantStatus", "Waiting")
        $.ajax({
            url: `/api/v1/seekerpost/${SEEKERPOSTID}`,
            type: "PUT",
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
    $(this).parent().submit()
})

$("#popup").click(function(event){
    if($(event.target).is("#popup")){
        $("#popup").addClass("hidden")
        $("#popup-offering-status").addClass("hidden")
    }
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

function applicantsCard(applicants, seekerpost){
    let total_experiences = 0
    if(applicants.experiences.length !== 0){
        let experiences = applicants.experiences.map(exp => {
            if(!exp.exp_enddate){
                return calculateMonthDifference(exp.exp_startdate, getFormattedToday())
            }else{
                return calculateMonthDifference(exp.exp_startdate, exp.exp_enddate)
            }
        })
    
        total_experiences = experiences.reduce((a,b) => a+b)
    }
    return `
        <div class="applicants-grid text-sm px-3 py-2 text-white font-second items-center hover:bg-teal-100/10 group">
            <p><input type="checkbox" name="" id="" class="bg-transparent rounded focus:ring-0"></p>
            <div class="w-[24px] h-[24px] rounded-full overflow-hidden bg-gray-200 object-cover">
                <img id="post-img" src="${applicants.profile_picture}" alt="" style="width: 100%;">
            </div>
            <a href="/recruiter/applicants/${URL_ID}/seeker/${applicants.id}" class="font-bold">${applicants.first_name} ${applicants.last_name}</a>
            <p>${seekerpost.Rejected.rejectedMessage}</p>
            <p>${total_experiences} months</p>
            <p>${applicants.educations.length !== 0 ? applicants.educations[0].edu_program : "No Education"} <br> <span class="text-xs text-white-60">${applicants.educations.length !== 0 ? applicants.educations[0].edu_institution : "-"}</span></p>
            <p>Freshgraduate</p>
            <form class="flex gap-1 items-center opacity-0 group-hover:opacity-100">
                <p class="hidden">${applicants.SeekerPost.id}</p>
                <button type="button" class="button-reject px-3 py-1 bg-[#FC4545]/20 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1">Cancel</button>
            </form>
        </div>
    `
}

function getFormattedToday() {
    const today = new Date();
  
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    // Padding digit bulan dan tanggal dengan '0' jika diperlukan
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
  
    // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
    const formattedToday = `${year}-${month}-${day}`;
  
    return formattedToday;
}

function calculateMonthDifference(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    return totalMonths;
}