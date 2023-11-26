let RECRUITER_ID
const USER_ID = $("#user_id").text()
$(".navbar-internship").addClass("selected")

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

let OPEN_POSTS = []

$.get("/api/v1/posts", function(postsData){
    OPEN_POSTS = postsData.datas.filter(post => post.post_status == "IN-PROGRESS")
    const LOCATION = []
    $("#cards-count").text(OPEN_POSTS.length)
    OPEN_POSTS.forEach(post => {
        if(LOCATION.indexOf(post.post_location) === -1) LOCATION.push(post.post_location);
        $("#cards-grid").append(addCard(post))
    })
    LOCATION.forEach(loc => $("#explore-filter-location").append(`<option value="${loc}">${loc}</option>`))
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

$("#explore-search-input").on("input", function(){
    explore_input = $(this).val()
    if(explore_input.length == 0){
        $("#cards-grid").html("")
        $.get("/api/v1/posts", function(postsData){
            const OPEN_POSTS = postsData.datas.filter(post => post.post_status == "IN-PROGRESS")
            $("#cards-count").text(OPEN_POSTS.length)
            OPEN_POSTS.forEach(post => {
                $("#cards-grid").append(addCard(post))
            })
        })
    }else{
        $("#cards-grid").html("")
        $.get(`/api/v1/posts?title=${explore_input}`, function(postsData){
            const OPEN_POSTS = postsData.datas.filter(post => post.post_status == "IN-PROGRESS")
            $("#cards-count").text(OPEN_POSTS.length)
            OPEN_POSTS.forEach(post => {
                $("#cards-grid").append(addCard(post))
            })
        })
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

function addCard(post){
    const SAVED_ID = post.saved.map(save => save.id)

    let nolove = `<input name="loved" type="checkbox" value="" class="sr-only peer card-love">
                    <img src="/img/Nolove.png" alt="" class="cursor-pointer">`
    let withlove = `<input name="loved" type="checkbox" value="" class="sr-only peer card-love" checked>
                    <img src="/img/Loved.png" alt="" class="cursor-pointer">`
    return `
    <a href="/posts/${post.id}">
        <div class="bg-card-grey hover:bg-[#3b3b3b] rounded-lg p-3">
            <div class="flex gap-3">
                <div class="w-[44px] h-[44px] rounded-lg overflow-hidden bg-white">
                    <img src="${post.recruiter[0].rec_org_logo}" alt="" class="w-full h-full object-cover">
                </div>
                <div class="head">
                    <p id="card-post-position" class="text-white text-base font-extrabold">${post.post_position}</p>
                    <div class="flex items-center gap-2">
                        <p class="flex items-center gap-1 text-xs font-second font-bold text-white-60"><span id="card-post-org">${post.recruiter[0].rec_org_name}</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.49998 12.8333L2.43332 12.4166C2.31109 12.3944 2.20832 12.3305 2.12498 12.225C2.04165 12.1194 2.01109 12 2.03332 11.8666L2.26665 9.86664L0.949984 8.33331C0.861095 8.24442 0.81665 8.13331 0.81665 7.99998C0.81665 7.86664 0.861095 7.75553 0.949984 7.66664L2.26665 6.14998L2.03332 4.14998C2.01109 4.01664 2.04165 3.8972 2.12498 3.79164C2.20832 3.68609 2.31109 3.6222 2.43332 3.59998L4.49998 3.18331L5.53332 1.39998C5.59998 1.28886 5.69443 1.21109 5.81665 1.16664C5.93887 1.1222 6.06109 1.12775 6.18332 1.18331L7.99998 2.03331L9.81665 1.18331C9.93887 1.12775 10.0639 1.11664 10.1916 1.14998C10.3194 1.18331 10.4111 1.26109 10.4666 1.38331L11.5166 3.18331L13.5666 3.59998C13.6889 3.6222 13.7916 3.68609 13.875 3.79164C13.9583 3.8972 13.9889 4.01664 13.9667 4.14998L13.7333 6.14998L15.05 7.66664C15.1389 7.75553 15.1833 7.86664 15.1833 7.99998C15.1833 8.13331 15.1389 8.24442 15.05 8.33331L13.7333 9.86664L13.9667 11.8666C13.9889 12 13.9583 12.1194 13.875 12.225C13.7916 12.3305 13.6889 12.3944 13.5666 12.4166L11.5166 12.8333L10.4666 14.6166C10.4111 14.7389 10.3194 14.8166 10.1916 14.85C10.0639 14.8833 9.93887 14.8722 9.81665 14.8166L7.99998 13.9666L6.18332 14.8166C6.06109 14.8722 5.93887 14.8778 5.81665 14.8333C5.69443 14.7889 5.59998 14.7111 5.53332 14.6L4.49998 12.8333ZM6.93332 9.86664C7.03332 9.96664 7.14998 10.0166 7.28332 10.0166C7.41665 10.0166 7.53332 9.96664 7.63332 9.86664L10.7167 6.81664C10.8055 6.72775 10.8472 6.61386 10.8417 6.47498C10.8361 6.33609 10.7833 6.21664 10.6833 6.11664C10.5833 6.01664 10.4639 5.96942 10.325 5.97498C10.1861 5.98053 10.0611 6.03331 9.94998 6.13331L7.28332 8.78331L6.06665 7.49998C5.96665 7.38886 5.84165 7.33609 5.69165 7.34164C5.54165 7.3472 5.41665 7.40553 5.31665 7.51664C5.21665 7.62775 5.16387 7.75553 5.15832 7.89998C5.15276 8.04442 5.20554 8.16664 5.31665 8.26664L6.93332 9.86664Z" fill="#3DD1DB"/>
                        </svg></p>
                        <p class="font-second text-xs text-white-60 font-medium">-</p>
                        <p class="font-second text-xs text-white-60 font-medium">Resp. Time ~3.1 days</p>
                    </div>
                </div>
            </div>
            <div class="status my-3">
                <p class="text-[#FC4545] bg-[#DB3D3D]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">INTERNSHIP</p>
            </div>
            <div class="description flex flex-col gap-2">
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V4.66667H4.66667V2H11.3333V7.33333H14V14H8.66667V11.3333H7.33333V14H2ZM3.33333 12.6667H4.66667V11.3333H3.33333V12.6667ZM3.33333 10H4.66667V8.66667H3.33333V10ZM3.33333 7.33333H4.66667V6H3.33333V7.33333ZM6 10H7.33333V8.66667H6V10ZM6 7.33333H7.33333V6H6V7.33333ZM6 4.66667H7.33333V3.33333H6V4.66667ZM8.66667 10H10V8.66667H8.66667V10ZM8.66667 7.33333H10V6H8.66667V7.33333ZM8.66667 4.66667H10V3.33333H8.66667V4.66667ZM11.3333 12.6667H12.6667V11.3333H11.3333V12.6667ZM11.3333 10H12.6667V8.66667H11.3333V10Z" fill="white" fill-opacity="0.4"/>
                </svg>${post.post_location_type} • ${post.post_location}</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.2 11.1333L11.1334 10.2L8.66671 7.73331V4.66665H7.33337V8.26665L10.2 11.1333ZM8.00004 14.6666C7.07782 14.6666 6.21115 14.4916 5.40004 14.1416C4.58893 13.7916 3.88337 13.3166 3.28337 12.7166C2.68337 12.1166 2.20837 11.4111 1.85837 10.6C1.50837 9.78887 1.33337 8.9222 1.33337 7.99998C1.33337 7.07776 1.50837 6.21109 1.85837 5.39998C2.20837 4.58887 2.68337 3.88331 3.28337 3.28331C3.88337 2.68331 4.58893 2.20831 5.40004 1.85831C6.21115 1.50831 7.07782 1.33331 8.00004 1.33331C8.92226 1.33331 9.78893 1.50831 10.6 1.85831C11.4112 2.20831 12.1167 2.68331 12.7167 3.28331C13.3167 3.88331 13.7917 4.58887 14.1417 5.39998C14.4917 6.21109 14.6667 7.07776 14.6667 7.99998C14.6667 8.9222 14.4917 9.78887 14.1417 10.6C13.7917 11.4111 13.3167 12.1166 12.7167 12.7166C12.1167 13.3166 11.4112 13.7916 10.6 14.1416C9.78893 14.4916 8.92226 14.6666 8.00004 14.6666Z" fill="white" fill-opacity="0.4"/>
                </svg>${post.post_work_time} • ${post.post_work_time_perweek} work week</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="white" fill-opacity="0.4"/>
                    <circle cx="8" cy="8" r="6.5" stroke="#2A2A2A"/>
                    <path d="M4.45459 10H5.22021V8.10645H6.27295L7.27783 10H8.15967L7.05566 7.99023C7.64697 7.78857 8.0127 7.25537 8.0127 6.58545V6.57861C8.0127 5.65234 7.37695 5.06787 6.36865 5.06787H4.45459V10ZM5.22021 7.47754V5.71045H6.27295C6.86084 5.71045 7.22314 6.03857 7.22314 6.58545V6.59229C7.22314 7.15283 6.88477 7.47754 6.29346 7.47754H5.22021Z" fill="#2A2A2A"/>
                    <path d="M8.66553 11.1963H9.40381V9.39502H9.4209C9.63281 9.81201 10.0464 10.0718 10.5557 10.0718C11.458 10.0718 12.0493 9.35059 12.0493 8.20557V8.20215C12.0493 7.05371 11.4614 6.33594 10.5454 6.33594C10.0327 6.33594 9.63623 6.5957 9.4209 7.02295H9.40381V6.4043H8.66553V11.1963ZM10.354 9.43604C9.79688 9.43604 9.40039 8.95068 9.40039 8.20557V8.20215C9.40039 7.45361 9.79346 6.96826 10.354 6.96826C10.9316 6.96826 11.2974 7.43652 11.2974 8.20215V8.20557C11.2974 8.96436 10.9351 9.43604 10.354 9.43604Z" fill="#2A2A2A"/>
                </svg>Rp.${post.post_thp}</p>
            </div>
            <div class="period flex justify-between items-center mt-3">
                <div class="flex gap-1">
                    <p class="text-white-80 font-second text-xs font-bold">Posted 1 week ago</p>
                    <p class="text-white-60 font-second text-xs font-bold">Apply before ${formatDate(post.post_deadline)}</p>
                </div>
                <form>
                    <label class="relative inline-flex items-center cursor-pointer">
                        ${SAVED_ID.includes(+USER_ID)? withlove : nolove}
                        <p id="card_id" style="display: none;">${post.id}</p>
                    </label>
                </form>
            </div>
        </div>
    </a>
    `
}